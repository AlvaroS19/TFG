const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { getUserStats, getUserProgress, getUserRewards,updateUserConfig } = require('../controllers/userController');

const router = express.Router();

router.get('/stats', verifyToken, getUserStats);
router.get('/progress', verifyToken, getUserProgress);
router.get('/rewards', verifyToken, getUserRewards);
router.put('/config', verifyToken, updateUserConfig);

module.exports = router;
