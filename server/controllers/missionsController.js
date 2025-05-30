const { admin, db } = require("../services/firebase");
const {verificarGenerarMisiones} = require("../utils/verificarGenerarMisiones.js");

const getUserMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const missionsSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('missions')
      .get();

    const misiones = [];

    missionsSnapshot.forEach(doc => {
      misiones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

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
      return res.status(200).json({
        ok: false,
        msg: "La misión ya estaba completada",
      });
    }

    const completedAt = new Date().toISOString();

    // 1. Actualizar misión original
    await missionRef.update({
      completada: true,
      completedAt,
    });

    // 2. Guardar en missionsCompleted
    const completedRef = db
      .collection("users")
      .doc(uid)
      .collection("missionsCompleted")
      .doc(missionId);

    await completedRef.set({
      ...missionData,
      completada: true,
      completedAt,
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
        completedAt,
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

module.exports = {
  getUserMissions,
  completeMission,
  getCompletedMissions,
  createMission,
};
