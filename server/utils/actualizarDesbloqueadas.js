const { db } = require('../services/firebase');

const actualizarMisionesDesbloqueadas = async (uid) => {
  const hoy = new Date();

  const missionsRef = db.collection('users').doc(uid).collection('missions');
  const snapshot = await missionsRef
    .where('completada', '==', false)
    .where('desbloqueada', '==', false)
    .get();

  const batch = db.batch();
  let desbloqueadas = 0;

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const unlockDate = new Date(data.unlockAt);

    if (!isNaN(unlockDate) && unlockDate <= hoy) {
      const docRef = missionsRef.doc(doc.id);
      batch.update(docRef, { desbloqueada: true });
      desbloqueadas++;
      console.log(`🔓 Misión desbloqueada automáticamente: ${data.titulo}`);
    }
  });

  if (desbloqueadas > 0) {
    await batch.commit();
    console.log(`✅ ${desbloqueadas} misión(es) desbloqueadas.`);
  } else {
    console.log("🕒 No había misiones para desbloquear.");
  }
};

module.exports = { actualizarMisionesDesbloqueadas };