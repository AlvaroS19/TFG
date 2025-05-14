const admin = require('../services/firebase');
const db = admin.firestore();

const getUserMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const docRef = db.collection('missions').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'No hay misiones asignadas' });
    }

    const data = docSnap.data();
    res.json({ daily: data.daily || [], weekly: data.weekly || [] });

  } catch (error) {
    console.error('Error al obtener misiones:', error);
    res.status(500).json({ error: 'Error al obtener misiones' });
  }
};

module.exports = { getUserMissions };

const completeMission = async (req, res) => {
  const uid = req.uid;
  const { description, type } = req.body;

  if (!description || !type) {
    return res.status(400).json({ error: 'Faltan campos: description o type' });
  }

  try {
    const completedRef = db.collection('missionsCompleted').doc(uid);
    const userDoc = await completedRef.get();

    const newMission = {
      description,
      type,
      completedAt: new Date().toISOString(),
    };

    if (!userDoc.exists) {
      await completedRef.set({
        completed: [newMission],
      });
    } else {
      await completedRef.update({
        completed: admin.firestore.FieldValue.arrayUnion(newMission),
      });
    }

    res.status(200).json({ msg: 'Misión marcada como completada ✅', mission: newMission });
  } catch (error) {
    console.error('Error al marcar misión como completada:', error);
    res.status(500).json({ error: 'Error interno al completar la misión' });
  }
};

const getCompletedMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const docRef = db.collection('missionsCompleted').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(200).json({ completed: [] });
    }

    const data = docSnap.data();
    res.status(200).json({ completed: data.completed || [] });

  } catch (error) {
    console.error('Error al obtener misiones completadas:', error);
    res.status(500).json({ error: 'Error al obtener misiones completadas' });
  }
};

module.exports = {
  getUserMissions,
  completeMission,
  getCompletedMissions
};
