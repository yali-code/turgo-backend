const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database');
require('dotenv').config();

const router = express.Router();

// Kullanıcı kayıt (Register)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
  }

  try {
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Hata oluştu', error });
  }
});

// Kullanıcı giriş (Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Lütfen email ve şifre girin' });
  }

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Giriş başarılı', token });
  } catch (error) {
    res.status(500).json({ message: 'Hata oluştu', error });
  }
});

module.exports = router;
