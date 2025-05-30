const { db } = require("../services/firebase");

const asignarMisionesIniciales = async (uid, objetivo) => {
  console.log('🚀 Asignando misiones iniciales para:', uid, objetivo);

  const misionesPorObjetivo = await obtenerMisionesPorObjetivo(objetivo);

  const misionesFormateadas = misionesPorObjetivo.map(m => ({
    ...m,
    completada: false,
    generatedAt: new Date().toISOString()
  }));

  const daily = misionesFormateadas.filter(m => m.categoria === 'diaria');
  const weekly = misionesFormateadas.filter(m => m.categoria === 'semanal');

  await db.collection('missions').doc(uid).set({
    daily,
    weekly,
    generatedAt: new Date().toISOString()
  });

  console.log('✅ Misiones guardadas en Firebase');
};

module.exports = { asignarMisionesIniciales };
