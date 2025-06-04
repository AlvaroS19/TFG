const { db } = require("../services/firebase");
const { cleanOldUncompletedMissions } = require("../utils/cleaner");
const obtenerMisionesPorObjetivo = require("./obtenerMisionesPorObjeto.js");

const verificarGenerarMisiones = async (uid, objetivo) => {
  try {
    // 1. Limpiar misiones no completadas y viejas
    await cleanOldUncompletedMissions(uid);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const configRef = db.collection("userConfig").doc(uid);
    const configSnap = await configRef.get();
    const configData = configSnap.exists ? configSnap.data() : {};

    // 2. Verificar si ya se generaron misiones hoy
    const ultimaFechaVerificada = configData.lastMissionCheck
      ? new Date(configData.lastMissionCheck)
      : null;

    if (ultimaFechaVerificada) {
      ultimaFechaVerificada.setHours(0, 0, 0, 0);
      if (ultimaFechaVerificada.getTime() === hoy.getTime()) {
        console.log("✅ Ya se verificó/generó misión hoy.");
        return;
      }
    }

    const missionsRef = db.collection("users").doc(uid).collection("missions");

    // 3. Obtener misiones diarias activas del usuario
    const todasDiariasSnap = await missionsRef.where("categoria", "==", "diaria").get();
    const todasDiarias = todasDiariasSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const diariasDeHoy = todasDiarias.filter(m => {
      const fecha = new Date(m.generatedAt);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime();
    });

    const CANTIDAD_MISIONES_POR_DIA = 3;

    // 4. Si ya hay suficientes misiones hoy, salir
    if (diariasDeHoy.length >= CANTIDAD_MISIONES_POR_DIA) {
      console.log(`✅ Ya hay ${diariasDeHoy.length} misiones diarias generadas hoy`);
      await configRef.set({ lastMissionCheck: new Date().toISOString() }, { merge: true });
      return;
    }

    // 5. Obtener misiones aleatorias desde catálogo por objetivo
    const faltanPorAsignar = CANTIDAD_MISIONES_POR_DIA - diariasDeHoy.length;
    const misionesAleatorias = await obtenerMisionesPorObjetivo(objetivo, "daily", faltanPorAsignar);

    if (!misionesAleatorias.length) {
      console.warn("⚠️ No se encontraron misiones para asignar.");
      return;
    }

    // 6. Guardar las nuevas misiones en Firebase
    for (const mision of misionesAleatorias) {
      const nuevaMision = {
        ...mision,
        categoria: "diaria",
        generatedAt: new Date().toISOString(),
        completada: false,
        desbloqueada: false,
        unlockAt: new Date().toISOString()
      };

      await missionsRef.add(nuevaMision);
      console.log("🎯 Nueva misión generada:", nuevaMision.titulo);
    }

    // 7. Actualizar fecha de última verificación
    await configRef.set({ lastMissionCheck: new Date().toISOString() }, { merge: true });

  } catch (error) {
    console.error("❌ Error al verificar/generar misiones:", error);
    throw error;
  }
};

module.exports = { verificarGenerarMisiones };