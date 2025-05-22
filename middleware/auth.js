function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // El usuario está autenticado
  }
  res.redirect('/login'); // Redirige al inicio de sesión si no está autenticado
}

module.exports = isAuthenticated;