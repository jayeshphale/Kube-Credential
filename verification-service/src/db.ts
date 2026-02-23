import sqlite3 from "sqlite3";

const DB_PATH = process.env.DB_PATH || (process.env.NODE_ENV === "test" ? ":memory:" : "./verification.db");

const db = new sqlite3.Database(DB_PATH);

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

export default db;