const express = require('express');
const cors = require('cors');
const missionsRoutes = require('./routes/missionsRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/missions', missionsRoutes);
app.use('/user', userRoutes);

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);                     

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

