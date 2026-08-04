const { db } = require('../services/firebase');
const fs = require('fs');

const path = require('path');
const misionesCatalogo = JSON.parse(fs.readFileSync(path.join(__dirname, '../misiones_catalogo.json'), 'utf-8'));

async function subirMisiones() {
  try {
    const batch = db.batch();

    for (const objetivo in misionesCatalogo) {
      const ref = db.collection('missionsCatalog').doc(objetivo);
      batch.set(ref, misionesCatalogo[objetivo]);
    }

    await batch.commit();
    console.log('✅ Misiones subidas correctamente a Firebase');
  } catch (err) {
    console.error('❌ Error al subir misiones:', err);
  }
}

subirMisiones();
