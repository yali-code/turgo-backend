const express = require('express');
const app = express();
const port = 3000;

// Basit bir GET isteği
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
