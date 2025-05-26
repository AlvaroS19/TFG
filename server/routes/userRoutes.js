const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { getUserStats, getUserProgress, getUserRewards,updateUserConfig, getUserConfig } = require('../controllers/userController');

const router = express.Router();

router.get('/stats', verifyToken, getUserStats);
router.get('/progress', verifyToken, getUserProgress);
router.get('/rewards', verifyToken, getUserRewards);


module.exports = router;
