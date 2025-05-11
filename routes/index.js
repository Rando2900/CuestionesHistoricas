const express = require('express');
const router = express.Router();
const Pregunta = require('../models/Pregunta'); // Asegúrate de importar el modelo

// Ruta para la página de inicio
router.get('/', async (req, res, next) => {
  try {
    const quizzes = await Pregunta.find(); // Obtiene todos los quizzes de la base de datos
    res.render('index', { quizzes }); // Pasa los quizzes a la vista
  } catch (err) {
    next(err);
  }
});

module.exports = router;
