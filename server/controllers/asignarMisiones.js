import { db } from '../services/firebase';
import { generarTodasLasMisiones } from '../utils/generarTodasLasMisiones.js';

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
    await generarTodasLasMisiones(uid, objetivo);
  }
  
  catch (err) {
    console.error('❌ Error al asignar misiones iniciales:', err);
  }
};

export default { asignarMisionesIniciales };
