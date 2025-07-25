const conn = require('../connection.js');

async function bandaExist(data) {
  console.log(data, "data de bandaExist")
  try { 
    const [results, fields] = await conn.execute('SELECT nombre, id_banda FROM bandas WHERE nombre = ?', [data]);
    console.log(results," bandas Exist!" )
    return results.length > 0 ? {exist: true, id_banda: results[0].id_banda} : false;
  } catch (err) {
    console.error('Error en la consulta de bandaExist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}


async function createBanda(data) {
  console.log(data, "data de createOrg")
  try {
    const [results, fields] = await conn.execute('INSERT INTO bandas (nombre, descripcion, zona, activo) VALUES (?, ?, ?, ?)',
    [data.nombre, data.descripcion, data.zona, data.activo]);
    console.log(results, "EN CREATE BANDA")
    return results;
  } catch (err) {
    console.error('Error en la consulta de createBanda:', err.message);
    return { error: true, message: err };
  }
}


async function updateBanda(data) {
  console.log("datos en updateBanda", data)
  try {
        const [results, fields] = await conn.execute('UPDATE bandas SET nombre = ?, descripcion = ?, zona = ?, activo = ? WHERE id_banda = ?',
        [data.nombre, data.descripcion, data.zona, data.activo, data.id_banda]);
        return results;
  } catch (err) {
    console.error('Error en la consulta de updateBanda:', err.message);
    return { error: true, message: err };
  }
}



async function getAllBandas(){
  try {
    const [results, fields] = await conn.execute('SELECT * FROM bandas');

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

module.exports = {getAllBandas, createBanda, bandaExist, updateBanda}

//createUser();

//getAllUsers();