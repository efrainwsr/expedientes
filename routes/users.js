const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/users.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


router.post('/getAllUsers', async (req, res) => {

    const result = await queries.getAllUsers();
    //console.log(result);
    
    res.json({
        //error: false,
        data: result
    })
})


router.post('/createUser', async (req, res) =>{
    const schemaCreateUser = Joi.object({
        cedula: Joi.number().min(7).required(),
        username: Joi.string().alphanum().min(3).max(25).required(),
        pass: Joi.string().min(4).max(1024).required(),
        nombre: Joi.string().min(3).max(25).required(),
        apellido: Joi.string().min(3).max(25).required(),
        roles: Joi.required(),
        activo: Joi.boolean().required(),
        //fecha_creacion: Joi.string(),
        //ultimo_login: Joi.string(),
    })
    
    //Esta línea utiliza el esquema Joi definido para validar req.body (los datos enviados por el cliente).
    const { error } = schemaCreateUser.validate(req.body);
    
    /*Si se encuentra un error (los datos entrantes no coinciden con el esquema), responde 
    estado 400 Bad Request para que no continue con datos no validos*/

    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }
    
    //Verificacion de usuarios exixtentes, si existe, no lo crea.
    const userExist = await queries.userExist(req.body.username);
    if (userExist && userExist.error) {
        return res.status(500).json(userExist); // Error de conexión a la base de datos
    }
    
    if (userExist) {
        return res.status(400).json({ error: true, message: 'Este usuario ya existe!' });
    }
    
    //const userExist = await queries.userExist(req.body.usuario);
    
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.pass, salt);
    
    const data = {
        cedula: req.body.cedula,
        username : req.body.username,
        pass     : password,
        nombre : req.body.nombre,
        apellido : req.body.apellido,
        roles  : req.body.roles,
        activo: req.body.activo,
        //fecha_creacion: req.body.fecha_creacion ,
        ultimo_login: req.body.ultimo_login,
    }
    

    const result = await queries.createUser(data);
    res.json({
        error: false,
        data: result
    })
})

module.exports = router;
