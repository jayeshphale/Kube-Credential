import { Router, Request, Response } from "express";
import db from "./db";

const router = Router();


router.post("/", (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  db.get(
    "SELECT * FROM credentials WHERE id = ?",
    [id],
    (err, row: any) => {
      if (row) {
        const rawHost = process.env.HOSTNAME || "local-worker";
        const match = String(rawHost).match(/-(\d+)$/);
        const worker = match ? `worker-${match[1]}` : `worker-${rawHost}`;

        return res.json({
          valid: true,
          verifiedBy: worker,
          timestamp: new Date().toISOString(),
        });
      } else {
        return res.json({
          valid: false,
          message: "credential not found",
        });
      }
    }
  );
});


router.post("/internal/store", (req: Request, res: Response) => {
  const { id, name, course, issuedAt } = req.body;

  db.run(
    "INSERT INTO credentials (id, name, course, issuedAt) VALUES (?, ?, ?, ?)",
    [id, name, course, issuedAt],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "Already stored" });
      }

      return res.json({ message: "Stored in verification DB" });
    }
  );
});

export default router;