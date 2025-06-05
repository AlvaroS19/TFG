const { db } = require('../services/firebase');
const rewardsCatalog = require('../utils/rewardsCatalog');

const getUserStats = async (req, res) => {
  const uid = req.uid;

  try {
    // 1. Leer estadísticas del usuario
    const statsRef = db.collection('userStats').doc(uid);
    const statsDoc = await statsRef.get();
    const stats = statsDoc.exists ? statsDoc.data() : {};

    // 2. Leer configuración del usuario
    const configRef = db.collection('userConfig').doc(uid);
    const configDoc = await configRef.get();
    const config = configDoc.exists ? configDoc.data() : {};

    // 3. Contar misiones completadas
    const completedSnap = await db
      .collection('users')
      .doc(uid)
      .collection('missionsCompleted')
      .get();

    let totalMissionsCompleted = 0;
    let dailyCompleted = 0;
    let weeklyCompleted = 0;
    let specialCompleted = 0;

    let dificultadTotal = 0;
    let dificultadCount = 0;

    completedSnap.forEach(doc => {
      const m = doc.data();
      totalMissionsCompleted++;
      if (m.categoria === 'diaria') dailyCompleted++;
      if (m.categoria === 'semanal') weeklyCompleted++;
      if (m.categoria === 'especial') specialCompleted++;

      if (m.dificultad) {
        if (m.dificultad === 'fácil') dificultadTotal += 1;
        else if (m.dificultad === 'media') dificultadTotal += 2;
        else if (m.dificultad === 'difícil') dificultadTotal += 3;
        dificultadCount++;
      }
    });

    let dificultadPromedio = '';
    if (dificultadCount > 0) {
      const promedio = dificultadTotal / dificultadCount;
      if (promedio >= 2.5) dificultadPromedio = 'difícil';
      else if (promedio >= 1.5) dificultadPromedio = 'media';
      else dificultadPromedio = 'fácil';
    }

    // 4. Contar recompensas desbloqueadas
    const rewardsSnap = await db
      .collection('users')
      .doc(uid)
      .collection('userRewards')
      .get();

    const totalRewardsUnlocked = rewardsSnap.size;

    // 5. Respuesta
    res.status(200).json({
      uid,
      xp: stats.xp || 0,
      level: stats.level || 1,
      progress: stats.progress || 0,
      nickname: config.nickname || '',
      goal: config.goal || '',
      difficulty: dificultadPromedio,
      totalMissionsCompleted,
      dailyCompleted,
      weeklyCompleted,
      specialCompleted,
      totalRewardsUnlocked
    });
  } catch (err) {
    console.error('❌ Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

const getUserRewards = async (req, res) => {
  const uid = req.uid;
  const now = new Date().toISOString();

  try {
    // 📊 Stats del usuario
    const statsSnap = await db.collection('userStats').doc(uid).get();
    const stats = statsSnap.exists ? statsSnap.data() : { xp: 0, level: 1 };
    const { xp = 0, level = 1 } = stats;

    // 🧠 Misiones completadas
    const completedSnap = await db
      .collection('users')
      .doc(uid)
      .collection('missionsCompleted')
      .get();

    const completed = completedSnap.docs.map(doc => doc.data());
    const totalCompleted = completed.length;

    const completadasDiarias = completed.filter(m => m.categoria === 'diaria');
    const completadasSemanales = completed.filter(m => m.categoria === 'semanal');
    const completadasDificiles = completed.filter(m => 
      m.dificultad === 'difícil' || m.dificultad === 'dificil'
    );

    const fechasCompletadas = completed.map(m => new Date(m.completedAt));
    const diasUnicos = new Set(fechasCompletadas.map(f => f.toISOString().split('T')[0]));

    // ✅ Cargar recompensas ya guardadas
    const existingRewardsSnap = await db
      .collection('users')
      .doc(uid)
      .collection('userRewards')
      .get();

    const existingIds = existingRewardsSnap.docs.map(doc => doc.data().id);

    // 🧩 Nuevas recompensas a validar
    const posibles = [];

    if (diasUnicos.size >= 7) posibles.push('semanaPerfecta');
    if (level >= 5) posibles.push('nivel5Maestro');
    if (diasUnicos.size >= 30) posibles.push('constante30dias');
    if (level >= 10) posibles.push('proGamer');

    const nuevas = posibles.filter(id => !existingIds.includes(id));

    // 📝 Guardar nuevas recompensas
    const userRewardsRef = db.collection('users').doc(uid).collection('userRewards');
    for (const id of nuevas) {
      const recompensa = rewardsCatalog[id];
      if (!recompensa) continue;

      await userRewardsRef.add({
        id,
        nombre: recompensa.nombre,
        descripcion: recompensa.descripcion,
        fecha: now
      });
    }

    // 🧾 Juntar todas las recompensas
    const finalSnap = await userRewardsRef.get();
    const finalRewards = finalSnap.docs.map(doc => doc.data());

    return res.status(200).json(finalRewards);
  } catch (error) {
    console.error('❌ Error al obtener recompensas:', error);
    res.status(500).json({ error: 'Error al obtener recompensas del usuario' });
  }
};

const getUserConfig = async (req, res) => {
  const uid = req.uid;

  try {
    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "No se encontró la configuración del usuario" });
    }

    const { objetivo } = doc.data();

    if (!objetivo) {
      return res.status(400).json({ error: "No se pudo obtener el objetivo" });
    }

    res.status(200).json({ objetivo });
  } catch (err) {
    console.error("❌ Error en getUserConfig:", err);
    res.status(500).json({ error: "Error interno al obtener objetivo" });
  }
};

