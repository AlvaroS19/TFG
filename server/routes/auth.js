const express = require('express');
const router = express.Router();
require('dotenv').config();

const { login, registerUser } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', registerUser);

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.clearCookie('idToken');
    res.json({ message: 'Sesión cerrada correctamente' });
  });
});

module.exports = router;
