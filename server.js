const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs'); // Şifreleri güvenli hale getirmek için
const pool = require('./database'); // PostgreSQL bağlantısı
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware'ler
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ✅ Ana Sayfa
app.get('/', (req, res) => {
  res.send('Hello, World! API Çalışıyor 🚀');
});

// ✅ Kullanıcıları Listeleme (Şifresiz)
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users'); // Şifreyi göstermiyoruz
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
    // Şifreyi güvenli hale getir (hash'le)
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

// ✅ Kullanıcı Giriş (Login)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Kullanıcıyı e-posta ile ara
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = result.rows[0];

    // Girilen şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Hatalı şifre' });
    }

    res.json({ message: 'Giriş başarılı!', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ✅ Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
