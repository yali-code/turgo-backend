const { Pool } = require('pg');
require('dotenv').config();  // .env dosyasını kullanabilmek için

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // DATABASE_URL ortam değişkeni
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
