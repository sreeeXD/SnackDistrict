import express from "express";
import { db } from "../server.js";

const router = express.Router();

// ===== GET all snacks =====
router.get("/snacks", (req, res) => {
  db.all("SELECT * FROM snacks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ===== Place an order =====
router.post("/order", (req, res) => {
  const { name, room, phone, items } = req.body;
  if (!name || !room || !items || !items.length) {
    return res.status(400).json({ error: "Missing order details" });
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  db.run(
    "INSERT INTO orders (student_name, room_no, phone, items, total) VALUES (?, ?, ?, ?, ?)",
    [name, room, phone || "", JSON.stringify(items), total],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, orderId: this.lastID });
    }
  );
});

export default router;
