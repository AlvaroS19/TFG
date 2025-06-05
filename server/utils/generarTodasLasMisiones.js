const { generarExtras } = require("./generarExtras");

const generarTodasLasMisiones = async (uid, objetivo) => {
  try {
    console.log("🔄 Generando misiones diarias...");

    console.log("🔄 Generando misiones semanales y especiales...");
    await generarExtras(uid, objetivo);

    console.log("Todas las misiones generadas correctamente");
  } catch (error) {
    console.error("Error al generar todas las misiones:", error);
    throw error;
  }
};

module.exports = { generarTodasLasMisiones };