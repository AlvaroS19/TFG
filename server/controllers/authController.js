const { admin, db } = require('../services/firebase');

const registerUser = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  if (!email || !password || !name || !lastName) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`,
    });

    // Guardar en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    });

    // Devolver UID
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };
