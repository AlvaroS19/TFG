const { db } = require('../services/firebase');

const hoy = new Date();
hoy.setHours(0, 0, 0, 0); // Dejamos solo fecha

const cleanOldMissionsForUser = async (uid) => {
  const missionsRef = db.collection('users').doc(uid).collection('missions');
  const snapshot = await missionsRef.get();
  let countDeleted = 0;

  for (const doc of snapshot.docs) {
    const m = doc.data();
    const generatedAt = m.generatedAt ? new Date(m.generatedAt) : null;

    if (
      m.completada === false &&
      generatedAt &&
      generatedAt.getTime() < hoy.getTime()
    ) {
      await doc.ref.delete();
      console.log(`🧹 Eliminada misión antigua de ${uid}: ${m.titulo}`);
      countDeleted++;
    }
  }

  return countDeleted;
};

const runCleanup = async () => {
  try {
    const usersSnapshot = await db.collection('users').get();
    console.log(`🧾 Analizando ${usersSnapshot.size} usuarios...`);

    for (const userDoc of usersSnapshot.docs) {
      const uid = userDoc.id;
      const deletedCount = await cleanOldMissionsForUser(uid);
      if (deletedCount > 0) {
        console.log(`✅ ${deletedCount} misiones eliminadas para usuario ${uid}`);
      } else {
        console.log(`🔹 ${uid}: sin misiones antiguas que eliminar`);
      }
    }

    console.log('🎉 Limpieza terminada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar misiones:', error);
    process.exit(1);
  }
};

runCleanup();
