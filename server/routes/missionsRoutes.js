const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { getUserMissions } = require('../controllers/missionsController');

const router = express.Router();

router.get('/', verifyToken, getUserMissions);

router.post('/complete', verifyToken, (req, res) => {
  res.json({ msg: `Misión completada por ${req.uid}` });
});

module.exports = router;
