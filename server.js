const express = require('express');
const cors = require('cors');
const pool = require('./database'); // PostgreSQL bağlantısı
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Otelleri Listeleme (GET /hotels)
app.get('/hotels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotels');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Otel Ekleme (POST /hotels)
app.post('/hotels', async (req, res) => {
  const { name, address, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO hotels (name, address, price) VALUES ($1, $2, $3) RETURNING *',
      [name, address, price]
    );
    res.json({ message: 'Hotel added successfully', hotel: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Turları Listeleme (GET /tours)
app.get('/tours', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tours');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Tur Ekleme (POST /tours)
app.post('/tours', async (req, res) => {
  const { name, city, price_per_person } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tours (name, city, price_per_person) VALUES ($1, $2, $3) RETURNING *',
      [name, city, price_per_person]
    );
    res.json({ message: 'Tour added successfully', tour: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
