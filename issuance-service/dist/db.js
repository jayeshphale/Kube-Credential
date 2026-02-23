"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const DB_PATH = process.env.DB_PATH || (process.env.NODE_ENV === "test" ? ":memory:" : "./issuance.db");
const db = new sqlite3_1.default.Database(DB_PATH);
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS credentials (
      id TEXT PRIMARY KEY,
      name TEXT,
      course TEXT,
      issuedAt TEXT
    )
  `);
});
exports.default = db;
