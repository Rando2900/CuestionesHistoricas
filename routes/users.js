var express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Ruta para el perfil del usuario
router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si no está autenticado
  }

  // Si `createdAt` no está en la sesión, busca al usuario en la base de datos
  const usuario = await Usuario.findById(req.session.user.id);
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }

  res.render('profile', { user: usuario }); // Pasa el usuario completo a la vista
});

module.exports = router;
