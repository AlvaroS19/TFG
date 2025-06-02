const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const { getUserStats, getUserProgress, getUserRewards, getUserConfig, getUserObjective, updateUserConfig,saveUserConfig } = require('../controllers/userController');



router.get('/stats', verifyToken, getUserStats);
router.get('/progress', verifyToken, getUserProgress);
router.get('/rewards', verifyToken, getUserRewards);
router.get('/config', verifyToken, getUserConfig, updateUserConfig);
router.get('/objective', verifyToken, getUserObjective);
router.post('/user/config', verifyToken, saveUserConfig);

module.exports = router;