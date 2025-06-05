import { db } from '../services/firebase';

const asignarMisionesIniciales = async (uid, objetivo) => {
  try {
    const docSnap = await db.collection('missionsCatalog').doc(objetivo).get();
    if (!docSnap.exists) return;

    const misionesPorObjetivo = docSnap.data();

    const data = {
      daily: misionesPorObjetivo.daily || [],
      weekly: misionesPorObjetivo.weekly || [],
      generatedAt: new Date().toISOString(),
    };

    await db.collection('missions').doc(uid).set(data);

  } catch (err) {
    console.error('❌ Error al asignar misiones iniciales:', err);
  }
};

export default { asignarMisionesIniciales };