const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
//const serverUrl = 'http://10.0.0.239:5173/'
const serverUrl = 'http://192.168.0.39:5173/'
const app = express();

const corsOptions = {
  origin: '*', // Reemplaza con la URL correcta de tu frontend
  //optionsSuccessStatus: 200 // Opcionalmente personalizar el éxito de la solicitud preflight
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Autohorization']
};

app.use(cors(corsOptions));

// ####### CAPTURAR BODY #######
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit:50000}));
app.use(express.json());


// ####### IMPORT ROUTES #######
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const validToken = require('./routes/middlewares/verify-token.js');

const dptosRoutes = require('./routes/dptos');





// ## Route middlewares
app.use('/api/users'/*,validToken*/, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dptos', validToken, dptosRoutes);

app.get('/', (req, res) => {
  res.json({
    estado: true,
    mensaje: 'funciona!'
  });
});

// ###### INICIAR SERVIDOR ######
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => { // Escuchar en todas las interfaces de red
  console.log(`server running on port: ${PORT}`);
});
