var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session'); // Importa el módulo de sesiones

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth'); // Importa las rutas de autenticación
const quizRouter = require('./routes/quiz'); // Importa las rutas de quiz

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
  secret: 'mi_secreto_seguro', // Cambia esto por una cadena segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Usa `true` si estás usando HTTPS
}));

// Middleware para pasar la sesión a las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use('/', authRouter); // Rutas de autenticación
app.use('/', indexRouter); // Rutas de inicio
app.use('/users', usersRouter); // Rutas de usuarios
app.use('/quiz', quizRouter); // Rutas de quiz

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
