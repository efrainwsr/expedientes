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
    try {
        const [results] = await conn.execute(
            'UPDATE usuarios SET ultimo_login = NOW() WHERE id_usuario = ?',
            [idUsuario]
        );
        return results;
    } catch (err) {
        console.error('Error al actualizar ultimo_login:', err.message);
        return { error: true, message: 'Fallo al actualizar ultimo_login' };
    }
}
// --- Fin de la función ---


module.exports = {
  login,
  updateLastLogin
};