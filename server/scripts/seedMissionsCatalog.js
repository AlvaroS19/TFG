const { db } = require('../services/firebase');

const catalogo = {
  fuerza: {
    diaria: {
      fácil: [
        { titulo: 'Sentadillas básicas', descripcion: 'Haz 10 sentadillas sin peso, con buena técnica.', xp: 10 },
        { titulo: 'Flexiones de rodillas', descripcion: 'Haz 8 flexiones apoyando las rodillas.', xp: 10 },
        { titulo: 'Plancha 20 segundos', descripcion: 'Mantén la posición de plancha durante 20 segundos.', xp: 8 },
        { titulo: 'Zancadas suaves', descripcion: 'Haz 10 zancadas alternando pierna, sin peso.', xp: 10 },
        { titulo: 'Elevaciones de talón', descripcion: 'Haz 15 elevaciones de talón para trabajar gemelo.', xp: 8 },
        { titulo: 'Superman en el suelo', descripcion: 'Haz 12 repeticiones de "superman" para espalda baja.', xp: 9 },
      ],
      media: [
        { titulo: 'Sentadillas con salto', descripcion: 'Haz 15 sentadillas con salto explosivo.', xp: 18 },
        { titulo: 'Flexiones completas', descripcion: 'Haz 15 flexiones completas con buena forma.', xp: 18 },
        { titulo: 'Zancadas alternas', descripcion: 'Haz 20 zancadas alternando pierna.', xp: 16 },
        { titulo: 'Plancha 45 segundos', descripcion: 'Mantén la plancha durante 45 segundos.', xp: 16 },
        { titulo: 'Fondos de tríceps', descripcion: 'Haz 15 fondos en una silla o banco.', xp: 17 },
        { titulo: 'Puente de glúteo', descripcion: 'Haz 3 series de 15 elevaciones de cadera.', xp: 15 },
      ],
      difícil: [
        { titulo: 'Sentadillas con peso', descripcion: 'Haz 25 sentadillas con mochila cargada o mancuernas.', xp: 28 },
        { titulo: 'Flexiones lastradas', descripcion: 'Haz 20 flexiones con peso extra en la espalda.', xp: 28 },
        { titulo: 'Pistol squats asistidos', descripcion: 'Haz 8 sentadillas a una pierna con apoyo.', xp: 30 },
        { titulo: 'Dominadas o remo con banda', descripcion: 'Haz 10 dominadas, o remo con banda elástica si no puedes aún.', xp: 30 },
        { titulo: 'Plancha con peso', descripcion: 'Mantén plancha 60 segundos con peso en la espalda.', xp: 27 },
        { titulo: 'Sentadilla búlgara', descripcion: 'Haz 12 sentadillas búlgaras por pierna.', xp: 29 },
      ],
    },
    semanal: {
      fácil:   [{ titulo: 'Rutina de fuerza básica', descripcion: '3 series de 10 sentadillas y 8 flexiones, 2 días esta semana.', xp: 40 },
                { titulo: 'Fuerza de tren superior', descripcion: 'Trabaja brazos y pecho 2 días esta semana con ejercicios suaves.', xp: 38 },
                { titulo: 'Fuerza de piernas ligera', descripcion: 'Sentadillas y zancadas 2 días esta semana.', xp: 38 }],
      media:   [{ titulo: 'Circuito de fuerza', descripcion: '4 series de sentadillas, flexiones y zancadas, 3 días esta semana.', xp: 60 },
                { titulo: 'Fuerza full body', descripcion: 'Rutina completa de cuerpo entero, 3 días esta semana.', xp: 58 },
                { titulo: 'Push-Pull semanal', descripcion: 'Alterna ejercicios de empuje y tracción, 3 días esta semana.', xp: 60 }],
      difícil: [{ titulo: 'Fuerza con carga', descripcion: '5 series con peso añadido, 3-4 días esta semana.', xp: 85 },
                { titulo: 'Semana de hipertrofia', descripcion: 'Rutina de alto volumen, 4 días esta semana.', xp: 88 },
                { titulo: 'Fuerza máxima semanal', descripcion: 'Series pesadas de pocas repeticiones, 4 días esta semana.', xp: 90 }],
    },
    especial: {
      fácil:   [{ titulo: 'Reto 50 sentadillas', descripcion: 'Acumula 50 sentadillas a lo largo del día.', xp: 30 },
                { titulo: 'Reto plancha total', descripcion: 'Acumula 3 minutos de plancha repartidos en el día.', xp: 28 },
                { titulo: 'Primer entrenamiento completo', descripcion: 'Completa tu primera rutina de fuerza de principio a fin.', xp: 32 }],
      media:   [{ titulo: 'Reto 100 flexiones', descripcion: 'Acumula 100 flexiones a lo largo de la semana.', xp: 60 },
                { titulo: 'Reto 200 sentadillas', descripcion: 'Acumula 200 sentadillas a lo largo de la semana.', xp: 62 },
                { titulo: 'Sube tu marca personal', descripcion: 'Supera tu récord de repeticiones en un ejercicio a elección.', xp: 58 }],
      difícil: [{ titulo: 'Entrena con mochila', descripcion: 'Haz una rutina completa de fuerza usando peso añadido.', xp: 80 },
                { titulo: 'Reto 500 repeticiones', descripcion: 'Acumula 500 repeticiones combinadas (sentadillas+flexiones) en la semana.', xp: 85 },
                { titulo: 'Semana de fuerza extrema', descripcion: 'Completa 5 sesiones intensas de fuerza en una semana.', xp: 90 }],
    },
  },

  resistencia: {
    diaria: {
      fácil: [
        { titulo: 'Caminata rápida', descripcion: 'Camina a paso rápido durante 15 minutos.', xp: 10 },
        { titulo: 'Escaleras 5 rondas', descripcion: 'Sube y baja escaleras 5 veces.', xp: 10 },
        { titulo: 'Bicicleta suave', descripcion: 'Pedalea a ritmo cómodo durante 15 minutos.', xp: 10 },
        { titulo: 'Marcha en el sitio', descripcion: 'Haz 10 minutos de marcha elevando rodillas.', xp: 8 },
        { titulo: 'Saltos suaves a la cuerda', descripcion: 'Salta la cuerda 2 minutos, con pausas si hace falta.', xp: 9 },
        { titulo: 'Paseo activo', descripcion: 'Camina 20 minutos incluyendo alguna cuesta o desnivel.', xp: 10 },
      ],
      media: [
        { titulo: 'Cuerda 5 minutos', descripcion: 'Salta la cuerda 5 minutos, puedes dividir en series.', xp: 18 },
        { titulo: 'Trote suave 15 min', descripcion: 'Trota a ritmo cómodo durante 15 minutos.', xp: 18 },
        { titulo: 'Bicicleta 30 min', descripcion: 'Pedalea a ritmo moderado durante 30 minutos.', xp: 17 },
        { titulo: 'Circuito cardio corto', descripcion: '4 rondas de jumping jacks, escaladores y burpees suaves.', xp: 18 },
        { titulo: 'Natación 20 min', descripcion: 'Nada a ritmo constante durante 20 minutos.', xp: 18 },
        { titulo: 'Intervalos caminar-trotar', descripcion: 'Alterna 2 min caminando y 1 min trotando, 20 minutos.', xp: 17 },
      ],
      difícil: [
        { titulo: 'Carrera 25 minutos', descripcion: 'Corre de forma continua durante 25 minutos.', xp: 28 },
        { titulo: 'Burpees en repetición', descripcion: 'Haz 4 series de 10 burpees con descanso corto.', xp: 30 },
        { titulo: 'HIIT 20 minutos', descripcion: 'Entrenamiento por intervalos de alta intensidad, 20 minutos.', xp: 29 },
        { titulo: 'Sprints cortos', descripcion: '8 series de sprint de 30 segundos con descanso.', xp: 30 },
        { titulo: 'Ciclismo intenso', descripcion: 'Pedalea a ritmo alto durante 40 minutos.', xp: 28 },
        { titulo: 'Escaleras a tope', descripcion: 'Sube y baja escaleras sin parar durante 15 minutos.', xp: 27 },
      ],
    },
    semanal: {
      fácil:   [{ titulo: 'Camina 5km esta semana', descripcion: 'Acumula 5km caminando a lo largo de la semana.', xp: 40 },
                { titulo: 'Cardio ligero 3 días', descripcion: '15 minutos de cardio suave, 3 días esta semana.', xp: 38 },
                { titulo: 'Muévete al aire libre', descripcion: 'Sal a caminar o pedalear al menos 3 veces esta semana.', xp: 38 }],
      media:   [{ titulo: 'Corre 10km esta semana', descripcion: 'Acumula 10km corriendo, repartidos como prefieras.', xp: 60 },
                { titulo: 'Cardio 4 días', descripcion: '25 minutos de cardio moderado, 4 días esta semana.', xp: 58 },
                { titulo: 'Bicicleta semanal', descripcion: 'Acumula 60km en bicicleta a lo largo de la semana.', xp: 60 }],
      difícil: [{ titulo: 'Reto cardio intenso', descripcion: '4 sesiones de HIIT de 20 minutos esta semana.', xp: 85 },
                { titulo: 'Corre 20km esta semana', descripcion: 'Acumula 20km corriendo a lo largo de la semana.', xp: 88 },
                { titulo: 'Semana de resistencia extrema', descripcion: '5 sesiones de cardio intenso esta semana.', xp: 90 }],
    },
    especial: {
      fácil:   [{ titulo: 'Primer 5K caminando', descripcion: 'Completa 5km caminando en una sola sesión.', xp: 30 },
                { titulo: 'Reto 30 min activos', descripcion: 'Acumula 30 minutos de movimiento en un solo día.', xp: 28 },
                { titulo: 'Explora una ruta nueva', descripcion: 'Camina o pedalea por una ruta que no hayas hecho antes.', xp: 30 }],
      media:   [{ titulo: 'Primer 5K corriendo', descripcion: 'Completa 5km corriendo, al ritmo que necesites.', xp: 60 },
                { titulo: 'Reto 60 minutos', descripcion: 'Acumula 60 minutos de cardio en un solo día.', xp: 58 },
                { titulo: 'Sube tu ritmo', descripcion: 'Completa una sesión de cardio mejorando tu ritmo habitual.', xp: 60 }],
      difícil: [{ titulo: 'Reto 10K', descripcion: 'Completa 10km corriendo en una sola sesión.', xp: 80 },
                { titulo: 'Media maratón por etapas', descripcion: 'Acumula 21km corriendo a lo largo de la semana.', xp: 88 },
                { titulo: 'Día de resistencia total', descripcion: 'Combina carrera, bici y escaleras en una sola sesión larga.', xp: 85 }],
    },
  },

  tonificación: {
    diaria: {
      fácil: [
        { titulo: 'Abdominales suaves', descripcion: 'Haz 12 abdominales con técnica controlada.', xp: 10 },
        { titulo: 'Elevaciones de cadera', descripcion: 'Haz 12 elevaciones de cadera (glúteo).', xp: 10 },
        { titulo: 'Plancha lateral suave', descripcion: 'Mantén 15 segundos de plancha lateral por lado.', xp: 9 },
        { titulo: 'Círculos de brazos', descripcion: 'Haz 3 series de 15 círculos de brazos con peso ligero.', xp: 8 },
        { titulo: 'Elevación de piernas', descripcion: 'Haz 12 elevaciones de pierna tumbado de lado.', xp: 9 },
        { titulo: 'Estocadas laterales', descripcion: 'Haz 10 estocadas laterales por pierna.', xp: 10 },
      ],
      media: [
        { titulo: 'Circuito de core', descripcion: '3 series de 15 abdominales y 20 segundos de plancha lateral.', xp: 18 },
        { titulo: 'Sentadilla isométrica', descripcion: 'Mantén sentadilla en pared durante 40 segundos, 3 veces.', xp: 16 },
        { titulo: 'Bicicleta abdominal', descripcion: 'Haz 3 series de 20 repeticiones de bicicleta abdominal.', xp: 17 },
        { titulo: 'Puente con marcha', descripcion: '3 series de puente de glúteo con marcha, 12 por lado.', xp: 16 },
        { titulo: 'Tonificación de brazos', descripcion: '3 series de 15 elevaciones laterales con mancuernas ligeras.', xp: 17 },
        { titulo: 'Plancha con rotación', descripcion: '3 series de 10 rotaciones en plancha.', xp: 17 },
      ],
      difícil: [
        { titulo: 'Circuito de tonificación completo', descripcion: '4 series combinando core, piernas y glúteo sin descanso.', xp: 28 },
        { titulo: 'Plancha con toques de hombro', descripcion: 'Haz 3 series de 20 toques alternos en plancha.', xp: 26 },
        { titulo: 'Sentadilla + press hombro', descripcion: '4 series de 15 combinando sentadilla y press con mancuernas.', xp: 28 },
        { titulo: 'Circuito de glúteo intenso', descripcion: '4 series de puente, patada de glúteo y sentadilla sumo.', xp: 27 },
        { titulo: 'Core avanzado', descripcion: '4 series combinando plancha, abdominales y elevaciones de pierna.', xp: 28 },
        { titulo: 'Tonificación full body', descripcion: 'Circuito completo de 5 ejercicios, 4 rondas sin descanso largo.', xp: 30 },
      ],
    },
    semanal: {
      fácil:   [{ titulo: 'Rutina de tonificación ligera', descripcion: '2 sesiones de core y glúteo esta semana.', xp: 40 },
                { titulo: 'Tonifica brazos', descripcion: '2 sesiones de brazos con peso ligero esta semana.', xp: 38 },
                { titulo: 'Core semanal suave', descripcion: '2 sesiones cortas de abdominales esta semana.', xp: 38 }],
      media:   [{ titulo: 'Tonificación por grupos', descripcion: '3 sesiones alternando core, piernas y brazos.', xp: 60 },
                { titulo: 'Rutina de glúteo semanal', descripcion: '3 sesiones enfocadas en glúteo y piernas.', xp: 58 },
                { titulo: 'Tonificación equilibrada', descripcion: '3 sesiones combinando todo el cuerpo.', xp: 60 }],
      difícil: [{ titulo: 'Tonificación intensiva', descripcion: '4 sesiones de circuitos completos esta semana.', xp: 85 },
                { titulo: 'Definición semanal', descripcion: '4 sesiones de alta intensidad enfocadas en definición.', xp: 88 },
                { titulo: 'Reto tonificación total', descripcion: '5 sesiones cortas pero intensas esta semana.', xp: 90 }],
    },
    especial: {
      fácil:   [{ titulo: 'Reto plancha semanal', descripcion: 'Aumenta tu tiempo de plancha cada día durante una semana.', xp: 30 },
                { titulo: 'Reto core diario', descripcion: 'Haz al menos un ejercicio de core cada día de la semana.', xp: 28 },
                { titulo: 'Primera rutina de tonificación', descripcion: 'Completa tu primera rutina de tonificación de principio a fin.', xp: 30 }],
      media:   [{ titulo: 'Reto 200 abdominales', descripcion: 'Acumula 200 abdominales a lo largo de la semana.', xp: 60 },
                { titulo: 'Reto plancha 5 minutos', descripcion: 'Acumula 5 minutos de plancha en la semana.', xp: 58 },
                { titulo: 'Supera tu marca de core', descripcion: 'Mejora tu mejor tiempo de plancha o abdominales.', xp: 60 }],
      difícil: [{ titulo: 'Transformación de 4 semanas', descripcion: 'Completa una rutina de tonificación estructurada durante un mes.', xp: 90 },
                { titulo: 'Reto 1000 repeticiones', descripcion: 'Acumula 1000 repeticiones combinadas de tonificación en la semana.', xp: 88 },
                { titulo: 'Semana de definición extrema', descripcion: '5 sesiones intensas de tonificación en una semana.', xp: 92 }],
    },
  },

  salud: {
    diaria: {
      fácil: [
        { titulo: 'Estiramientos matutinos', descripcion: 'Dedica 10 minutos a estirar al despertar.', xp: 8 },
        { titulo: 'Camina 15 minutos', descripcion: 'Da un paseo de al menos 15 minutos.', xp: 10 },
        { titulo: 'Respiración consciente', descripcion: 'Dedica 5 minutos a respiración profunda y consciente.', xp: 7 },
        { titulo: 'Estiramiento de espalda', descripcion: '10 minutos de estiramientos enfocados en espalda y cuello.', xp: 8 },
        { titulo: 'Pausa activa', descripcion: 'Levántate a moverte 5 minutos cada hora durante tu jornada.', xp: 8 },
        { titulo: 'Camina después de comer', descripcion: 'Da un paseo corto de 10 minutos después de una comida.', xp: 9 },
      ],
      media: [
        { titulo: 'Movilidad articular', descripcion: '15 minutos de rutina de movilidad para todo el cuerpo.', xp: 16 },
        { titulo: 'Camina 30 minutos', descripcion: 'Da un paseo de al menos 30 minutos.', xp: 16 },
        { titulo: 'Yoga suave', descripcion: '20 minutos de sesión de yoga o estiramientos guiados.', xp: 16 },
        { titulo: 'Rutina anti-sedentarismo', descripcion: 'Levántate a moverte cada 45 minutos durante todo el día.', xp: 15 },
        { titulo: 'Paseo activo con cuestas', descripcion: 'Camina 30 minutos incluyendo alguna zona con desnivel.', xp: 17 },
        { titulo: 'Estiramiento completo', descripcion: '20 minutos de estiramiento de cuerpo completo.', xp: 16 },
      ],
      difícil: [
        { titulo: 'Rutina de activación completa', descripcion: '25 minutos combinando movilidad, cardio suave y estiramiento.', xp: 24 },
        { titulo: 'Camina 60 minutos', descripcion: 'Da un paseo de al menos 1 hora.', xp: 24 },
        { titulo: 'Sesión de bienestar completa', descripcion: '30 minutos combinando movilidad, respiración y cardio ligero.', xp: 25 },
        { titulo: 'Día activo sin sedentarismo', descripcion: 'Muévete al menos 5 minutos cada hora, todo el día.', xp: 24 },
        { titulo: 'Rutina matutina completa', descripcion: '30 minutos de movilidad y activación al despertar.', xp: 25 },
        { titulo: 'Paseo largo activo', descripcion: 'Camina 90 minutos a ritmo variable.', xp: 26 },
      ],
    },
    semanal: {
      fácil:   [{ titulo: 'Muévete 3 días', descripcion: 'Dedica al menos 15 minutos a moverte 3 días esta semana.', xp: 35 },
                { titulo: 'Estiramientos 3 días', descripcion: 'Dedica 10 minutos a estirar, 3 días esta semana.', xp: 34 },
                { titulo: 'Semana de pausas activas', descripcion: 'Haz al menos una pausa activa al día, 3 días esta semana.', xp: 34 }],
      media:   [{ titulo: 'Muévete 5 días', descripcion: 'Dedica al menos 20 minutos a moverte 5 días esta semana.', xp: 55 },
                { titulo: 'Semana de movilidad', descripcion: '20 minutos de movilidad, 4 días esta semana.', xp: 54 },
                { titulo: 'Bienestar semanal', descripcion: 'Combina movimiento y descanso de calidad 5 días esta semana.', xp: 55 }],
      difícil: [{ titulo: 'Semana activa completa', descripcion: 'Muévete al menos 30 minutos todos los días de la semana.', xp: 75 },
                { titulo: 'Reto de constancia diaria', descripcion: 'Completa una rutina de bienestar los 7 días de la semana.', xp: 80 },
                { titulo: 'Semana sin sedentarismo total', descripcion: 'Levántate a moverte cada hora, todos los días de la semana.', xp: 78 }],
    },
    especial: {
      fácil:   [{ titulo: 'Semana sin sedentarismo', descripcion: 'Levántate a caminar al menos una vez cada hora, 5 días seguidos.', xp: 30 },
                { titulo: 'Primer hábito saludable', descripcion: 'Mantén un hábito de bienestar durante 5 días seguidos.', xp: 28 },
                { titulo: 'Reto de estiramientos', descripcion: 'Estira todos los días durante una semana.', xp: 30 }],
      media:   [{ titulo: 'Reto de hábitos saludables', descripcion: 'Combina movimiento diario con buena hidratación durante una semana.', xp: 55 },
                { titulo: 'Reto de constancia', descripcion: 'Cumple tu rutina de bienestar 6 días seguidos.', xp: 56 },
                { titulo: 'Semana de energía', descripcion: 'Combina movimiento, estiramiento y descanso durante una semana.', xp: 58 }],
      difícil: [{ titulo: 'Mes de bienestar', descripcion: 'Mantén una rutina diaria de movimiento durante 30 días.', xp: 90 },
                { titulo: 'Reto de vida activa', descripcion: 'Cero días sedentarios durante un mes completo.', xp: 92 },
                { titulo: 'Transformación de hábitos', descripcion: 'Consolida una rutina saludable sostenida durante 4 semanas.', xp: 90 }],
    },
  },
};

async function sembrar() {
  const batch = db.batch();
  let contador = 0;

  for (const objetivo in catalogo) {
    for (const categoria in catalogo[objetivo]) {
      for (const dificultad in catalogo[objetivo][categoria]) {
        catalogo[objetivo][categoria][dificultad].forEach(mision => {
          const ref = db.collection('missionsCatalog').doc();
          batch.set(ref, {
            ...mision,
            objetivo,
            categoria,
            dificultad,
            createdAt: new Date().toISOString(),
          });
          contador++;
        });
      }
    }
  }

  await batch.commit();
  console.log(`✅ ${contador} misiones sembradas correctamente`);
}

sembrar().then(() => process.exit());