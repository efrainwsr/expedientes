const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/org.js');
const jwt = require("jsonwebtoken");


router.post('/getAllOrg', async (req, res) => {

    const result = await queries.getAllOrg();
    //console.log(result);
    
    res.json({
        //error: false,
        data: result
    })
})


router.post('/createOrg', async (req, res) =>{
    //console.log(req.body, "EN ROUTER CREATEORG")
    const schemaCreateOrg = Joi.object({
        nombre: Joi.string().required(),
        siglas: Joi.string().required(),
        activo: Joi.boolean().required()
    })

    
    //Esta línea utiliza el esquema Joi definido para validar req.body (los datos enviados por el cliente).
    const { error } = schemaCreateOrg.validate(req.body);
    
    /*Si se encuentra un error (los datos entrantes no coinciden con el esquema), responde 
    estado 400 Bad Request para que no continue con datos no validos*/

    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }
    
    //Verificacion de usuarios exixtentes, si existe, no lo crea.
    const siglasExist = await queries.siglasExist(req.body.siglas);
    console.log(req.body.siglas)
    if (siglasExist.exist && siglasExist.error) {
        return res.status(500).json(siglasExist); // Error de conexión a la base de datos
    }
    
    if (siglasExist.exist) {
        return res.status(400).json({ error: true, message: 'Este organismo ya existe!' });
    }
    
    const data = {
        nombre: req.body.nombre,
        siglas: req.body.siglas,
        activo: req.body.activo
    }
    

    const result = await queries.createOrg(data);
    res.json({
        error: false,
        data: result
    })
})



router.post('/updateUser', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Eliminar campo cedula si viene en el request
        if (req.body.cedula) {
            delete req.body.cedula;
            console.log('Campo cedula eliminado del request');
        }

        // Esquema base común para todos los campos (sin cedula)
        const baseSchema = {
            id_usuario: Joi.number().required(),
            username: Joi.string().alphanum().min(3).max(25).required(),
            nombre: Joi.string().min(3).max(25).required(),
            apellido: Joi.string().min(3).max(25).required(),
            roles: Joi.required(),
            activo: Joi.boolean().required()
        };

        // Validación condicional
        let validationSchema;
        if (req.body.pass && req.body.pass.trim() !== "") {
            validationSchema = Joi.object({
                ...baseSchema,
                pass: Joi.string().min(4).max(1024).required()
            });
            console.log("Validando con contraseña");
        } else {
            validationSchema = Joi.object(baseSchema);
            console.log("Validando sin contraseña");
        }

        // Validar los datos
        const { error } = validationSchema.validate(req.body);
        if (error) {
            console.log("Error de validación:", error.details[0].message);
            return res.status(400).json({ 
                error: error.details[0].message 
            });
        }

        // Verificar si el usuario existe (excepto si es el mismo usuario)
        const userExist = await queries.userExist(req.body.username);
        console.log("Resultado de userExist:", userExist);
        
        if (userExist && userExist.error) {
            return res.status(500).json(userExist);
        }
        
        if (userExist.exist && userExist.id_usuario !== req.body.id_usuario) {
            return res.status(400).json({ 
                error: true, 
                message: 'Este nombre de usuario ya está en uso!' 
            });
        }

        // Preparar datos para actualización (sin cedula)
        const data = {
            id_usuario: req.body.id_usuario,
            username: req.body.username,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            roles: req.body.roles,
            activo: req.body.activo
        };

        // Solo hashear y agregar contraseña si se proporcionó
        if (req.body.pass && req.body.pass.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            data.pass = await bcrypt.hash(req.body.pass, salt);
            console.log("Contraseña hasheada y agregada");
        }

        // Ejecutar actualización
        const result = await queries.updateUser(data);
        console.log("Resultado de la actualización:", result);

        res.json({ 
            error: false, 
            data: result,
            message: 'Usuario actualizado correctamente'
        });

    } catch (err) {
        console.error("Error en updateUser:", err);
        res.status(500).json({ 
            error: true, 
            message: 'Error interno del servidor',
            details: err.message 
        });
    }
});

module.exports = router;
