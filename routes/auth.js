const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    const success = req.session.success;
    delete req.session.success;
    res.render('login', { 
        success,
        error: undefined // <-- Añade esto para que siempre exista la variable
    });
});

// Ruta para manejar el inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    // Guarda la información del usuario en la sesión
    req.session.user = {
      id: usuario._id,
      username: usuario.username,
      email: usuario.email,
      createdAt: usuario.createdAt
    };

    res.redirect('/'); // Redirige al inicio después de iniciar sesión
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Redirige al login después de cerrar sesión
  });
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  console.log(req.body); // Verifica los datos enviados desde el formulario

  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    await nuevoUsuario.save();
    // Después de registrar exitosamente:
    req.session.success = 'Usuario registrado correctamente. Ahora puedes iniciar sesión.';
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar el usuario');
  }
});

module.exports = router;