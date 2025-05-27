const { admin, db } = require('../services/firebase');
const fetch = require('node-fetch');

const registerUser = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  if (!email || !password || !name || !lastName) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`,
    });

    await db.collection('users').doc(userRecord.uid).set({
      name,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
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