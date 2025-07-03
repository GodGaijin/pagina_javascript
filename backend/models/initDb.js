const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/inventory.db');
const db = new sqlite3.Database(dbPath);

// Users table: id, username, password, role
// Products: id, product_name, serial_number, product_details, price, amount, commerce_name, category_name
// Distributors: id, commerce_name, location
// Product_category: id_category, category_name, category_details

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'admin'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS product_category (
    id_category INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL,
    category_details TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS distributors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commerce_name TEXT NOT NULL,
    location TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    product_details TEXT,
    price REAL NOT NULL,
    amount INTEGER NOT NULL,
    id_commerce INTEGER NOT NULL,
    id_category INTEGER NOT NULL,
    FOREIGN KEY (id_category) REFERENCES product_category(id_category) ON DELETE RESTRICT,
    FOREIGN KEY (id_commerce) REFERENCES distributors(id) ON DELETE RESTRICT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS own_commerce (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rif TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT
  )`);
});

module.exports = db; 