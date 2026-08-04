const { db } = require("../services/firebase");

const fixUnlockAtForAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection("users").get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const missionsRef = db.collection("users").doc(userId).collection("missions");
      const missionsSnapshot = await missionsRef.get();

      let updated = false;
      const batch = db.batch();

      missionsSnapshot.forEach(doc => {
        const m = doc.data();
        const genDate = new Date(m.generatedAt);

        // Validar que la fecha es válida
        if (!m.generatedAt || isNaN(genDate.getTime())) {
          console.warn(`⚠️ Misión inválida en ${userId}, id ${doc.id} (fecha malformada)`);
          return;
        }

        // Agregar unlockAt si no existe
        if (!m.unlockAt) {
          batch.update(doc.ref, {
            unlockAt: genDate.toISOString(),
          });
          updated = true;
        }
      });

      if (updated) {
        await batch.commit();
        console.log(`✅ Usuario ${userId}: unlockAt corregido`);
      } else {
        console.log(`👤 Usuario ${userId}: sin cambios necesarios`);
      }
    }

    console.log("✅ Script finalizado con éxito.");
  } catch (error) {
    console.error("❌ Error al corregir misiones:", error);
  }
};

fixUnlockAtForAllUsers();