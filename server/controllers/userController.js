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

    res.status(200).json({
      uid,
      xp,
      level
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = { getUserStats };