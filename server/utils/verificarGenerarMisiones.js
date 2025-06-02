const { db } = require("../services/firebase");
const { cleanOldUncompletedMissions } = require("../utils/cleaner");

const verificarGenerarMisiones = async (uid, objetivo) => {
  try {
    await cleanOldUncompletedMissions(uid);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const configRef = db.collection("userConfig").doc(uid);
    const configSnap = await configRef.get();
    const configData = configSnap.exists ? configSnap.data() : {};

    const ultimaFechaVerificada = configData.lastMissionCheck
      ? new Date(configData.lastMissionCheck)
      : null;

    if (ultimaFechaVerificada) {
      ultimaFechaVerificada.setHours(0, 0, 0, 0);
      if (ultimaFechaVerificada.getTime() === hoy.getTime()) {
        console.log("✅ Ya se verificó la misión hoy.");
        return;
      }
    }

    const missionsRef = db.collection("users").doc(uid).collection("missions");

    const snapshot = await missionsRef
      .where("categoria", "==", "diaria")
      .orderBy("generatedAt", "desc")
      .limit(1)
      .get();

    const ultimaMision = snapshot.docs[0]?.data();
    const fechaUltima = ultimaMision ? new Date(ultimaMision.generatedAt) : null;

    if (fechaUltima) {
      fechaUltima.setHours(0, 0, 0, 0);
      if (fechaUltima.getTime() === hoy.getTime()) {
        console.log("✅ Ya hay misión para hoy:", ultimaMision.titulo);
        await configRef.set({ lastMissionCheck: new Date().toISOString() }, { merge: true });
        return;
      }
    }

    const catalogSnap = await db.collection("missionsCatalog").doc(objetivo).get();
    const catalogo = catalogSnap.data();

    const yaAsignadas = await missionsRef.where("categoria", "==", "diaria").get();
    const index = yaAsignadas.size;

    if (index >= catalogo.daily.length) return;

    const nuevaMision = {
      ...catalogo.daily[index],
      categoria: "diaria",
      generatedAt: new Date().toISOString(),
      completada: false,
      desbloqueada: false,
      unlockAt: new Date().toISOString() // Se desbloquea hoy mismo
    };

    await missionsRef.add(nuevaMision);
    console.log("🎉 Nueva misión generada:", nuevaMision.titulo);

    await configRef.set({ lastMissionCheck: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("❌ Error al verificar/generar misiones:", error);
    throw error;
  }
};

module.exports = { verificarGenerarMisiones };