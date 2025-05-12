
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();


app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const missionsRoutes = require('./routes/missionsRoutes');


app.use('/auth', authRoutes);  
app.use('/user', userRoutes);       
app.use('/missions', missionsRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
