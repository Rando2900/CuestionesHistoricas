const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true }, // Una sola pregunta como cadena
  opciones: { type: [String], required: true }, // Array de opciones
  respuesta: { type: String, required: true } // Una sola respuesta como cadena
});

module.exports = mongoose.models.Pregunta || mongoose.model('Pregunta', preguntaSchema);