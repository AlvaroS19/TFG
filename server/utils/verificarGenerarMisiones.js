const { db } = require("../services/firebase");
const { cleanOldUncompletedMissions } = require("../utils/cleaner");
const obtenerMisionesPorObjetivo = require("./obtenerMisionesPorObjeto.js");

const agregarDias = (fecha, dias) => {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
};

const siguienteLunes = (desde) => {
  const date = new Date(desde);
  const day = date.getDay();
  const diff = (8 - day) % 7;
  return agregarDias(date, diff);
};

const verificarGenerarMisiones = async (uid, objetivo) => {
  try {
    await cleanOldUncompletedMissions(uid);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const configRef = db.collection("userConfig").doc(uid);
    const configSnap = await configRef.get();
    const configData = configSnap.exists ? configSnap.data() : {};
    const ultimaFecha = configData.lastMissionCheck || null;
    const hoyStr = new Date().toDateString();

    if (ultimaFecha === hoyStr) {
      console.log('✅ Ya se verificó/generó misión hoy');
      return;
    }


    const missionsRef = db.collection("users").doc(uid).collection("missions");

    // 🟢 DIARIAS
    console.log("🔄 Generando misiones diarias...");
    const diariasSnap = await missionsRef.where("categoria", "==", "diaria").get();
    const diariasHoy = diariasSnap.docs.filter(doc => {
      const fecha = new Date(doc.data().generatedAt);
      return fecha.toDateString() === hoy.toDateString();
    });

    const faltanDiarias = 3 - diariasHoy.length;
    if (faltanDiarias > 0) {
      const nuevas = await obtenerMisionesPorObjetivo(objetivo, "daily", faltanDiarias + 5);
      let desbloqueadas = 0;

      for (const m of nuevas) {
        const esDesbloqueada = desbloqueadas < 3;

        await missionsRef.add({
          ...m,
          categoria: "diaria",
          generatedAt: new Date().toISOString(),
          completada: false,
          desbloqueada: esDesbloqueada,
          unlockAt: esDesbloqueada
            ? new Date().toISOString()
            : agregarDias(hoy, desbloqueadas + 1).toISOString()
        });

        console.log(`🟢 Misión diaria generada: ${m.titulo} (desbloqueada: ${esDesbloqueada})`);

        if (esDesbloqueada) desbloqueadas++;
        if (desbloqueadas >= 3) break;
      }
    }

    // 🟠 SEMANALES
    console.log("🔄 Generando misiones semanales y especiales...");
    const semanaInicio = siguienteLunes(hoy);
    const semanalSnap = await missionsRef
    .where("categoria", "==", "semanal")
    .where("completada", "==", false)
    .get();

   const yaHaySemanal = semanalSnap.docs.length > 0;

    if (!yaHaySemanal) {
      const semanal = await obtenerMisionesPorObjetivo(objetivo, "weekly", 1);
      if (semanal[0]) {
        await missionsRef.add({
          ...semanal[0],
          categoria: "semanal",
          generatedAt: new Date().toISOString(),
          completada: false,
          desbloqueada: false,
          unlockAt: semanaInicio.toISOString()
        });
        console.log("🟠 Misión semanal programada:", semanal[0].titulo);
      }
    }

    // 🔵 ESPECIALES
    const especialSnap = await missionsRef
      .where("categoria", "==", "especial")
      .where("completada", "==", false)
      .get();

    const yaHayEspecial = especialSnap.docs.length > 0;


    if (!yaHayEspecial) {
      const especiales = await obtenerMisionesPorObjetivo(objetivo, "special", 1);
      if (especiales[0]) {
        const unlockEspecial = siguienteLunes(agregarDias(hoy, 7));
        await missionsRef.add({
          ...especiales[0],
          categoria: "especial",
          generatedAt: new Date().toISOString(),
          completada: false,
          desbloqueada: false,
          unlockAt: unlockEspecial.toISOString()
        });
        console.log("🔵 Misión especial programada:", especiales[0].titulo);
      }
    }

    await configRef.set({ lastMissionCheck: new Date().toDateString() }, { merge: true })

  } catch (error) {
    console.error("❌ Error al verificar/generar misiones:", error);
    throw error;
  }
};

module.exports = { verificarGenerarMisiones };