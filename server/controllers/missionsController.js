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

const completeMission = async (req, res) => {
  const uid = req.uid;
  const { description, type } = req.body;

  if (!description || !type) {
    return res.status(400).json({ error: 'Faltan campos: description o type' });
  }

  // Asignar XP según el tipo de misión
  const xpGained = type === 'weekly' ? 30 : 10;

  const newMission = {
    description,
    type,
    completedAt: new Date().toISOString(),
  };

  try {
    // Guardar la misión como completada
    const completedRef = db.collection('missionsCompleted').doc(uid);
    const docSnap = await completedRef.get();

    if (!docSnap.exists) {
      await completedRef.set({ completed: [newMission] });
    } else {
      await completedRef.update({
        completed: admin.firestore.FieldValue.arrayUnion(newMission)
      });
    }

    // Actualizar o crear XP del usuario
    const statsRef = db.collection('userStats').doc(uid);
    const statsSnap = await statsRef.get();

    if (!statsSnap.exists) {
      await statsRef.set({ xp: xpGained, level: 1 });
    } else {
      const currentData = statsSnap.data();
      const updatedXP = (currentData.xp || 0) + xpGained;
      const newLevel = Math.floor(updatedXP / 100) + 1;

      await statsRef.update({
        xp: updatedXP,
        level: newLevel
      });
    }

    res.status(200).json({
      msg: `✅ Misión completada y ${xpGained} XP añadidos`,
      mission: newMission,
      xpEarned: xpGained
    });

  } catch (error) {
    console.error('Error al completar misión:', error);
    res.status(500).json({ error: 'Error al completar misión' });
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
