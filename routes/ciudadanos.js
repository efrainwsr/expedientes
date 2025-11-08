const router = require('express').Router();
const Joi = require('@hapi/joi');
const queries = require('../queries/ciudadanos.js');
const jwt = require("jsonwebtoken");

router.post('/buscarCiudadano', async (req, res) => {
    const result = await queries.getCiudadano(req.body.cedula);
    res.json({ 
        //error: false,
        data: result
    })  
    
})


router.post('/buscarCedulaExpediente', async (req, res) =>{
    const trimmedExpediente = req.body.expediente.trim();

    res.json({
        error: false,
        data: await queries.getCedulaExpediente(req.body.expediente)
    })
});

router.post('/getDelitosCiudadano', async (req, res) => {
    const result = await queries.getDelitosCiudadano(req.body.id_ciudadano);
    
    res.json({ 
        //error: false,
        data: result
    })  
    
})

router.post('/createDelitoCiudadano', async (req, res) =>{
    console.log(req.body, "EN ROUTER CREATE ciudadano")
    
    const schemaCreateDelitoCiudadano = Joi.object({
        expediente: Joi.any().optional(),
        id_ciudadano: Joi.number().required(),
        id_usuario_registro: Joi.number().required(),
        id_organismo: Joi.number().required(),
        fecha_detencion: Joi.string().required(),
        lugar_detencion: Joi.string().required().max(255),
        id_delito: Joi.number().required(),
        observaciones: Joi.any().optional(),
    })
    
    //Esta línea utiliza el esquema Joi definido para validar req.body (los datos enviados por el cliente).
    const { error } = schemaCreateDelitoCiudadano.validate(req.body);  
    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }
    
    if (req.body.expediente != "") {
        const expedienteExist = await queries.expedienteExist(req.body.expediente);
        if (expedienteExist.exist && expedienteExist.error) {
            return res.status(500).json(expedienteExist); // Error de conexión a la base de datos
        }
        if (expedienteExist.exist) {
            return res.status(400).json({ error: true, message: 'Ya hay un registro con este expediente.' });
        }
    }
    
    const data = {
        expediente: req.body.expediente || "",
        id_ciudadano: req.body.id_ciudadano,
        id_usuario_registro: req.body.id_usuario_registro,
        id_organismo: req.body.id_organismo,
        fecha_detencion: req.body.fecha_detencion,
        lugar_detencion: req.body.lugar_detencion || "",
        id_delito: req.body.id_delito,
        observaciones: req.body.observaciones || "",
        fecha_registro: null,
        fecha_actualizacion: null
    }
    
    
    const result = await queries.createDelitoCiudadano(data);
    res.json({
        error: false,
        data: result
    })
})


router.post('/createCiudadano', async (req, res) =>{
    //console.log(req.body, "EN ROUTER CREATE ciudadano")
    
    const schemaCreateCiudadano = Joi.object({
        id_ciudadano: Joi.any().optional(),
        cedula: Joi.number().required(),
        nombres: Joi.string().required().max(255),
        apellidos: Joi.string().required().max(255),
        //alias: Joi.string().required().max(50),
        alias: Joi.any().optional(),
        prefijo_nac: Joi.string().required().max(50),
        fecha_nacimiento: Joi.string().required().max(10),
        sexo: Joi.string().required().max(1),
        telefono: Joi.any().optional(),
        id_banda: Joi.number().required(),
        id_estado: Joi.number().required(),
        id_municipio: Joi.number().required(),
        id_parroquia: Joi.number().required(),
        direccion: Joi.string().required().max(255),
        foto: Joi.any().optional(),
    })
    
    //Esta línea utiliza el esquema Joi definido para validar req.body (los datos enviados por el cliente).
    const { error } = schemaCreateCiudadano.validate(req.body);
    
    /*Si se encuentra un error (los datos entrantes no coinciden con el esquema), responde 
    estado 400 Bad Request para que no continue con datos no validos*/
    
    if(error){
        return res.status(400).json({ 
            error: error.details[0].message
        })
    }
    
    //Verificacion de usuarios exixtentes, si existe, no lo crea.
    const ciudadanoExist = await queries.ciudadanoExist(req.body.cedula);
    if (ciudadanoExist.exist && ciudadanoExist.error) {
        return res.status(500).json(ciudadanoExist); // Error de conexión a la base de datos
    }
    
    if (ciudadanoExist.exist) {
        return res.status(400).json({ error: true, message: 'Este numero de cedula ya esta registrado.' });
    }
    
    const data = {
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        alias: req.body.alias,
        fecha_nacimiento: req.body.fecha_nacimiento,
        telefono: req.body.telefono,
        foto: req.body.foto,
        direccion: req.body.direccion,
        id_estado: req.body.id_estado,
        id_municipio: req.body.id_municipio,
        id_parroquia: req.body.id_parroquia,
        id_banda: req.body.id_banda,
        prefijo_nac: req.body.prefijo_nac,
        sexo: req.body.sexo,
        telefono: req.body.telefono,
    }
    
    
    const result = await queries.createCiudadano(data);
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
