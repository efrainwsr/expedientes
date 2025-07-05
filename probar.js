const db = require('./connection.js');
async function getUsers() {
  try {
    const users = await db.query('SELECT * FROM users');
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

console.log(getUsers)