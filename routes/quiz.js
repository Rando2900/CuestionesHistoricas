const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Modelo del Quiz

// Ruta para mostrar el formulario de creación
router.get('/create', (req, res) => {
  res.render('create-quiz');
});

// Ruta para explorar todos los quizzes
router.get('/explore', async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Obtiene todos los quizzes de la base de datos
    res.render('explore', { quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los quizzes');
  }
});

// Ruta para manejar la creación del quiz
router.post('/create', async (req, res) => {
  try {
    const { nombre, descripcion, preguntas } = req.body;

    const nuevoQuiz = new Quiz({
      nombre,
      descripcion,
      preguntas
    });

    await nuevoQuiz.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar el quiz');
  }
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

module.exports = router;