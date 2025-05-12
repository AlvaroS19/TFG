const express = require('express');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/stats', verifyToken, (req, res) => {
  res.json({ message: `Stats del usuario ${req.uid}` });
});

module.exports = router;
