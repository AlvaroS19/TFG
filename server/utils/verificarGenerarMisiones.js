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

    // ✅ Comprobar si ya hay una misión diaria generada hoy
    const snapshot = await missionsRef
      .where("categoria", "==", "diaria")
      .orderBy("generatedAt", "desc")
      .limit(1)
      .get();

    const ultimaMision = snapshot.docs[0]?.data();
    const fechaUltima = ultimaMision ? new Date(ultimaMision.generatedAt.toDate?.() || ultimaMision.generatedAt) : null;

    if (fechaUltima) {
      fechaUltima.setHours(0, 0, 0, 0);
      if (fechaUltima.getTime() === hoy.getTime()) {
        console.log("✅ Ya existe una misión diaria para hoy:", ultimaMision.titulo);
        return;
      }
    }

    // ✅ Cargar catálogo según el objetivo
    const catalogRef = db.collection("missionsCatalog").doc(objetivo);
    const catalogSnap = await catalogRef.get();

    if (!catalogSnap.exists) {
      console.error("❌ No se encontró el catálogo para objetivo:", objetivo);
      return;
    }

    const catalogo = catalogSnap.data();

    if (!catalogo.daily || !Array.isArray(catalogo.daily)) {
      console.error("❌ El catálogo no tiene misiones diarias válidas.");
      return;
    }

    // ✅ Verificar cuáles ya han sido asignadas por título
    const yaAsignadasSnapshot = await missionsRef
      .where("categoria", "==", "diaria")
      .get();

    const yaAsignadas = yaAsignadasSnapshot.docs.map(doc => doc.data().titulo);
    const misionDisponible = catalogo.daily.find(m => !yaAsignadas.includes(m.titulo));

    if (!misionDisponible) {
      console.log("📴 Ya se asignaron todas las misiones del catálogo");
      return;
    }

    // ✅ Guardar misión nueva
    const nuevaMision = {
      ...misionDisponible,
      categoria: "diaria",
      generatedAt: new Date(), // ← Timestamp real
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