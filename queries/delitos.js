const conn = require('../connection.js');

async function delitoExist(data) {
  console.log(data, "data de delitoExist")
  try { 
    const [results, fields] = await conn.execute('SELECT nombre, id_delito FROM delitos WHERE nombre = ?', [data]);
    console.log(results," delito Exist!" )
    return results.length > 0 ? {exist: true, id_delito: results[0].id_delito} : false;
  } catch (err) {
    console.error('Error en la consulta de delitoExist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}


async function createDelito(data) {
  console.log(data, "data de createDelito")
  try {
    const [results, fields] = await conn.execute('INSERT INTO delitos (nombre, descripcion, activo) VALUES (?, ?, ?)',
    [data.nombre, data.descripcion, data.activo]);
    //console.log(results, "EN CREATE ORG")
    return results;
  } catch (err) {
    console.error('Error en la consulta de createDelito:', err.message);
    return { error: true, message: err };
  }
}


async function updateDelito(data) {
  console.log("datos en updateOrg", data)
  try {
        const [results, fields] = await conn.execute('UPDATE delitos SET nombre = ?, descripcion = ?, activo = ? WHERE id_delito = ?',
        [data.nombre, data.descripcion, data.activo, data.id_delito]);
        return results;
  } catch (err) {
    console.error('Error en la consulta de updateOrg:', err.message);
    return { error: true, message: err };
  }
}



async function getAllDelitos(){
  try {
    const [results, fields] = await conn.execute('SELECT * FROM delitos');

  //console.log(results); // results contains rows returned by server
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

module.exports = {getAllDelitos, createDelito, delitoExist, updateDelito}

//createUser();

//getAllUsers();