const { admin, db } = require('../services/firebase');
const fetch = require('node-fetch');
const { verificarGenerarMisiones } = require("../utils/verificarGenerarMisiones");

const registerUser = async (req, res) => {
  const { name, lastName, email, password, objetivo } = req.body;

  if (!email || !password || !name || !lastName || !objetivo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`,
    });

    const uid = userRecord.uid;

    await db.collection('users').doc(uid).set({
      name,
      lastName,
      email,
      objetivo,
      createdAt: new Date().toISOString(),
    });

    await db.collection('userStats').doc(uid).set({
      xp: 0,
      level: 1,
    });

    await db.collection('userConfig').doc(uid).set({
      nickname: name,
      goal: objetivo,
      difficulty: 'media',
    });

    await verificarGenerarMisiones(uid, objetivo);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      uid,
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);

    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Ese correo ya está registrado' });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ error: 'La contraseña no cumple los requisitos mínimos' });
    }

    res.status(500).json({ error: 'No se pudo completar el registro. Inténtalo de nuevo.' });
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
      console.warn('⚠️ Login fallido:', data.error.message);
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Aseguramos que las misiones diarias estén al día en cada login
    const userDoc = await db.collection('users').doc(data.localId).get();
    if (userDoc.exists) {
      const { objetivo } = userDoc.data();
      if (objetivo) {
        await verificarGenerarMisiones(data.localId, objetivo);
      }
    }

    res.json({
      message: 'Login correcto',
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      uid: data.localId,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'No se pudo iniciar sesión. Inténtalo de nuevo.' });
  }
};

module.exports = { registerUser, login };