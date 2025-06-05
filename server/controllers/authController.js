const { admin, db } = require('../services/firebase');
const fetch = require('node-fetch');
const { verificarGenerarMisiones } = require("../utils/verificarGenerarMisiones"); // ✅ USO CORRECTO

const registerUser = async (req, res) => {
  const { name, lastName, email, password, objetivo } = req.body;

  if (!email || !password || !name || !lastName || !objetivo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  console.log('📥 Body recibido en registro:', req.body);

  try {
    // 1️⃣ Crear usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`,
    });

    const uid = userRecord.uid;

    // 2️⃣ Guardar datos del usuario
    await db.collection('users').doc(uid).set({
      name,
      lastName,
      email,
      objetivo,
      createdAt: new Date().toISOString(),
    });

    // 3️⃣ Crear estadísticas iniciales
    await db.collection('userStats').doc(uid).set({
      xp: 0,
      level: 1,
    });

    // 4️⃣ Guardar configuración inicial
    await db.collection('userConfig').doc(uid).set({
      nickname: name,
      goal: objetivo,
      difficulty: 'media',
    });

    // ✅ 5️⃣ Generar misiones iniciales con control de desbloqueo
    await verificarGenerarMisiones(uid, objetivo);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      uid,
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(401).json({ error: data.error.message });
    }

    req.session.userId = data.localId;

    res.json({
      message: 'Login correcto',
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      uid: data.localId,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
};

module.exports = { registerUser, login };