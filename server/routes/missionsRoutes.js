const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {getUserMissions, completeMission, getCompletedMissions, createMission} = require('../controllers/missionsController');
const { verificarGenerarMisiones } = require('../utils/verificarGenerarMisiones');

router.get('/', verifyToken, getUserMissions);
router.post('/complete', verifyToken, completeMission);
router.get('/completed', verifyToken, getCompletedMissions);
router.post('/create', verifyToken, createMission);
router.get('/missions', verifyToken, getUserMissions);

router.post('/test/verificar', verifyToken, async (req, res) => {
  const uid = req.uid;
  const { objetivo } = req.body;

  if (!objetivo) {
    return res.status(400).json({ error: 'Falta el campo objetivo en el cuerpo' });
  }

  try {
    await verificarGenerarMisiones(uid, objetivo);
    res.json({ ok: true, mensaje: 'Misión diaria verificada/regenerada' });
  } catch (error) {
    console.error('❌ Error al verificar desde Postman:', error);
    res.status(500).json({ error: 'Error interno al regenerar misión' });
  }
});

module.exports = router;