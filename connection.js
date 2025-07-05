const mysql = require('mysql2/promise');
require('dotenv').config()


const conn = mysql.createPool({
  host: 'shinkansen.proxy.rlwy.net',
  user: 'root',
  password: 'AJZHqmHKlIzayutXVUbidRXRXxruBgk',
  database: 'expedientes',
  port: '53237',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = conn;