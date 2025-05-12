const express = require('express');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({ msg: `Misiones del usuario ${req.uid}` });
});

router.post('/complete', verifyToken, (req, res) => {
  res.json({ msg: `Misión completada por ${req.uid}` });
});

module.exports = router;
