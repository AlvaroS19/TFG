const { admin, db } = require("../services/firebase");
const { actualizarMisionesDesbloqueadas } = require('../utils/actualizarDesbloqueadas')
const obtenerMisionesPorObjetivo = require('../utils/obtenerMisionesPorObjeto.js');

const getUserMissions = async (req, res) => {
  const uid = req.uid;

  try {
    await actualizarMisionesDesbloqueadas(uid);

    const missionsSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('missions')
      .get();

    const misiones = missionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      ok: true,
      total: misiones.length,
      misiones,
    });
  } catch (error) {
    console.error('❌ Error al obtener misiones:', error);
    return res.status(500).json({ error: 'Error interno al obtener misiones' });
  }
};

const completeMission = async (req, res) => {
  const uid = req.uid;
  const { missionId } = req.body;

  if (!missionId) {
    return res.status(400).json({ error: "Falta el ID de la misión a completar" });
  }
  console.log("📥 Llamando a completeMission para:", missionId);
  try {
    const missionRef = db
      .collection("users")
      .doc(uid)
      .collection("missions")
      .doc(missionId);

    const missionSnap = await missionRef.get();
    if (!missionSnap.exists) {
      return res.status(404).json({ error: "No se encontró la misión" });
    }

    const missionData = missionSnap.data();

    if (missionData.completada) {
      return res.status(200).json({ok: false,msg: "La misión ya estaba completada"});
    }

    const now = new Date().toISOString();

    await missionRef.update({
      completada: true,
      completedAt: now,
    });

    const completedRef = db
      .collection("users")
      .doc(uid)
      .collection("missionsCompleted")
      .doc(missionId);
      
    await completedRef.set({
      ...missionData,
      completada: true,
      completedAt: now,
    });

    // Actualizar XP
    const statsRef = db.collection("userStats").doc(uid);
    const statsSnap = await statsRef.get();

    let currentXP = 0;
    let currentLevel = 1;

    if (statsSnap.exists) {
      const stats = statsSnap.data();
      currentXP = stats.xp || 0;
      currentLevel = stats.level || 1;
    }

    const newXP = currentXP + (missionData.xp || 0);
    const newLevel = Math.floor(newXP / 100) + 1;

    await statsRef.set({ xp: newXP, level: newLevel }, { merge: true });

    return res.status(200).json({
      ok: true,
      msg: "✅ Misión completada correctamente",
      mission: {
        id: missionId,
        ...missionData,
        completada: true,
        completedAt: now,
      },
    });
  } catch (error) {
    console.error("❌ Error al completar misión:", error);
    return res.status(500).json({ error: "Error interno al completar misión" });
  }
};

const getCompletedMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("missionsCompleted")
      .get();

    const misiones = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      ok: true,
      total: misiones.length,
      misiones,
    });
  } catch (err) {
    console.error("❌ Error al obtener misiones completadas:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

const createMission = async (req, res) => {
  const uid = req.uid;
  const { titulo, descripcion, dificultad, categoria, xp } = req.body;

  if (!titulo || !descripcion || !dificultad || !categoria || !xp) {
    return res.status(400).json({ error: 'Faltan campos en la misión' });
  }

  const nuevaMision = {
    titulo,
    descripcion,
    dificultad,
    categoria,
    xp,
    completada: false,
    generatedAt: new Date().toISOString(),
  };

  try {
    // Cada usuario tiene su propia subcolección "missions"
    const missionRef = await db
      .collection('users')
      .doc(uid)
      .collection('missions')
      .add(nuevaMision); // Se crea como documento individual

    return res.status(201).json({
      ok: true,
      msg: '✅ Misión creada correctamente',
      missionId: missionRef.id,
      mision: nuevaMision,
    });
  } catch (error) {
    console.error('❌ Error al crear misión:', error);
    return res.status(500).json({ error: 'Error interno al crear misión' });
  }
};

const regenerateMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    const objetivo = userData?.objetivo;

    if (!objetivo) {
      return res.status(400).json({ error: 'El usuario no tiene un objetivo definido' });
    }

    const missionsRef = db.collection('users').doc(uid).collection('missions');

    // Solo borramos las misiones pendientes, nunca las ya completadas
    const oldSnap = await missionsRef.where('completada', '==', false).get();
    const deleteBatch = db.batch();
    oldSnap.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();

    // Generamos un set fresco: 3 diarias, 1 semanal, 1 especial
    const configSnap = await db.collection('userConfig').doc(uid).get();
    const nivel = configSnap.exists ? configSnap.data().difficulty : 'media';

    const [diarias, semanales, especiales] = await Promise.all([
      obtenerMisionesPorObjetivo(objetivo, 'diaria', 3, nivel),
      obtenerMisionesPorObjetivo(objetivo, 'semanal', 1, nivel),
      obtenerMisionesPorObjetivo(objetivo, 'especial', 1, nivel),
    ]);

    const now = new Date().toISOString();
    const createBatch = db.batch();

    diarias.forEach(m => {
      createBatch.set(missionsRef.doc(), {
        ...m, categoria: 'diaria', completada: false, generatedAt: now, desbloqueada: true, unlockAt: now
      });
    });
    semanales.forEach(m => {
      createBatch.set(missionsRef.doc(), {
        ...m, categoria: 'semanal', completada: false, generatedAt: now, desbloqueada: true, unlockAt: now
      });
    });
    especiales.forEach(m => {
      createBatch.set(missionsRef.doc(), {
        ...m, categoria: 'especial', completada: false, generatedAt: now, desbloqueada: true, unlockAt: now
      });
    });

    await createBatch.commit();

    return res.status(200).json({ ok: true, msg: 'Misiones regeneradas correctamente' });
  } catch (err) {
    console.error('Error en regenerateMissions:', err);
    return res.status(500).json({ error: 'Error al regenerar misiones' });
  }
}


module.exports = {
  getUserMissions,
  completeMission,
  getCompletedMissions,
  createMission,
  regenerateMissions,
};
