const admin = require('../services/firebase');
const db = admin.firestore();

const getUserStats = async (req, res) => {
  const uid = req.uid;

  try {
    const statsRef = db.collection('userStats').doc(uid);
    const docSnap = await statsRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'No hay estadísticas para este usuario' });
    }

    const { xp = 0, level = 1 } = docSnap.data();
    const progress = xp % 100;

    res.status(200).json({
      uid,
      xp,
      level,
      progress
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

const getUserProgress = async (req, res) => {
  const uid = req.uid;

  try {
    const docRef = db.collection('missionsCompleted').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(200).json({
        totalCompleted: 0,
        lastCompleted: null
      });
    }

    const data = docSnap.data();
    const completedMissions = data.completed || [];

    const totalCompleted = completedMissions.length;
    const lastCompleted = completedMissions
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]?.completedAt || null;

    res.status(200).json({
      totalCompleted,
      lastCompleted
    });

  } catch (error) {
    console.error('Error al obtener progreso del usuario:', error);
    res.status(500).json({ error: 'Error al obtener progreso del usuario' });
  }
};
const getUserRewards = async (req, res) => {
  const uid = req.uid;

  try {
    // Obtener stats del usuario
    const statsRef = db.collection('userStats').doc(uid);
    const statsSnap = await statsRef.get();

    if (!statsSnap.exists) {
      return res.status(404).json({ error: 'No hay estadísticas para este usuario' });
    }

    const { xp = 0, level = 1 } = statsSnap.data();

    // Obtener misiones completadas
    const missionsRef = db.collection('missionsCompleted').doc(uid);
    const missionsSnap = await missionsRef.get();

    const completedMissions = missionsSnap.exists
      ? missionsSnap.data().completed || []
      : [];

    const totalCompleted = completedMissions.length;

    // Definir recompensas
    const rewards = [];

    if (xp >= 50) rewards.push('🟢 Primeros pasos');
    if (xp >= 100) rewards.push('🟡 Subiendo de nivel');
    if (totalCompleted >= 5) rewards.push('🔥 Contancia');
    if (level >= 3) rewards.push('🏆 Pro en camino');

    res.status(200).json({
      uid,
      xp,
      level,
      totalCompleted,
      rewards
    });

  } catch (error) {
    console.error('Error al obtener recompensas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener recompensas del usuario' });
  }
};

const updateUserConfig = async (req, res) => {
  const uid = req.uid;
  const { nickname, goal, difficulty } = req.body;

  try {
    await db.collection('userConfig').doc(uid).set({
      ...(nickname && { nickname }),
      ...(goal && { goal }),
      ...(difficulty && { difficulty })
    }, { merge: true });

    res.status(200).json({
      msg: '✅ Configuración actualizada correctamente',
      updated: { nickname, goal, difficulty }
    });

  } catch (error) {
    console.error('Error al actualizar configuración del usuario:', error);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
};

module.exports = {
  getUserStats,
  getUserProgress,
  getUserRewards,
  updateUserConfig
};


