const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ PostgreSQL Bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware'ler
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ✅ Ana Sayfa
app.get('/', (req, res) => {
  res.send('Hello, World! API Çalışıyor 🚀');
});

// ✅ Kullanıcıları Listele
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ✅ Kullanıcı Kayıt (Signup)
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    res.json({ message: 'Kullanıcı başarıyla oluşturuldu!', user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ✅ Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

