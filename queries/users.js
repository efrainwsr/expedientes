const conn = require('../connection.js');

async function userExist(data) {
  try { 
    const [results, fields] = await conn.execute('SELECT username FROM usuarios WHERE username = ?', [data]);
    return results.length > 0 ? true : false;
  } catch (err) {
    console.error('Error en la consulta de userExist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}


async function createUser(data) {
  try {
    const [results, fields] = await conn.execute('INSERT INTO usuarios (cedula, username, pass, nombre, apellido, roles, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.cedula, data.username, data.pass, data.nombre, data.apellido, data.roles, data.activo,]);
    return results;
  } catch (err) {
    console.error('Error en la consulta de createUser:', err.message);
    return { error: true, message: err };
  }
}


async function getAllUsers(){
  try {
    const [results, fields] = await conn.execute('SELECT id_usuario, username, cedula, nombre, apellido, roles, activo FROM usuarios');

  console.log(results); // results contains rows returned by server
  //console.log(fields); // fields contains extra meta data about results, if available

  return results;
} catch (err) {
  return err;
  console.log(err);
}
}

/*
async function login(usuario) {
  try {
    const [results, fields] = await conn.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return results.length > 0 ? results : null;
  } catch (err) {
    console.error('Error en la consulta de login:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}*/

module.exports = {getAllUsers, createUser, userExist, /*login*/}

//createUser();

//getAllUsers();