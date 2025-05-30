const { admin, db } = require("../services/firebase");
const { getRoleByLevel } = require("../utils/roles");
const {verificarGenerarMisiones} = require("../utils/verificarGenerarMisiones.js");

const getUserMissions = async (req, res) => {
  const uid = req.uid;

  try {
    // Obtener objetivo del usuario
    const userDoc = await db.collection("users").doc(uid).get();
    const objetivo = userDoc.data()?.objetivo || "general";

    // Verificar regeneración
    await verificarGenerarMisiones(uid, objetivo);

    // Obtener misiones
    const docRef = db.collection("missions").doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "No hay misiones asignadas" });
    }

    const data = docSnap.data(); // 🔧 aquí estaba el error
    const allMissions = [...(data.daily || []), ...(data.weekly || [])];
    res.json(allMissions);

  } catch (error) {
    console.error("Error al obtener misiones:", error);
    res.status(500).json({ error: "Error al obtener misiones" });
  }
};

const completeMission = async (req, res) => {
  const uid = req.uid;
  const { description, type, dificultad } = req.body;

  if (!description || !type || !dificultad) {
    return res.status(400).json({ error: "Faltan campos: description, type o dificultad" });
  }

  function getXPForMission(type, difficulty) {
    const table = {
      daily: { easy: 10, medium: 15, hard: 20 },
      weekly: { normal: 30, hard: 40 },
      special: { unique: 50 },
      challenge: { insane: 70 },
    };
    return table[type]?.[difficulty] || 0;
  }

  const xpGained = getXPForMission(type, dificultad);
  const newMission = {
    description,
    type,
    completedAt: new Date().toISOString(),
  };

  try {
    const missionsRef = db.collection("missions").doc(uid);
    const docSnap = await missionsRef.get();
    const data = docSnap.data();

    const updatedList = (data[type] || []).map((m) => {
      if (m.descripcion === description && m.dificultad === dificultad) {
        return { ...m, completada: true };
      }
      return m;
    });

    await missionsRef.update({
      [type]: updatedList,
    });

    const completedRef = db.collection("missionsCompleted").doc(uid);
    const completedSnap = await completedRef.get();

    if (!completedSnap.exists) {
      await completedRef.set({ completed: [newMission] });
    } else {
      await completedRef.update({
        completed: admin.firestore.FieldValue.arrayUnion(newMission),
      });
    }
  
    const statsRef = db.collection("userStats").doc(uid);
    const statsSnap = await statsRef.get();

    let newLevel = 1;
    let updatedXP = xpGained;

    if (statsSnap.exists) {
      const current = statsSnap.data();
      updatedXP += current.xp || 0;
      newLevel = Math.floor(updatedXP / 100) + 1;
    }

    const newRole = getRoleByLevel(newLevel);

    await statsRef.set(
      { xp: updatedXP, level: newLevel, role: newRole },
      { merge: true }
    );

    res.status(200).json({
      msg: `✅ Misión completada y ${xpGained} XP añadidos`,
      mission: newMission,
      xpEarned: xpGained,
      newLevel,
      newRole,
    });
  } catch (error) {
    console.error("Error al completar misión:", error);
    res.status(500).json({ error: "Error al completar misión" });
  }
};

const getCompletedMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const docRef = db.collection("missionsCompleted").doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(200).json({ completed: [] });
    }

    const data = docSnap.data();
    res.status(200).json({ completed: data.completed || [] });
  } catch (error) {
    console.error("Error al obtener misiones completadas:", error);
    res.status(500).json({ error: "Error al obtener misiones completadas" });
  }
};
const createMission = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const userId = decoded.uid;

    const { titulo, descripcion, xp, categoria, dificultad } = req.body;

    if (!titulo || !descripcion || !xp || !categoria || !dificultad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevaMision = {
      userId,
      titulo,
      descripcion,
      xp,
      categoria,
      dificultad,
      createdAt: new Date().toISOString(),
    };

    const doc = await db.collection("missions").add(nuevaMision);

    res
      .status(201)
      .json({ message: "Misión creada correctamente", id: doc.id });
  } catch (error) {
    console.error("Error al crear misión:", error);
    res.status(500).json({ error: "Error al crear misión" });
  }
};

module.exports = {
  getUserMissions,
  completeMission,
  getCompletedMissions,
  createMission,
};
