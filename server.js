const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL DB connection
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(process.env.SSL_CA_PATH)
  }
});


// Connect to DB and create tables
db.connect((err) => {
  if (err) {
    return console.error('❌ Connection failed:', err);
  }
  console.log('✅ Connected to Aiven MySQL (avien_db)');

  // Create `users` table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.query(createUsersTable, (err) => {
    if (err) console.error('❌ Failed to create users table:', err);
    else console.log('✅ Table "users" created successfully!');
  });

  // Create `contact_submissions` table
  const createContactsTable = `
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      subject VARCHAR(200),
      message TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.query(createContactsTable, (err) => {
    if (err) console.error('❌ Failed to create contact_submissions table:', err);
    else console.log('✅ Table "contact_submissions" created successfully!');
  });
});

// POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const query = `
    INSERT INTO contact_submissions (name, email, subject, message, submitted_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(query, [name, email, subject, message], (err) => {
    if (err) {
      console.error('❌ Failed to insert contact submission:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: '✅ Contact form submitted successfully!' });
  });
});

// GET /api/users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /api/contacts
app.get('/api/contacts', (req, res) => {
  db.query('SELECT * FROM contact_submissions', (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch contact submissions:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
