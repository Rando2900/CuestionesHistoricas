var express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');
const Quiz = require('../models/Quiz'); // Asegúrate de importar el modelo Quiz

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Ruta para el perfil del usuario
router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si no está autenticado
  }

  // Busca el usuario en la base de datos
  const usuario = await Usuario.findById(req.session.user.id);
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }

  // Busca los quizzes creados por el usuario
  const quizzes = await Quiz.find({ userId: usuario._id });

  // Pasa el usuario y los quizzes a la vista
  res.render('profile', { user: usuario, quizzes });
});

module.exports = router;
