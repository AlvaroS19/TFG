const { db } = require("../services/firebase");
const obtenerMisionesPorObjetivo  = require("./obtenerMisionesPorObjeto.js");

const asignarMisionesIniciales = async (uid, objetivo) => {
  console.log("🚀 Asignando misiones iniciales para:", uid, objetivo);

  const misionesPorObjetivo = await obtenerMisionesPorObjetivo(objetivo);

  if (!misionesPorObjetivo || !Array.isArray(misionesPorObjetivo)) {
    throw new Error("❌ No se pudieron cargar misiones desde el catálogo");
  }

  const hoy = new Date();

  const missionsRef = db.collection("users").doc(uid).collection("missions");
  const batch = db.batch();

  misionesPorObjetivo.forEach(m => {
    let unlockDate = new Date(hoy); // por defecto: hoy mismo

    switch (m.categoria) {
      case "diaria":
        unlockDate = new Date(); // disponible hoy
        break;
      case "semanal":
        unlockDate.setDate(hoy.getDate() + 7); // 7 días después
        break;
      case "especial":
        unlockDate = null; // sin fecha de desbloqueo fija
        break;
    }

    const nuevaMision = {
      ...m,
      completada: false,
      desbloqueada: false,
      unlockAt: unlockDate ? unlockDate.toISOString() : null,
      generatedAt: hoy.toISOString(),
    };

    const newDocRef = missionsRef.doc(); // documento individual
    batch.set(newDocRef, nuevaMision);
  });

  await batch.commit();
  console.log("✅ Misiones con tiempos de desbloqueo guardadas correctamente");
};

module.exports = { asignarMisionesIniciales };
