const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Joi = require('@hapi/joi');
const queries = require('../queries/auth.js');

router.post('/login', async (req, res) => {

  const schemaCredentials = Joi.object({
    usuario: Joi.string().min(3).max(25).required(),
    pwd: Joi.string().min(4).max(1024).required()
  });
  

  const { error } = schemaCredentials.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  
  const userCredentials = await queries.login(req.body.usuario);
  if (userCredentials && userCredentials.error) {
    return res.status(500).json(userCredentials); // Error de conexión a la base de datos
  }


  if (!userCredentials) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrecto' });
  }

  //Verificacion de usuarios exixtentes, si existe, no lo crea.
    const isUserActive = await queries.userActive(req.body.usuario);
    if (!isUserActive && isUserActive.error) {
        return res.status(500).json(isUserActive); // Error de conexión a la base de datos
    }
    
    if (!isUserActive) {
        return res.status(403).json({ error: true, message: 'Usuario inactivo' });
    }


  
  const validPassword = await bcrypt.compare(req.body.pwd, userCredentials[0].pass);
  if (!validPassword) {
    return res.status(400).json({ error: true, message: 'Usuario o contraseña incorrecto' });
  }


   // --- Lógica para actualizar el ultimo_login ---
    try {
        // Llama a la función que activará el ON UPDATE CURRENT_TIMESTAMP en la DB
        await queries.updateLastLogin(userCredentials[0].id_usuario);
    } catch (updateErr) {
        console.error("Error al actualizar ultimo_login durante el login:", updateErr);
    }
    // --- Fin de la lógica ---

  

  // Create token
  const token = jwt.sign({
    user: userCredentials[0].username,
    roles: userCredentials[0].roles,
    status: userCredentials[0].activo
  }, process.env.TOKEN_SECRET);



  const userInfo = {
    id: userCredentials[0].id_usuario,
    usuario: userCredentials[0].username,
    nombre: userCredentials[0].nombre,
    apellido: userCredentials[0].apellido,
    roles: [userCredentials[0].roles],
    status: userCredentials[0].activo,
    /*fechaCreacion: userCredentials[0].fecha_creacion,
    ultimoLogin: userCredentials[0].ultimo_login*/
  }


  res.header('auth-token', token).json({
    error: false,
    token: token,
    user: userInfo

  })
});

module.exports = router;
