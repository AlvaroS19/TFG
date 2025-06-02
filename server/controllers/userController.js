const { db, admin } = require("../services/firebase")

const getUserStats = async (req, res) => {
  const uid = req.uid;

  try {
    const statsRef = db.collection('userStats').doc(uid);
    const statsSnap = await statsRef.get();

    const configRef = db.collection('userConfig').doc(uid);
    const configSnap = await configRef.get();

    if (!statsSnap.exists) {
    await statsRef.set({ xp: 0, level: 1 });
  }

    let xp = 0;
    let level = 1;

    if (statsSnap.exists) {
      const statsData = statsSnap.data();
      xp = statsData?.xp || 0;
      level = statsData?.level || 1;
    } else {
      // Crear stats si no existen
      await statsRef.set({ xp: 0, level: 1 });
    }
    const { nickname = '', goal = '', difficulty = '' } = configSnap.exists ? configSnap.data() : {};

    const progress = xp % 100;

    res.status(200).json({
      uid,
      xp,
      level,
      progress,
      nickname,
      goal,
      difficulty,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

const updateUserStats = async (req, res) => {
  const uid = req.uid;
  const data = req.body;

  try {
    await db.collection('userStats').doc(uid).set(data, { merge: true });
    res.status(200).json({ message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar datos:', error);
    res.status(500).json({ error: 'Error al actualizar datos' });
  }
};

const getUserProgress = async (req, res) => {
  const uid = req.uid;

  try {
    const docRef = db.collection('missionsCompleted').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(200).json({
        totalCompleted: 0,
        lastCompleted: null
      });
    }

    const data = docSnap.data();
    const completedMissions = data.completed || [];

    const totalCompleted = completedMissions.length;
    const lastCompleted = completedMissions
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]?.completedAt || null;

    res.status(200).json({
      totalCompleted,
      lastCompleted
    });

  } catch (error) {
    console.error('Error al obtener progreso del usuario:', error);
    res.status(500).json({ error: 'Error al obtener progreso del usuario' });
  }
};

const getUserRewards = async (req, res) => {
  const uid = req.uid;
  const rewards = [];

  try {
    // Obtener stats del usuario
    const statsSnap = await db.collection('userStats').doc(uid).get();
    const stats = statsSnap.exists ? statsSnap.data() : { xp: 0, level: 1 };
    const { xp = 0, level = 1 } = stats;

    // Obtener misiones completadas
    const completedSnap = await db
      .collection('users')
      .doc(uid)
      .collection('missionsCompleted')
      .get();

    const completed = completedSnap.docs.map(doc => doc.data());
    const totalCompleted = completed.length;

    // 🚀 Clasificación y fechas
    const completadasDiarias = completed.filter(m => m.categoria === 'diaria');
    const completadasSemanales = completed.filter(m => m.categoria === 'semanal');
    const completadasDificiles = completed.filter(m => m.dificultad === 'difícil' || m.dificultad === 'dificil');

    const fechasCompletadas = completed.map(m => new Date(m.completedAt));
    const diasUnicos = new Set(fechasCompletadas.map(f => f.toISOString().split('T')[0]));

    // 🧠 Lógica de logros
    if (totalCompleted >= 1) rewards.push('Primeros pasos');
    if (xp >= 100) rewards.push('nivel');
    if (totalCompleted >= 5) rewards.push('Constancia');
    if (level >= 3) rewards.push('Pro');

    if (completadasDiarias.length >= 10) rewards.push('diarias10');
    if (completadasSemanales.length >= 5) rewards.push('semanales5');
    if (totalCompleted >= 20) rewards.push('misiones20');
    if (level >= 5) rewards.push('nivel5');
    if (diasUnicos.size >= 30) rewards.push('veterano');
    if (completadasDificiles.length >= 1) rewards.push('dificil1');

    // Logro: 3 misiones en un solo día
    const contadorPorDia = {};
    for (const fecha of fechasCompletadas) {
      const dia = fecha.toISOString().split('T')[0];
      contadorPorDia[dia] = (contadorPorDia[dia] || 0) + 1;
    }
    if (Object.values(contadorPorDia).some(count => count >= 3)) {
      rewards.push('3diarias1dia');
    }

    // Logro: Racha de 7 días seguidos
    const fechasOrdenadas = [...diasUnicos].sort();
    let rachaMax = 1;
    let actual = 1;

    for (let i = 1; i < fechasOrdenadas.length; i++) {
      const anterior = new Date(fechasOrdenadas[i - 1]);
      const actualDia = new Date(fechasOrdenadas[i]);

      const diff = (actualDia - anterior) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        actual++;
        rachaMax = Math.max(rachaMax, actual);
      } else {
        actual = 1;
      }
    }
    if (rachaMax >= 7) {
      rewards.push('racha7');
    }

    return res.status(200).json({
      uid,
      xp,
      level,
      totalCompleted,
      rewards
    });
  } catch (error) {
    console.error('❌ Error al obtener recompensas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener recompensas' });
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

module.exports = {
  getUserStats,
  getUserProgress,
  getUserRewards,
  getUserConfig,
  getUserObjective,
  updateUserConfig,
  saveUserConfig,
};