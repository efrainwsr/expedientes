const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/bandas.js');
const jwt = require("jsonwebtoken");


router.post('/getAllBandas', async (req, res) => {

    const result = await queries.getAllBandas();
    //console.log(result);
    
    res.json({
        //error: false,
        data: result
    })
})


router.post('/createBanda', async (req, res) =>{
    //console.log(req.body, "EN ROUTER CREATEORG")
    const schemaCreateBanda = Joi.object({
        nombre: Joi.string().required().max(255),
        descripcion: Joi.any().optional(),
        zona: Joi.any().optional(),
        activo: Joi.boolean().required()
    })

    
    //Esta línea utiliza el esquema Joi definido para validar req.body (los datos enviados por el cliente).
    const { error } = schemaCreateBanda.validate(req.body);
    
    /*Si se encuentra un error (los datos entrantes no coinciden con el esquema), responde 
    estado 400 Bad Request para que no continue con datos no validos*/

    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }
    
    //Verificacion de usuarios exixtentes, si existe, no lo crea.
    const bandaExist = await queries.bandaExist(req.body.nombre);
    if (bandaExist.exist && bandaExist.error) {
        return res.status(500).json(bandaExist); // Error de conexión a la base de datos
    }
    
    if (bandaExist.exist) {
        return res.status(400).json({ error: true, message: 'Ya existe una banda con este nombre.' });
    }
    
    const data = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        zona: req.body.zona,
        activo: req.body.activo
    }
    

    const result = await queries.createBanda(data);
    res.json({
        error: false,
        data: result
    })
})



router.post('/updateBanda', async (req, res) => {
    try {

        // Esquema base común para todos los campos
        const baseSchema = Joi.object({
            id_banda: Joi.number().required(),
            nombre: Joi.string().min(3).max(255).required(),
            descripcion: Joi.any().optional(),
            zona: Joi.any().optional(),
            activo: Joi.boolean().required()
        });

        const { error } = baseSchema.validate(req.body);
        if (error) {
            console.log("Error de validación:", error.details[0].message);
            return res.status(400).json({ 
                error: error.details[0].message 
            });
        }

        // Verificar si la banda existe (excepto si es el mismo nombre)
        const bandaExist = await queries.bandaExist(req.body.nombre);
        ;
        
        if (bandaExist && bandaExist.error) {
            return res.status(500).json(bandaExist);
        }
        
        if (bandaExist.exist && bandaExist.id_banda !== req.body.id_banda) {
            return res.status(400).json({ 
                error: true, 
                message: 'Esta banda ya esta registrada.' 
            });
        }

        // Preparar datos para actualización
        const data = {
            id_banda: req.body.id_banda,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            zona: req.body.zona,
            activo: req.body.activo
        };


        // Ejecutar actualización
        const result = await queries.updateBanda(data);
        //console.log("Resultado de la actualización:", result);

        res.json({ 
            error: false, 
            data: result,
            message: 'Banda actualizado correctamente.'
        });

    } catch (err) {
        console.error("Error en updateBanda:", err);
        res.status(500).json({ 
            error: true, 
            message: 'Error interno del servidor',
            details: err.message 
        });
    }
});

module.exports = router;
