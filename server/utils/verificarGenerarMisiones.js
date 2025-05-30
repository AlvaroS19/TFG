const { db } = require('../services/firebase');

const verificarGenerarMisiones = async (uid, objetivo) => {
  try {
    console.log("📡 Ejecutando verificarGenerarMisiones con:", uid, objetivo);

    const docRef = db.collection('missions').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log("📭 No hay misiones para el usuario:", uid);
      return;
    }

    const userMissions = docSnap.data();
    const misionesActuales = userMissions.daily || [];

    console.log("📦 Misiones actuales:", misionesActuales.length);

    const hoy = new Date();
    const misionDeHoy = misionesActuales.find(m => {
      const fecha = new Date(m.generatedAt);
      return (
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );
    });

    if (misionDeHoy) {
      console.log("✅ Ya hay misión de hoy:", misionDeHoy.titulo);
      return;
    }

    const catalogRef = db.collection('missionsCatalog').doc(objetivo);
    const catalogSnap = await catalogRef.get();

    if (!catalogSnap.exists) {
      console.error("❌ No se encontró el catálogo para objetivo:", objetivo);
      return;
    }

    const catalogo = catalogSnap.data();
    const index = misionesActuales.length;

    if (index >= catalogo.daily.length) {
      console.log("📴 Ya se asignaron todas las misiones del catálogo");
      return;
    }

    const nuevaMision = {
      ...catalogo.daily[index],
      generatedAt: hoy.toISOString(),
    };

    const nuevasMisiones = [...misionesActuales, nuevaMision];

    await docRef.update({
      daily: nuevasMisiones
    });

    console.log("🆕 Misión añadida:", nuevaMision.titulo);

  } catch (error) {
    console.error("❌ Error REAL capturado en verificarGenerarMisiones:", error);
    throw error;
  }
};

module.exports = { verificarGenerarMisiones };