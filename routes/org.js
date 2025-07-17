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



router.post('/updateOrg', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Esquema base común para todos los campos
        const baseSchema = Joi.object({
            id_organismo: Joi.number().required(),
            nombre: Joi.string().min(3).max(100).required(),
            siglas: Joi.string().min(1).max(25).required(),
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
        const siglasExist = await queries.siglasExist(req.body.siglas);
        console.log("Resultado de siglasExist:", siglasExist);
        
        if (siglasExist && siglasExist.error) {
            return res.status(500).json(siglasExist);
        }
        
        if (siglasExist.exist && siglasExist.id_organismo !== req.body.id_organismo) {
            return res.status(400).json({ 
                error: true, 
                message: 'Estas siglas ya estan registradas!' 
            });
        }

        // Preparar datos para actualización
        const data = {
            id_organismo: req.body.id_organismo,
            nombre: req.body.nombre,
            siglas: req.body.siglas,
            activo: req.body.activo
        };


        // Ejecutar actualización
        const result = await queries.updateOrg(data);
        console.log("Resultado de la actualización:", result);

        res.json({ 
            error: false, 
            data: result,
            message: 'Organismo actualizado correctamente'
        });

    } catch (err) {
        console.error("Error en updateOrg:", err);
        res.status(500).json({ 
            error: true, 
            message: 'Error interno del servidor',
            details: err.message 
        });
    }
});

module.exports = router;
