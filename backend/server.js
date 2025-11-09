// ===== Import Dependencies =====
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

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
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected:", dbPath);
  }
});

// ===== Create Tables if Not Exist =====
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

  // ✅ Ensure default admin exists
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
const router = express.Router();

// 🔑 Admin Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (row) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});

// ➕ Add a Snack
router.post("/add-snack", (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  db.run(
    "INSERT INTO snacks (name, price, image) VALUES (?, ?, ?)",
    [name, price, image],
    err => {
      if (err) {
        console.error("Error adding snack:", err.message);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true });
    }
  );
});

// 📦 Get All Snacks
router.get("/snacks", (req, res) => {
  db.all("SELECT * FROM snacks", [], (err, rows) => {
    if (err) {
      console.error("Error fetching snacks:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(rows);
  });
});

// ❌ Delete a Snack
router.delete("/delete-snack/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM snacks WHERE id = ?", [id], err => {
    if (err) {
      console.error("Error deleting snack:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true });
  });
});

// Mount admin routes under /api/admin
app.use("/api/admin", router);

// ===== Serve Frontend =====
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
