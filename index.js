const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
//const serverUrl = 'http://10.0.0.239:5173/'
const serverUrl = 'http://192.168.0.39:5173/'
const app = express();

const corsOptions = {
  origin: '*', // Reemplaza con la URL correcta de tu frontend
  credentials: true,
  //optionsSuccessStatus: 200 // Opcionalmente personalizar el éxito de la solicitud preflight
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Autohorization', 'auth-token']
};

app.use(cors(corsOptions));

// ####### CAPTURAR BODY #######
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit:50000}));
app.use(express.json());


// ####### IMPORT ROUTES #######
const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js');
const orgRoutes = require('./routes/org.js');
const delitosRoutes = require('./routes/delitos.js');
const bandasRoutes = require('./routes/bandas.js');
const validToken = require('./routes/middlewares/verify-token.js');






// ## Route middlewares
app.use('/api/users',validToken, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/org', validToken, orgRoutes);
app.use('/api/delitos', validToken, delitosRoutes);
app.use('/api/bandas', validToken, bandasRoutes);


app.get('/', (req, res) => {
  res.json({
    estado: true,
    mensaje: 'funciona!'
  });
});

// ###### INICIAR SERVIDOR SOLO LOCALMENTE ######
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port: ${PORT}`);
  });
}

// Para Vercel, exporta el handler compatible con serverless
module.exports = (req, res) => {
  return app(req, res);
};