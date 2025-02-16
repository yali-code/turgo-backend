const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware'ler
app.use(cors()); // CORS desteği
app.use(morgan('dev')); // Loglama için
app.use(express.json()); // JSON veri desteği

// PORT (Heroku için dinamik, local için 3000)
const PORT = process.env.PORT || 3000;

// 🏠 Ana Sayfa Route
app.get('/', (req, res) => {
  res.send('Hello, World! API Çalışıyor 🚀');
});

// 📌 Yeni Route: JSON veri döndüren API
app.get('/api/data', (req, res) => {
  res.json({
    message: "Bu API artık çalışıyor!",
    status: "success",
    data: {
      id: 1,
      name: "Tur Go Backend",
      version: "1.0.0"
    }
  });
});

// 📌 Yeni Route: Dinamik Route (ID ile veri çekme)
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({
    message: "Kullanıcı bilgisi",
    status: "success",
    user: {
      id: userId,
      name: `User ${userId}`
    }
  });
});

// 📌 Yeni Route: POST request ile veri gönderme
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.json({
    message: "Yeni kullanıcı oluşturuldu!",
    status: "success",
    user: {
      name,
      email
    }
  });
});

// 📌 Yeni Route: 404 - Sayfa bulunamadı
app.use((req, res) => {
  res.status(404).json({
    message: "Bu sayfa bulunamadı!",
    status: "error"
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});


