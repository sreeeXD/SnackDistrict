import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./database.db");


// Initialize tables
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
});

export default db;
