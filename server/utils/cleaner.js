const { db } = require("../services/firebase");

const cleanOldUncompletedMissions = async (uid) => {
  const missionsRef = db.collection("users").doc(uid).collection("missions");

  const snapshot = await missionsRef
    .where("completada", "==", false)
    .get();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let eliminadas = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.generatedAt) continue;

    const fechaGenerada = new Date(data.generatedAt);
    fechaGenerada.setHours(0, 0, 0, 0);

    const diferenciaDias = (hoy - fechaGenerada) / (1000 * 60 * 60 * 24);
    if (diferenciaDias >= 1) {
      await doc.ref.delete();
      eliminadas++;
    }
  }

  if (eliminadas > 0) {
    console.log(`🧹 ${eliminadas} misiones antiguas no completadas eliminadas para UID: ${uid}`);
  }
};

module.exports = {
  cleanOldUncompletedMissions,
};