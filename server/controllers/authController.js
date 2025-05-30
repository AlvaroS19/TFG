const { admin, db } = require('../services/firebase');
const fetch = require('node-fetch');
const { asignarMisionesIniciales } = require('../utils/asignarMisiones')

// ✅ Registro de usuario + guardar perfil + asignar misiones
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

    await db.collection('users').doc(userRecord.uid).set({
      name,
      lastName,
      email,
      objetivo,
      createdAt: new Date().toISOString(),
    });

    // ✅ Llamada correcta después de tener el uid
    await asignarMisionesIniciales(userRecord.uid, objetivo);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login con Firebase REST y guardar sesión
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