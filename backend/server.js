// ===== Import Dependencies =====
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3"; // ✅ make sure this import is here!

// ===== Import Routes =====
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

// ===== Setup Express =====
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== Setup Paths =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Initialize Database =====
sqlite3.verbose();
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS snacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT,
    room_no TEXT,
    phone TEXT,
    items TEXT,
    total REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // ✅ Ensure custom admin (sreeXD / sree318) exists
  db.get("SELECT * FROM admin WHERE username = ?", ["sreeXD"], (err, row) => {
    if (err) {
      console.error("Admin check error:", err.message);
      return;
    }
    if (!row) {
      db.run(
        "INSERT INTO admin (username, password) VALUES (?, ?)",
        ["sreeXD", "sree318"],
        err2 => {
          if (err2) {
            console.error("Admin insert error:", err2.message);
          } else {
            console.log("✅ Default admin (sreeXD / sree318) created.");
          }
        }
      );
    } else {
      console.log("✅ Admin already exists in database.");
    }
  });
});

export { db };

// ===== Serve Frontend Folder =====
app.use(express.static(path.join(__dirname, "../frontend")));

// ===== API Routes =====
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// ===== Catch-all Route (for frontend) =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
