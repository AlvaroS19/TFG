const { db } = require("../services/firebase");

const verificarGenerarMisiones = async (uid, objetivo) => {
  try {
    console.log("📡 Ejecutando verificarGenerarMisiones con:", uid, objetivo);

    const missionsRef = db
      .collection("users")
      .doc(uid)
      .collection("missions");

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

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
        console.log("✅ Ya existe una misión diaria para hoy:", ultimaMision.titulo);
        return;
      }
    }

    const catalogRef = db.collection("missionsCatalog").doc(objetivo);
    const catalogSnap = await catalogRef.get();

    if (!catalogSnap.exists) {
      console.error("❌ No se encontró el catálogo para objetivo:", objetivo);
      return;
    }

    const catalogo = catalogSnap.data();
    const yaAsignadasSnapshot = await missionsRef
      .where("categoria", "==", "diaria")
      .get();

    const index = yaAsignadasSnapshot.size;

    if (index >= catalogo.daily.length) {
      console.log("📴 Ya se asignaron todas las misiones del catálogo");
      return;
    }

    const nuevaMision = {
      ...catalogo.daily[index],
      categoria: "diaria",
      generatedAt: new Date().toISOString(),
      completada: false,
    };

    await missionsRef.add(nuevaMision);
    console.log("🆕 Misión diaria asignada:", nuevaMision.titulo);
  } catch (error) {
    console.error("❌ Error REAL capturado en verificarGenerarMisiones:", error);
    throw error;
  }
};

module.exports = { verificarGenerarMisiones };