document.getElementById('addQuestionButton').addEventListener('click', () => {
  const questionsContainer = document.getElementById('questionsContainer');
  const questionCount = questionsContainer.children.length;

  const newQuestion = document.createElement('div');
  newQuestion.classList.add('question');
  newQuestion.innerHTML = `
    <label for="pregunta">Pregunta:</label>
    <input type="text" name="preguntas[${questionCount}][pregunta]" required>

    <label>Respuestas:</label>
    <input type="text" name="preguntas[${questionCount}][respuestas][0][respuesta]" required placeholder="Respuesta 1">
    <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="0" required> Correcta<br>
    <input type="text" name="preguntas[${questionCount}][respuestas][1][respuesta]" required placeholder="Respuesta 2">
    <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="1"> Correcta<br>
    <input type="text" name="preguntas[${questionCount}][respuestas][2][respuesta]" required placeholder="Respuesta 3">
    <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="2"> Correcta<br>
    <input type="text" name="preguntas[${questionCount}][respuestas][3][respuesta]" required placeholder="Respuesta 4">
    <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="3"> Correcta<br>
  `;
  questionsContainer.appendChild(newQuestion);
});