const getUserObjective = async (req, res) => {
  const uid = req.uid;

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { objetivo } = userSnap.data();
    if (!objetivo) {
      return res.status(404).json({ error: 'El usuario no tiene objetivo definido' });
    }

    res.status(200).json({ objetivo });
  } catch (err) {
    console.error('❌ Error al obtener objetivo del usuario:', err);
    res.status(500).json({ error: 'Error al obtener el objetivo' });
  }
};

const updateUserConfig = async (req, res) => {
  const uid = req.uid;
  const { nickname, objetivo } = req.body;

  if (!nickname && !objetivo) {
    return res.status(400).json({ error: 'Faltan campos a actualizar' });
  }

  try {
    const userConfigRef = db.collection('userConfig').doc(uid);

    await userConfigRef.set(
      {
        ...(nickname && { nickname }),
        ...(objetivo && { goal: objetivo }),
      },
      { merge: true }
    );

    res.status(200).json({ ok: true, msg: 'Configuración actualizada' });
  } catch (error) {
    console.error('❌ Error al actualizar userConfig:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};
const saveUserConfig = async (req, res) => {
  const uid = req.uid;
  const { nickname, objetivo } = req.body;

  if (!nickname || !objetivo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const userRef = db.collection('users').doc(uid);

    // Guarda nickname y objetivo en el documento de usuario
    await userRef.set({ name: nickname, objetivo }, { merge: true });

    // Además, si usas userConfig en otro lado, también lo puedes mantener ahí
    const configRef = db.collection('userConfig').doc(uid);
    await configRef.set({ objetivo }, { merge: true });

    res.json({ ok: true, message: 'Configuración actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar configuración:', error);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
};

const getXpHistory = async (req, res) => {
  const uid = req.uid;
  try {
    const snapshot = await db
      .collection('users')
      .doc(uid)
      .collection('missionsCompleted')
      .get();

    const xpByDate = {};

    snapshot.forEach(doc => {
      const { completedAt, xp } = doc.data();
      if (!completedAt) return;

      const fecha = new Date(completedAt).toISOString().slice(0, 10); // yyyy-mm-dd
      xpByDate[fecha] = (xpByDate[fecha] || 0) + (xp || 0);
    });

    return res.json({ xpByDate });
  } catch (error) {
    console.error('❌ Error al obtener historial XP:', error);
    return res.status(500).json({ error: 'Error al obtener historial de XP' });
  }
};
const getXpSummary = async (req, res) => {
  const uid = req.uid;

  try {
    const snapshot = await db
      .collection('users')
      .doc(uid)
      .collection('missionsCompleted')
      .get();

    let xpHoy = 0;
    let xpSemana = 0;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const hace7dias = new Date();
    hace7dias.setDate(hace7dias.getDate() - 6); // incluye hoy
    hace7dias.setHours(0, 0, 0, 0);

    snapshot.forEach(doc => {
      const { completedAt, xp } = doc.data();
      if (!completedAt || !xp) return;

      const fecha = new Date(completedAt);
      const fechaCorta = new Date(fecha);
      fechaCorta.setHours(0, 0, 0, 0);

      if (fechaCorta.getTime() === hoy.getTime()) {
        xpHoy += xp;
      }

      if (fechaCorta >= hace7dias && fechaCorta <= hoy) {
        xpSemana += xp;
      }
    });

    return res.json({ xpHoy, xpSemana });
  } catch (error) {
    console.error('❌ Error al obtener resumen XP:', error);
    return res.status(500).json({ error: 'Error al obtener resumen de XP' });
  }
};

module.exports = {
  getUserStats,
  getUserRewards,
  getUserConfig,
  getUserObjective,
  updateUserConfig,
  saveUserConfig,
  getXpHistory,
  getXpSummary,
};