const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// MySQL setup for both Users and Products
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // use your MySQL password
  database: 'task', // Use your database name
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// Multer setup for file upload (for both profile photo and product photo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage });

// Register route (User Registration)
app.post('/register', upload.single('profilePhoto'), (req, res) => {
  const { name, email, password } = req.body;
  const profilePhoto = req.file?.filename;

  if (!name || !email || !password || !profilePhoto) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO users (name, email, password, profile_photo) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, password, profilePhoto], (err) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

// Login route (User Login)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = { ...results[0] };
    delete user.password; // Remove password from response
    res.status(200).json({ message: 'Login successful', user });
  });
});

// Add Product route
app.post('/add-product', upload.single('photo'), (req, res) => {
  const { name, quantity, price } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!name || !quantity || !price || !photo) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO products (name, quantity, price, photo) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, quantity, price, photo], (err) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Product added successfully!' });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
