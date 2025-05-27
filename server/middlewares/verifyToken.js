const { admin } = require("../services/firebase");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.idToken;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;