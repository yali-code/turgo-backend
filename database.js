const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// PostgreSQL bağlantı ayarları
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Heroku'da SSL gereklidir
    : false, // Yerel çalışmada SSL devre dışı
});

// Bağlantıyı test et
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Veritabanına bağlanırken hata oluştu:', err.stack);
  } else {
    console.log('✅ PostgreSQL bağlantısı başarılı!');
    release();
  }
});

module.exports = pool;

