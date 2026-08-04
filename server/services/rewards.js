const { db } = require('../services/firebase');
const rewardsCatalog = require('../utils/rewardsCatalog');

const desbloquearRecompensaSiAplica = async (uid, claveDelLogro) => {
  const recompensa = rewardsCatalog[claveDelLogro];
  if (!recompensa) return; // No hay recompensa para este logro

  const rewardsRef = db.collection('users').doc(uid).collection('userRewards');
  const yaExiste = await rewardsRef.where('logro', '==', claveDelLogro).get();
  if (!yaExiste.empty) return; // Ya tiene esta recompensa

  await rewardsRef.add({
    ...recompensa,
    logro: claveDelLogro,
    fecha: new Date().toISOString()
  });

  console.log(`🎁 Recompensa desbloqueada: ${recompensa.nombre} para logro ${claveDelLogro}`);
};

module.exports = { desbloquearRecompensaSiAplica };