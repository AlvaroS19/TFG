const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const { getUserStats, getUserRewards, getUserConfig, 
        getUserObjective, updateUserConfig,saveUserConfig, getXpHistory, getXpSummary } = require('../controllers/userController');



router.get('/stats', verifyToken, getUserStats);
router.get('/rewards', verifyToken, getUserRewards);
router.get('/config', verifyToken, getUserConfig, updateUserConfig);
router.get('/objective', verifyToken, getUserObjective);
router.post('/user/config', verifyToken, saveUserConfig);
router.get('/xp-history', verifyToken, getXpHistory);
router.get('/xp/summary', verifyToken, getXpSummary);
module.exports = router;