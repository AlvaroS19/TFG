const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { getUserMissions, completeMission, getCompletedMissions } = require('../controllers/missionsController');

const router = express.Router();

router.get('/', verifyToken, getUserMissions);
router.post('/complete', verifyToken, completeMission);
router.get('/completed', verifyToken, getCompletedMissions);

module.exports = router;
