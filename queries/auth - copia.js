const conn = require('../connection.js');

async function login(usuario) {
  try {
    const [results, fields] = await conn.execute('SELECT * FROM usuarios WHERE username = ?', [usuario]);
    console.log(usuario)

    return results.length > 0 ? results : null;
  } catch (err) {
    console.error('Error en la consulta de login:', err.message);
    return { error: true, message: 'Fallo en la conexión a la base de datos' };
  }
}


async function updateLastLogin(idUsuario) {
  console.log("idUsuario", idUsuario)
    try {
        // Obtiene la fecha y hora actual del servidor en formato UTC (ISO 8601)
        const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato MySQL DATETIME

        const [results] = await conn.execute(
            'UPDATE usuarios SET ultimo_login = ? WHERE id_usuario = ?',
            [now, idUsuario]
        );
        return results;
    } catch (err) {
        console.error('Error al actualizar ultimo_login:', err.message);
        return { error: true, message: 'Fallo al actualizar ultimo_login' };
    }
}


module.exports = {
  login,
  updateLastLogin
};