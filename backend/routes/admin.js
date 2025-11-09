import express from "express";
import { db } from "../server.js";

const router = express.Router();

// ===== Admin Login =====
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM admin WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: "Invalid credentials" });
      res.json({ success: true });
    }
  );
});

// ===== Get Snacks =====
router.get("/snacks", (req, res) => {
  db.all("SELECT * FROM snacks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ===== Add Snack =====
router.post("/snack", (req, res) => {
  const { name, price, image } = req.body;
  db.run(
    "INSERT INTO snacks (name, price, image) VALUES (?, ?, ?)",
    [name, price, image || ""],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ===== Delete Snack =====
router.delete("/snack/:id", (req, res) => {
  db.run("DELETE FROM snacks WHERE id = ?", [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ===== Get Orders =====
router.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default router;
