const mongoose = require('mongoose');

const respuestaSchema = new mongoose.Schema({
  respuesta: { type: String, required: true }
});

const preguntaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  respuesta_correcta: { type: String, required: true },
  respuestas: [respuestaSchema],
  multimedia: { type: String, required: false } // Campo opcional para multimedia
});

const quizSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Campo para el nombre del quiz
  descripcion: { type: String, required: true }, 
  categoria: { type: String, required: true }, // <-- Añade esta línea
  preguntas: [preguntaSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);