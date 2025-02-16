const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware'ler
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Ana route
app.get('/', (req, res) => {
  res.send('Hello, World! API Çalışıyor 🚀');
});

// Yeni route ekleme
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Merhaba! API çalışıyor!' });
});

app.get('/api/time', (req, res) => {
  res.json({ serverTime: new Date().toISOString() });
});

// API Dinleme
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

