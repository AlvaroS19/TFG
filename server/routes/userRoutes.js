const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const { getUserStats, getUserProgress, getUserRewards } = require('../controllers/userController');



router.get('/stats', verifyToken, getUserStats);
router.get('/progress', verifyToken, getUserProgress);
router.get('/rewards', verifyToken, getUserRewards);


module.exports = router;