const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/delitos.js');
const jwt = require("jsonwebtoken");


router.post('/getAllDelitos', async (req, res) => {

    const result = await queries.getAllDelitos();
    //console.log(result);
    
    res.json({
        //error: false,
        data: result
    })
})


router.post('/createDelito', async (req, res) =>{
    //console.log(req.body, "EN ROUTER CREATEORG")
    const schemaCreateOrg = Joi.object({
        nombre: Joi.string().required().max(255),
        descripcion: Joi.any().optional(),
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
    const delitoExist = await queries.delitoExist(req.body.nombre);
    console.log(req.body.nombre)
    if (delitoExist.exist && delitoExist.error) {
        return res.status(500).json(delitoExist); // Error de conexión a la base de datos
    }
    
    if (delitoExist.exist) {
        return res.status(400).json({ error: true, message: 'Este delito ya esta registrado!' });
    }
    
    const data = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        activo: req.body.activo
    }
    

    const result = await queries.createDelito(data);
    res.json({
        error: false,
        data: result
    })
})


router.post('/updateDelito', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Esquema base común para todos los campos
        const baseSchema = Joi.object({
            id_delito: Joi.number().required(),
            nombre: Joi.string().min(3).max(100).required(),
            descripcion: Joi.any().optional(),
            activo: Joi.boolean().required()
        });

        const { error } = baseSchema.validate(req.body);
        if (error) {
            console.log("Error de validación:", error.details[0].message);
            return res.status(400).json({ 
                error: error.details[0].message 
            });
        }

        // Verificar si las siglas existen (excepto si son las mismas siglas)
        const delitoExist = await queries.delitoExist(req.body.nombre);
        console.log("Resultado de delitoExist:", delitoExist);
        
        if (delitoExist && delitoExist.error) {
            return res.status(500).json(delitoExist);
        }
        
        if (delitoExist.exist && delitoExist.id_delito !== req.body.id_delito) {
            return res.status(400).json({ 
                error: true, 
                message: 'Este delito ya esta registrado.' 
            });
        }

        // Preparar datos para actualización
        const data = {
            id_delito: req.body.id_delito,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            activo: req.body.activo
        };


        // Ejecutar actualización
        const result = await queries.updateDelito(data);
        console.log("Resultado de la actualización:", result);

        res.json({ 
            error: false, 
            data: result,
            message: 'Delito actualizado correctamente'
        });

    } catch (err) {
        console.error("Error en updateDelito:", err);
        res.status(500).json({ 
            error: true, 
            message: 'Error interno del servidor',
            details: err.message 
        });
    }
});

module.exports = router;
