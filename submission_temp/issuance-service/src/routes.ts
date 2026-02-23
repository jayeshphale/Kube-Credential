import { Router, Request, Response } from "express";
import db from "./db";
import axios from "axios";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { id, name, course } = req.body;

  if (!id || !name || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.get("SELECT * FROM credentials WHERE id = ?", [id], (err, row: any) => {
    const verificationUrl = process.env.VERIFICATION_URL || "http://localhost:6000/verify/internal/store";

    if (row) {
      // attempt to sync existing issuance to verification DB (idempotent)
      (async () => {
        try {
          await axios.post(verificationUrl, {
            id: row.id,
            name: row.name,
            course: row.course,
            issuedAt: row.issuedAt,
          });
        } catch (e) {
          const err: any = e;
          console.error('Verification sync (existing) failed:', err.message || err);
        }
      })();

      return res.json({ message: "credential already issued" });
    }

    const issuedAt = new Date().toISOString();

    db.run(
      "INSERT INTO credentials (id, name, course, issuedAt) VALUES (?, ?, ?, ?)",
      [id, name, course, issuedAt],
      async (err) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        try {
          const verificationUrl = process.env.VERIFICATION_URL || "http://localhost:6000/verify/internal/store";
          await axios.post(verificationUrl, {
            id,
            name,
            course,
            issuedAt,
          });
        } catch (error) {
          console.error("Verification sync failed:", error);
        }

        const rawHost = process.env.HOSTNAME || "local-worker";
        const match = String(rawHost).match(/-(\d+)$/);
        const worker = match ? `worker-${match[1]}` : `worker-${rawHost}`;

        return res.json({
          message: `credential issued by ${worker}`,
        });
      },
    );
  });
});

export default router;
