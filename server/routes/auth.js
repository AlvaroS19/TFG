const express = require('express');
const router = express.Router();
const { auth, db } = require('../services/firebase');
const bcrypt = require('bcrypt');
require('dotenv').config();


router.post('/register', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({ email, password });

    // Crear documento en Firestore con datos adicionales
    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      level: 1,
      xp: 0,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Usuario registrado', uid: userRecord.uid });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(401).json({ error: data.error.message });
    }

    res.json({
      message: 'Login correcto',
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      uid: data.localId
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


module.exports = router;