const { db } = require("../services/firebase");

const obtenerMisionesPorObjetivo = async (objetivo, tipo = null, limit = null) => {
  const catalogRef = db.collection("missionsCatalog").doc(objetivo);
  const catalogSnap = await catalogRef.get();

  if (!catalogSnap.exists) {
    console.error(`❌ No se encontró el catálogo para el objetivo: ${objetivo}`);
    return [];
  }

  const catalogo = catalogSnap.data();

  let misiones = [];

  if (tipo && catalogo[tipo]) {
    misiones = catalogo[tipo];
  } else {
    // Por defecto: juntar daily y weekly
    const daily = catalogo.daily || [];
    const weekly = catalogo.weekly || [];
    misiones = [...daily, ...weekly];
  }

  // Si se define un límite, devolvemos misiones aleatorias hasta ese límite
  if (limit && typeof limit === '3') {
    // Barajamos aleatoriamente
    misiones = misiones.sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  return misiones;
};

module.exports = obtenerMisionesPorObjetivo;