const { admin, db } = require('../services/firebase');
const { getRoleByLevel } = require('../utils/roles')


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
  function getXPForMission(type, difficulty) {
    const table = {
      daily: { easy: 10, medium: 15, hard: 20 },
      weekly: { normal: 30, hard: 40 },
      special: { unique: 50 },
      challenge: { insane: 70 }
    }
    return table[type]?.[difficulty] || 0
  }

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
    const newRole = getRoleByLevel(newLevel)

    if (!statsSnap.exists) {
      await statsRef.set({ xp: xpGained, level: 1 });
    } else {
      const currentData = statsSnap.data();
      const updatedXP = (currentData.xp || 0) + xpGained;
      const newLevel = Math.floor(updatedXP / 100) + 1;

      await statsRef.update({
        xp: updatedXP,
        level: newLevel,
        role: newRole
      });
    }

    res.status(200).json({
      msg: `✅ Misión completada y ${xpGained} XP añadidos`,
      mission: newMission,
      xpEarned: xpGained,
      newLevel,
      newRole
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
const createMission = async (req, res) => {
  const { titulo, descripcion, xp, categoria, dificultad } = req.body;

  if (!titulo || !descripcion || !xp || !categoria || !dificultad) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const nuevaMision = {
      userId,
      titulo,
      descripcion,
      xp,
      categoria,
      dificultad,
      createdAt: new Date().toISOString()
    };

    const doc = await db.collection('missions').add(nuevaMision);

    res.status(201).json({ message: 'Misión creada correctamente', id: doc.id });
  } catch (error) {
    console.error('Error al crear misión:', error);
    res.status(500).json({ error: 'Error al crear misión' });
  }
};

module.exports = {
  getUserMissions,
  completeMission,
  getCompletedMissions,
  createMission,
};
