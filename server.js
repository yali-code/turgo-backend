const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./database'); // PostgreSQL bağlantısı
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware'ler
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Ana Route
app.get('/', (req, res) => {
  res.send('Hello, World! API Çalışıyor 🚀');
});

// Kullanıcıları çekme endpoint'i
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Yeni kullanıcı ekleme endpoint'i
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Server'ı dinle
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
