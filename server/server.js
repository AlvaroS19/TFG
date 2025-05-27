const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: 'fitquest-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, 
    secure: false,  
    sameSite: 'Lax'
  }
}));


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const missionsRoutes = require('./routes/missionsRoutes');


app.use('/auth', authRoutes);  
app.use('/user', userRoutes);       
app.use('/missions', missionsRoutes); 
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})


