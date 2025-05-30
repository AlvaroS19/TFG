const { db } = require('../services/firebase');

const asignarMisionesIniciales = async (uid, objetivoFromParam = null) => {
  try {
    let objetivo = objetivoFromParam;
    if (!objetivo) {
      const userSnap = await db.collection('users').doc(uid).get();
      if (!userSnap.exists) return;
      objetivo = userSnap.data().objetivo;
    }

    const catalogSnap = await db.collection('missionsCatalog').doc(objetivo).get();
    if (!catalogSnap.exists) return;

    const misionesPorObjetivo = catalogSnap.data();

    const data = {
      daily: misionesPorObjetivo.daily || [],
      weekly: misionesPorObjetivo.weekly || [],
      generatedAt: new Date().toISOString(),
    };

    await db.collection('missions').doc(uid).set(data);
  } catch (err) {
    console.error('❌ Error al asignar misiones iniciales:', err);
  }
};

module.exports = { asignarMisionesIniciales };
