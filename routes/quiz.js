const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Modelo del Quiz
const isAuthenticated = require('../middleware/auth'); // Middleware de autenticación
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ruta para mostrar el formulario de creación
router.get('/create', isAuthenticated, (req, res) => {
  res.render('create-quiz', { session: req.session });
});

// Ruta para explorar todos los quizzes
router.get('/explore', isAuthenticated, async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Obtiene todos los quizzes de la base de datos
    res.render('explore', { quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los quizzes');
  }
});

// Ruta para manejar la creación del quiz
router.post('/create', isAuthenticated, upload.any(), async (req, res) => {
  const { nombre, descripcion, categoria, preguntas } = req.body; // <-- Añade categoria aquí
  const user = req.session.user;

  // Si solo hay una pregunta, preguntas no es array
  const preguntasArray = Array.isArray(preguntas) ? preguntas : [preguntas];

  // Procesa cada pregunta para guardar el texto de la respuesta correcta y el archivo
  const preguntasProcesadas = preguntasArray.map((p, i) => {
    const respuestasArray = Array.isArray(p.respuestas) ? p.respuestas : Object.values(p.respuestas);
    const idx = Number(p.respuesta_correcta);

    // Busca el archivo correspondiente a esta pregunta
    const multimediaFile = req.files.find(
      file => file.fieldname === `preguntas[${i}][multimedia]`
    );

    return {
      pregunta: p.pregunta,
      respuestas: respuestasArray,
      respuesta_correcta: respuestasArray[idx].respuesta,
      multimedia: multimediaFile ? `/uploads/${multimediaFile.filename}` : ""
    };
  });

  const nuevoQuiz = new Quiz({
    nombre,
    descripcion,
    categoria, // <-- Añade categoria aquí
    preguntas: preguntasProcesadas,
    userId: user.id
  });

  await nuevoQuiz.save();
  res.redirect('/quiz/explore');
});

router.get('/play/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id); // Busca el quiz por su ID
    if (!quiz) {
      return res.status(404).send('Quiz no encontrado');
    }
    res.render('play-quiz', { quiz }); // Renderiza la vista y pasa el quiz
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el quiz');
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { respuestas } = req.body; // Respuestas enviadas por el usuario
    const quiz = await Quiz.findById(req.body.quizId); // Encuentra el quiz correspondiente

    if (!quiz) {
      return res.status(404).send('Quiz no encontrado');
    }

    // Comparar las respuestas del usuario con las correctas
  const resultados = quiz.preguntas.map((pregunta, index) => {
    const respuestaUsuario = respuestas[index];
    // Compara por texto, no por índice
    const esCorrecta = pregunta.respuesta_correcta === respuestaUsuario;
    return {
      pregunta: pregunta.pregunta,
      respuestas: pregunta.respuestas,
      respuesta_correcta: pregunta.respuesta_correcta,
      respuesta_usuario: respuestaUsuario,
      esCorrecta
    };
  });

    // Renderizar la vista con los resultados
    res.render('quiz-results', { quiz, resultados }); // Pasa `resultados` a la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar las respuestas');
  }
});

// Mostrar formulario de edición
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).send('Quiz no encontrado');
  // Solo el dueño puede editar
  if (quiz.userId.toString() !== req.session.user.id) return res.status(403).send('No autorizado');
  res.render('edit-quiz', { quiz });
});

// Procesar edición
router.post('/edit/:id', isAuthenticated, upload.any(), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).send('Quiz no encontrado');
    if (quiz.userId.toString() !== req.session.user.id) return res.status(403).send('No autorizado');

    quiz.nombre = req.body.nombre;
    quiz.descripcion = req.body.descripcion;
    quiz.categoria = req.body.categoria;

    quiz.preguntas = [];
    const preguntas = req.body.preguntas;
    if (preguntas) {
      const preguntasArray = Array.isArray(preguntas) ? preguntas : Object.values(preguntas);

      preguntasArray.forEach((pregunta, idx) => {
        let respuestas = pregunta.respuestas;
        if (respuestas && !Array.isArray(respuestas)) {
          respuestas = Object.values(respuestas);
        }

        // Busca el archivo subido para esta pregunta
        const multimediaFile = req.files.find(
          file => file.fieldname === `preguntas[${idx}][multimedia]`
        );

        // Si no se subió archivo nuevo, conserva el anterior
        let multimedia = pregunta.multimedia || "";
        if (multimediaFile) {
          multimedia = `/uploads/${multimediaFile.filename}`;
        }

        quiz.preguntas.push({
          pregunta: pregunta.pregunta,
          respuestas: respuestas ? respuestas.map(r => ({ respuesta: r.respuesta })) : [],
          respuesta_correcta: pregunta.respuesta_correcta,
          multimedia
        });
      });
    }

    await quiz.save();
    res.redirect('/users/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al editar el quiz');
  }
});

router.post('/delete/:id', isAuthenticated, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).send('Quiz no encontrado');
  if (quiz.userId.toString() !== req.session.user.id) return res.status(403).send('No autorizado');
  await quiz.deleteOne();
  res.redirect('/users/profile');
});

module.exports = router;