const conn = require('../connection.js');

async function getEstados(){
  try {
    const [results, fields] = await conn.execute('SELECT id_estado, estado FROM estados');
    return results;
  } catch (err) {
    return err;
    console.log(err);
  }
}

async function getMunicipios(data){
  try {
    const [results, fields] = await conn.execute('SELECT id_municipio, municipio FROM municipios WHERE id_estado = ?', [data]);
    return results;
  } catch (err) {
    return err;
    console.log(err);
  }
}

async function getParroquias(data){
  try {
    const [results, fields] = await conn.execute('SELECT id_parroquia, parroquia FROM parroquias WHERE id_municipio = ?', [data]);
    return results;
  } catch (err) {
    return err;
    console.log(err);
  }
}




module.exports = {getEstados, getMunicipios, getParroquias}

//createUser();

//getAllUsers();