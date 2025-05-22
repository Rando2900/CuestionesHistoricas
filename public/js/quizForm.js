document.addEventListener('DOMContentLoaded', () => {
  const questionsContainer = document.getElementById('questionsContainer');
  const addQuestionButton = document.getElementById('addQuestionButton');

  addQuestionButton.addEventListener('click', () => {
    const questionCount = questionsContainer.children.length;

    const newQuestionHTML = `
      <div class="question">
        <div class="question-header">
          <input type="text" name="preguntas[${questionCount}][pregunta]" placeholder="Escribe tu pregunta aquí" required>
        </div>
        <div class="multimedia-container">
          <label for="multimedia-${questionCount}">Busca e inserta los elementos multimedia</label>
          <input type="file" id="multimedia-${questionCount}" name="preguntas[${questionCount}][multimedia]" accept="image/*,video/*" class="multimedia-input">
          <label for="multimedia-${questionCount}" class="custom-file-label">Seleccionar archivo</label>
          <span class="file-selected-text">Ningún archivo seleccionado</span>
          <div class="image-preview-container">
            <img class="preview-image" style="display: none;">
            <button type="button" class="remove-image-button" style="display: none;">❌</button>
          </div>
        </div>
        <div class="answers">
          <div class="answer red">
            <input type="text" name="preguntas[${questionCount}][respuestas][0][respuesta]" placeholder="Respuesta 1" required>
            <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="0" required>
          </div>
          <div class="answer blue">
            <input type="text" name="preguntas[${questionCount}][respuestas][1][respuesta]" placeholder="Respuesta 2" required>
            <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="1">
          </div>
          <div class="answer yellow">
            <input type="text" name="preguntas[${questionCount}][respuestas][2][respuesta]" placeholder="Respuesta 3" required>
            <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="2">
          </div>
          <div class="answer green">
            <input type="text" name="preguntas[${questionCount}][respuestas][3][respuesta]" placeholder="Respuesta 4" required>
            <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="3">
          </div>
        </div>
        <button type="button" class="delete-question-button">Eliminar pregunta</button>
      </div>
    `;

    // Inserta la nueva pregunta y obtiene el elemento recién insertado
    questionsContainer.insertAdjacentHTML('beforeend', newQuestionHTML);
    const newQuestion = questionsContainer.lastElementChild;

    attachDeleteEvent(newQuestion);
    attachPreviewEvent(newQuestion);
  });

  // Solo agrega el evento al botón de eliminar de la pregunta dada
  function attachDeleteEvent(questionElement) {
    const deleteButton = questionElement.querySelector('.delete-question-button');
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        questionElement.remove();
      });
    }
  }

  // Solo agrega el evento de preview al input de archivo de la pregunta dada
  function attachPreviewEvent(questionElement) {
    const input = questionElement.querySelector('.multimedia-input');
    const fileLabel = input.nextElementSibling; // El label personalizado
    const fileText = fileLabel.nextElementSibling; // El texto de archivo seleccionado
    const previewContainer = fileText.nextElementSibling;
    const previewImage = previewContainer.querySelector('.preview-image');
    const removeButton = previewContainer.querySelector('.remove-image-button');

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      fileText.textContent = file ? file.name : 'Ningún archivo seleccionado';

      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewImage.style.display = 'block';
          removeButton.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        previewImage.style.display = 'none';
        previewImage.src = '';
        removeButton.style.display = 'none';
      }
    });

    removeButton.addEventListener('click', () => {
      previewImage.style.display = 'none';
      previewImage.src = '';
      removeButton.style.display = 'none';
      input.value = ''; // Limpiar el input de archivo
      fileText.textContent = 'Ningún archivo seleccionado';
    });
  }

  // Inicializa los eventos para la pregunta inicial (si existe)
  const initialQuestion = questionsContainer.querySelector('.question');
  if (initialQuestion) {
    attachDeleteEvent(initialQuestion);
    attachPreviewEvent(initialQuestion);
  }
});