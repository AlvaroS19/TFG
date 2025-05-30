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

  try {
    const missionsRef = db.collection("missions").doc(uid);
    const docSnap = await missionsRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "No hay misiones activas" });
    }

    const data = docSnap.data();
    const lista = data[type] || [];

    const actualizada = lista.map(m => {
      if (m.descripcion === description && m.dificultad === dificultad) {
        return { ...m, completada: true, completedAt: new Date().toISOString() };
      }
      return m;
    });

    await missionsRef.update({ [type]: actualizada });

    const nueva = {
      descripcion: description,
      dificultad,
      tipo: type,
      completedAt: new Date().toISOString(),
    };

    const completedRef = db.collection("missionsCompleted").doc(uid);
    const completedSnap = await completedRef.get();

    if (!completedSnap.exists) {
      await completedRef.set({ completed: [nueva] });
    } else {
      await completedRef.update({
        completed: admin.firestore.FieldValue.arrayUnion(nueva)
      });
    }

    res.status(200).json({ ok: true, msg: "Misión completada" });

  } catch (error) {
    console.error("❌ Error al completar misión:", error);
    res.status(500).json({ error: "Error interno al completar misión" });
  }
};

const getCompletedMissions = async (req, res) => {
  const uid = req.uid;

  try {
    const doc = await db.collection('missionsCompleted').doc(uid).get();
    if (!doc.exists) return res.json([]);

    const data = doc.data();
    res.json(data.completed || []);
  } catch (err) {
    console.error("❌ Error al obtener misiones completadas:", err);
    res.status(500).json({ error: "Error interno" });
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
