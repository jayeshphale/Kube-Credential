"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("./db"));
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, course } = req.body;
    if (!id || !name || !course) {
        return res.status(400).json({ message: "All fields are required" });
    }
    db_1.default.get("SELECT * FROM credentials WHERE id = ?", [id], (err, row) => {
        const verificationUrl = process.env.VERIFICATION_URL || "http://localhost:6000/verify/internal/store";
        if (row) {
            // attempt to sync existing issuance to verification DB (idempotent)
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield axios_1.default.post(verificationUrl, {
                        id: row.id,
                        name: row.name,
                        course: row.course,
                        issuedAt: row.issuedAt,
                    });
                }
                catch (e) {
                    const err = e;
                    console.error('Verification sync (existing) failed:', err.message || err);
                }
            }))();
            return res.json({ message: "credential already issued" });
        }
        const issuedAt = new Date().toISOString();
        db_1.default.run("INSERT INTO credentials (id, name, course, issuedAt) VALUES (?, ?, ?, ?)", [id, name, course, issuedAt], (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            try {
                const verificationUrl = process.env.VERIFICATION_URL || "http://localhost:6000/verify/internal/store";
                yield axios_1.default.post(verificationUrl, {
                    id,
                    name,
                    course,
                    issuedAt,
                });
            }
            catch (error) {
                console.error("Verification sync failed:", error);
            }
            const rawHost = process.env.HOSTNAME || "local-worker";
            const match = String(rawHost).match(/-(\d+)$/);
            const worker = match ? `worker-${match[1]}` : `worker-${rawHost}`;
            return res.json({
                message: `credential issued by ${worker}`,
            });
        }));
    });
}));
exports.default = router;
