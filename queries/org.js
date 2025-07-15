const conn = require('../connection.js');

async function siglasExist(data) {
  console.log(data, "data de siglasExist")
  try { 
    const [results, fields] = await conn.execute('SELECT siglas, id_organismo FROM organismos WHERE siglas = ?', [data]);
    console.log(results," siglas Exist!" )
    return results.length > 0 ? {exist: true, id_organismo: results[0].id_organismo} : false;
  } catch (err) {
    console.error('Error en la consulta de siglasExist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}


async function createOrg(data) {
  console.log(data, "data de createOrg")
  try {
    const [results, fields] = await conn.execute('INSERT INTO organismos (nombre, siglas, activo) VALUES (?, ?, ?)',
    [data.nombre, data.siglas, data.activo]);
    console.log(results, "EN CREATE ORG")
    return results;
  } catch (err) {
    console.error('Error en la consulta de createOrg:', err.message);
    return { error: true, message: err };
  }
}


async function updateOrg(data) {
  console.log(data)
  try {
    if(data.pass){
        const [results, fields] = await conn.execute('UPDATE usuarios SET username = ?, pass = ?, nombre = ?, apellido = ?, roles = ?, activo = ? WHERE id_usuario = ?',
        [data.username, data.pass, data.nombre, data.apellido, data.roles, data.activo, data.id_usuario]);
        return results;
      }else{
        const [results, fields] = await conn.execute('UPDATE usuarios SET username = ?, nombre = ?, apellido = ?, roles = ?, activo = ? WHERE id_usuario = ?',
        [data.username, data.nombre, data.apellido, data.roles, data.activo, data.id_usuario]);
        return results;
      }
  } catch (err) {
    console.error('Error en la consulta de updateUser:', err.message);
    return { error: true, message: err };
  }
}



async function getAllOrg(){
  try {
    const [results, fields] = await conn.execute('SELECT * FROM organismos');

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

module.exports = {getAllOrg, createOrg, siglasExist, updateOrg}

//createUser();

//getAllUsers();