const { db } = require("../services/firebase");
const obtenerMisionesPorObjetivo = require("./obtenerMisionesPorObjeto.js");

const generarExtras = async (uid, objetivo) => {
  try {
    const configRef = db.collection("userConfig").doc(uid);
    const configSnap = await configRef.get();
    const config = configSnap.exists ? configSnap.data() : {};

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ultimaExtra = config.lastExtraMissionCheck
      ? new Date(config.lastExtraMissionCheck)
      : null;

    if (ultimaExtra) {
      ultimaExtra.setHours(0, 0, 0, 0);
      const mismaSemana =
        hoy.getFullYear() === ultimaExtra.getFullYear() &&
        getWeekNumber(hoy) === getWeekNumber(ultimaExtra);

      if (mismaSemana) {
        console.log("✅ Ya se generaron misiones extra esta semana.");
        return;
      }
    }

    // Obtener misiones aleatorias desde el catálogo
    const semanal = await obtenerMisionesPorObjetivo(objetivo, "weekly", 1);
    const especial = await obtenerMisionesPorObjetivo(objetivo, "especial", 1);

    const missionsRef = db.collection("users").doc(uid).collection("missions");
    const misiones = [...semanal, ...especial];

    for (const mision of misiones) {
      const nuevaMision = {
        ...mision,
        completada: false,
        desbloqueada: true,
        generatedAt: new Date().toISOString(),
        unlockAt: new Date().toISOString()
      };

      await missionsRef.add(nuevaMision);
      console.log(`🎯 Misión ${mision.categoria} generada: ${mision.titulo}`);
    }

    // ✅ Guardar la fecha de generación
    await configRef.set({ lastExtraMissionCheck: new Date().toISOString() }, { merge: true });

  } catch (error) {
    console.error("❌ Error al generar misiones extra:", error);
  }
};

// 🔢 Función para sacar el número de semana del año
function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000));
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

module.exports = { generarExtras };