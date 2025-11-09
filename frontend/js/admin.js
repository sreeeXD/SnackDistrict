import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const db = new sqlite3.Database("./backend/database.db");

// 🟢 Add a new snack
router.post("/add-snack", (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  db.run(
    "INSERT INTO snacks (name, price, image) VALUES (?, ?, ?)",
    [name, price, image],
    (err) => {
      if (err) {
        console.error("Error adding snack:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true });
    }
  );
});

// 🟡 Get all snacks
router.get("/snacks", (req, res) => {
  db.all("SELECT * FROM snacks", [], (err, rows) => {
    if (err) {
      console.error("Error fetching snacks:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(rows);
  });
});

// 🔴 Delete a snack
router.delete("/delete-snack/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM snacks WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting snack:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true });
  });
});

export default router;
