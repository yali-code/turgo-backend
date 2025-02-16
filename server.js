const express = require('express');
const app = express();

// Heroku'nun sağladığı PORT'u kullan, eğer tanımlı değilse 3000 kullan
const PORT = process.env.PORT || 3000;

// Basit bir GET isteği
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

