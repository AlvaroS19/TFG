const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// 🔧 CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARE
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (como Postman, apps móviles, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://fitquest-puce.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://192.168.1.131:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // En desarrollo, permitir cualquier origen
      // En producción, esto debería ser más restrictivo
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Manejar preflight requests explícitamente
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: 'fitquest-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', // true en producción
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' en producción para CORS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// 📦 Rutas API
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const missionsRoutes = require('./routes/missionsRoutes');

app.use('/auth', authRoutes);  
app.use('/user', userRoutes);       
app.use('/missions', missionsRoutes); 

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});