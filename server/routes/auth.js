const express = require('express');
const router = express.Router();
require('dotenv').config();

// ✅ Importar controladores
const { login, registerUser } = require('../controllers/authController');

// 🧠 Usar controladores
router.post('/login', login);
router.post('/register', registerUser);

// 🔐 Logout (destruir sesión y limpiar cookies)
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.clearCookie('idToken');
    res.json({ message: 'Sesión cerrada correctamente' });
  });
});

module.exports = router;
