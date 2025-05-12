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
