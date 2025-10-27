const conn = require('../connection.js');

/*
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
console.log("datos en updateOrg", data)
try {
const [results, fields] = await conn.execute('UPDATE organismos SET nombre = ?, siglas = ?, activo = ? WHERE id_organismo = ?',
[data.nombre, data.siglas, data.activo, data.id_organismo]);
return results;
} catch (err) {
console.error('Error en la consulta de updateOrg:', err.message);
return { error: true, message: err };
}
}

*/

async function getTotalDetOrg(org, rangoFechas) {
  try {
    const [results, fields] = await conn.execute('SELECT org.nombre AS org, COUNT(dc.id_expediente) AS det FROM delitos_ciudadanos dc JOIN organismos org ON dc.id_organismo = org.id_organismo WHERE org.id_organismo = ? AND dc.fecha_detencion BETWEEN ? AND ? GROUP BY org.id_organismo, org.nombre', [org, `${rangoFechas.inicio} 00:00:00`, `${rangoFechas.fin}  23:59:59`]);
    
    console.log(results, "Resultado de queries"); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    
    return results;
  } catch (err) {
    return err;
    console.log(err);
  }
}


async function getAllDet(rangoFechas) {
    console.log("6. llegamos a queries getAllDet", rangoFechas);
    console.log(rangoFechas, "rangoFechas en queries getAllDet");
    try {
        const query = `
            SELECT
                org.nombre AS org,
                COUNT(dc.id_expediente) AS det,
                GROUP_CONCAT(DISTINCT delitos.nombre SEPARATOR ', ') AS delitos
            FROM
                delitos_ciudadanos dc
            JOIN
                organismos org ON dc.id_organismo = org.id_organismo
            INNER JOIN
                delitos ON delitos.id_delito = dc.id_delito
            WHERE
                dc.fecha_detencion BETWEEN ? AND ?
            GROUP BY
                org.id_organismo, org.nombre
            ORDER BY
                org.nombre;
        `;
        const [results, fields] = await conn.execute(query, [`${rangoFechas.inicio} 00:00:00`, `${rangoFechas.fin} 23:59:59`]);
        
        console.log(results, "Resultado de getAllDet");
        return results;
    } catch (err) {
        // Es mejor registrar el error y luego devolverlo o lanzar una excepción
        console.error("Error en getAllDet:", err); 
        throw err; // Lanza el error para que sea manejado por el código que llama
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

module.exports = {getTotalDetOrg, getAllDet}; 

//createUser();

//getAllUsers();