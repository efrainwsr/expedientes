const conn = require('../connection.js');

async function expedienteExist(data) {
  try { 
    const [results, fields] = await conn.execute('SELECT expediente, id_expediente FROM delitos_ciudadanos WHERE expediente = ?', [data]);
    return results.length > 0 ? {exist: true, id_expediente: results[0].id_expediente} : false;
  } catch (err) {
    console.error('Error en la consulta de expediente exist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}

async function ciudadanoExist(data) {
  try { 
    const [results, fields] = await conn.execute('SELECT cedula, id_ciudadano FROM ciudadano WHERE cedula = ?', [data]);
    return results.length > 0 ? {exist: true, id_ciudadano: results[0].id_ciudadano} : false;
  } catch (err) {
    console.error('Error en la consulta de ciudadanoExist:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}

async function createDelitoCiudadano(data) {
  try {
    const [results, fields] = await conn.execute('INSERT INTO delitos_ciudadanos (expediente, id_ciudadano, id_usuario_registro, id_organismo, fecha_detencion, lugar_detencion, id_delito, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.expediente, data.id_ciudadano, data.id_usuario_registro, data.id_organismo, data.fecha_detencion, data.lugar_detencion, data.id_delito, data.observaciones]);
    console.log(results, "EN CREATE delito ciudadano")
    return results;
  } catch (err) {
    console.error('Error en la consulta de createDelitoCiudadano:', err.message);
    return { error: true, message: err };
  }
}


async function createCiudadano(data) {
  try {
    const [results, fields] = await conn.execute('INSERT INTO ciudadano (cedula, nombres, apellidos, alias, id_banda, fecha_nacimiento, telefono, sexo, prefijo_nac, id_estado, id_municipio, id_parroquia, direccion, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [data.cedula, data.nombres, data.apellidos, data.alias, data.id_banda, data.fecha_nacimiento, data.telefono, data.sexo, data.prefijo_nac, data.id_estado, data.id_municipio, data.id_parroquia, data.direccion, data.foto]);
    console.log(results, "EN CREATE CIUDADANO")
    return results;
  } catch (err) {
    console.error('Error en la consulta de createCiudadano:', err.message);
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


async function getCiudadano(data){
  try {
    const [results, fields] = await conn.execute('SELECT * FROM ciudadano WHERE cedula = ?', [data]);

    if(results.length < 1){
      return false
    }

    return results
  } catch (err) {
    return err;
    console.log(err);
  }
}

async function getDelitosCiudadano(data){
  try {
    const [results, fields] = await conn.execute('SELECT delc.expediente, delc.fecha_detencion, delc.observaciones, del.nombre as nombre_delito, del.descripcion as delito_desc, org.siglas as org_siglas, org.nombre as org_nombre, u.nombre as u_nombre, u.apellido as u_apellido, u.cedula as u_cedula, u.username as u_username FROM delitos_ciudadanos as delc INNER JOIN ciudadano c ON c.id_ciudadano = delc.id_ciudadano INNER JOIN delitos del ON del.id_delito = delc.id_delito INNER JOIN usuarios u ON u.id_usuario = delc.id_usuario_registro INNER JOIN organismos org ON org.id_organismo = delc.id_organismo WHERE delc.id_ciudadano = ?', [data]);
    console.log(results, "EN GET DELITOS CIUDADANO")
    if(results.length < 1){
      return false
    }

    return results
  } catch (err) {
    return err;
    console.log(err);
  }
}

module.exports = {createCiudadano, ciudadanoExist, expedienteExist, getCiudadano, createDelitoCiudadano, getDelitosCiudadano}

//createUser();

//getAllUsers();