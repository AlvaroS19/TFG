const express = require('express');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/stats', verifyToken, (req, res) => {
  res.json({ msg: `Stats del usuario ${req.uid}` });
});

router.get('/progress', verifyToken, (req, res) => {
  res.json({ msg: `Progreso del usuario ${req.uid}` });
});

router.get('/rewards', verifyToken, (req, res) => {
  res.json({ msg: `Recompensas de ${req.uid}` });
});

router.put('/config', verifyToken, (req, res) => {
  res.json({ msg: `Configuración actualizada para ${req.uid}` });
});

module.exports = router;
