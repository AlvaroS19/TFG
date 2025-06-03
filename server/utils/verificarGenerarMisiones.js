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

    // Obtener TODAS las diarias del usuario
    const todasDiariasSnap = await missionsRef.where("categoria", "==", "diaria").get();
    const todasDiarias = todasDiariasSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filtrar las que ya son de hoy
    const diariasDeHoy = todasDiarias.filter(m => {
      const fecha = new Date(m.generatedAt);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime();
    });

    const CANTIDAD_MISIONES_POR_DIA = 3;

    if (diariasDeHoy.length >= CANTIDAD_MISIONES_POR_DIA) {
      console.log(`✅ Ya hay ${diariasDeHoy.length} misiones generadas hoy`);
      await configRef.set({ lastMissionCheck: new Date().toISOString() }, { merge: true });
      return;
    }

    // Obtener catálogo
    const catalogSnap = await db.collection("missionsCatalog").doc(objetivo).get();
    const catalogo = catalogSnap.data();
    if (!catalogo || !catalogo.daily || !catalogo.daily.length) {
      console.log("⚠️ No hay misiones en el catálogo para ese objetivo");
      return;
    }

    const yaAsignadasTotal = todasDiarias.length;
    const faltanPorAsignar = CANTIDAD_MISIONES_POR_DIA - diariasDeHoy.length;

    for (let i = 0; i < faltanPorAsignar; i++) {
      const index = yaAsignadasTotal + i;
      if (index >= catalogo.daily.length) break;

      const nuevaMision = {
        ...catalogo.daily[index],
        categoria: "diaria",
        generatedAt: new Date().toISOString(),
        completada: false,
        desbloqueada: false,
        unlockAt: new Date().toISOString()
      };

      await missionsRef.add(nuevaMision);
      console.log("🎯 Nueva misión generada:", nuevaMision.titulo);
    }

    await configRef.set({ lastMissionCheck: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("❌ Error al verificar/generar misiones:", error);
    throw error;
  }
};

module.exports = { verificarGenerarMisiones };