const router = require('express').Router();
const queries = require('../queries/ubicacion.js');
const jwt = require("jsonwebtoken");


router.post('/getEstados', async (req, res) => {

    const result = await queries.getEstados();
    res.json({
        data: result
    })
})

router.post('/getMunicipios', async (req, res) => {

    const result = await queries.getMunicipios(req.body.id_estado);
    res.json({
        data: result
    })
})

router.post('/getParroquias', async (req, res) => {

    const result = await queries.getParroquias(req.body.id_municipio);
    res.json({
        data: result
    })
})



module.exports = router;
