const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {getUserMissions, completeMission, getCompletedMissions, createMission} = require('../controllers/missionsController');

router.get('/', verifyToken, getUserMissions);
router.post('/complete', verifyToken, completeMission);
router.get('/completed', verifyToken, getCompletedMissions);
router.post('/create', verifyToken, createMission);

module.exports = router;