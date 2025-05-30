const { db } = require("../services/firebase")

const obtenerMisionesPorObjetivo = async (objetivo) => {
  const catalogRef = db.collection("missionsCatalog").doc(objetivo);
  const catalogSnap = await catalogRef.get();

  if (!catalogSnap.exists) {
    console.error(`❌ No se encontró el catálogo para el objetivo: ${objetivo}`);
    return [];
  }

  const catalogo = catalogSnap.data();

  // Puedes personalizar aquí qué tipo de misiones devolver
  const daily = catalogo.daily || [];
  const weekly = catalogo.weekly || [];

  // Las unimos en un solo array
  return [...daily, ...weekly];
};

	module.exports = obtenerMisionesPorObjetivo ;