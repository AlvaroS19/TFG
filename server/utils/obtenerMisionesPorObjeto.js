const { db } = require('../services/firebase');

async function obtenerMisionesPorObjetivo(objetivo, categoria, limit, dificultad) {
  let query = db.collection('missionsCatalog')
    .where('objetivo', '==', objetivo)
    .where('categoria', '==', categoria);

  if (dificultad) {
    query = query.where('dificultad', '==', dificultad);
  }

  const snapshot = await query.get();
  let misiones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  for (let i = misiones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [misiones[i], misiones[j]] = [misiones[j], misiones[i]];
  }

  if (limit) {
    misiones = misiones.slice(0, limit);
  }

  return misiones;
}

module.exports = obtenerMisionesPorObjetivo;