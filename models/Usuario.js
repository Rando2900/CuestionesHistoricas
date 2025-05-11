const mongoose = require('../db');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } // Campo para la fecha de creación
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;