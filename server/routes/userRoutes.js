const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const {
  getUserStats,
  getUserRewards,
  updateUserConfig,
  getXpHistory,
  getXpSummary
} = require('../controllers/userController');

router.get('/stats', verifyToken, getUserStats);
router.get('/rewards', verifyToken, getUserRewards);
router.post('/config', verifyToken, updateUserConfig);
router.get('/xp-history', verifyToken, getXpHistory);
router.get('/xp/summary', verifyToken, getXpSummary);

module.exports = router;