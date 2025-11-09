// ===== Import Dependencies =====
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

// ===== Express Setup =====
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== Path Setup =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Initialize Database =====
sqlite3.verbose();
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error("❌ DB connection failed:", err.message);
  else console.log("✅ DB connected:", dbPath);
});

// ===== Create Tables =====
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS snacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
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

  // ✅ Ensure admin exists
  db.get("SELECT * FROM admin WHERE username = ?", ["sreeXD"], (err, row) => {
    if (!row) {
      db.run(
        "INSERT INTO admin (username, password) VALUES (?, ?)",
        ["sreeXD", "sree318"],
        err2 => {
          if (err2) console.error("Admin insert error:", err2.message);
          else console.log("✅ Default admin (sreeXD / sree318) created.");
        }
      );
    } else {
      console.log("✅ Admin already exists.");
    }
  });
});

// ===== Admin Routes =====

// 🔑 Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Missing credentials" });

  db.get(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (row) return res.json({ success: true });
      else return res.status(401).json({ success: false, message: "Invalid login" });
    }
  );
});

// ➕ Add Snack
app.post("/api/admin/add-snack", (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  db.run(
    "INSERT INTO snacks (name, price, image) VALUES (?, ?, ?)",
    [name, price, image],
    err => {
      if (err) {
        console.error("Error adding snack:", err.message);
        return res.status(500).json({ success: false });
      }
      console.log(`✅ Snack added: ${name}`);
      res.json({ success: true });
    }
  );
});

// 📦 Get Snacks
app.get("/api/admin/snacks", (req, res) => {
  db.all("SELECT * FROM snacks", [], (err, rows) => {
    if (err) {
      console.error("Error fetching snacks:", err.message);
      return res.status(500).json({ success: false });
    }
    res.json(rows);
  });
});

// ❌ Delete Snack
app.delete("/api/admin/delete-snack/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM snacks WHERE id = ?", [id], err => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
