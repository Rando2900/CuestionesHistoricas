document.getElementById('addQuestionButton').addEventListener('click', () => {
  const questionsContainer = document.getElementById('questionsContainer');
  const questionCount = questionsContainer.children.length;

  const newQuestion = document.createElement('div');
  newQuestion.classList.add('question');
  newQuestion.innerHTML = `
    <label for="pregunta">Pregunta:</label>
    <input type="text" name="preguntas[${questionCount}][pregunta]" required>

    <label for="respuesta_correcta">Respuesta Correcta:</label>
    <input type="text" name="preguntas[${questionCount}][respuesta_correcta]" required>

    <label>Respuestas:</label>
    <input type="text" name="preguntas[${questionCount}][respuestas][0][respuesta]" required>
    <input type="text" name="preguntas[${questionCount}][respuestas][1][respuesta]" required>
    <input type="text" name="preguntas[${questionCount}][respuestas][2][respuesta]" required>
    <input type="text" name="preguntas[${questionCount}][respuestas][3][respuesta]" required>
  `;
  questionsContainer.appendChild(newQuestion);
});