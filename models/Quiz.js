const mongoose = require('mongoose');

const respuestaSchema = new mongoose.Schema({
  respuesta: { type: String, required: true }
});

const preguntaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  respuesta_correcta: { type: String, required: true },
  respuestas: [respuestaSchema]
});

const quizSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Campo para el nombre del quiz
  descripcion: { type: String, required: true }, 
  preguntas: [preguntaSchema]
});

module.exports = mongoose.model('Quiz', quizSchema);