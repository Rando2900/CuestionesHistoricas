document.addEventListener('DOMContentLoaded', () => {
  const questionsContainer = document.getElementById('questionsContainer');
  const addQuestionButton = document.getElementById('addQuestionBtn');

  // Sincroniza el value del radio con el texto de la respuesta
  function syncRadioValues(questionElem) {
    const answerDivs = questionElem.querySelectorAll('.answer');
    answerDivs.forEach(answerDiv => {
      const textInput = answerDiv.querySelector('input[type="text"]');
      const radioInput = answerDiv.querySelector('input[type="radio"]');
      textInput.addEventListener('input', () => {
        radioInput.value = textInput.value;
      });
    });
  }

  // Aplica a las preguntas ya existentes
  document.querySelectorAll('.question').forEach(syncRadioValues);

  // Cuando añades una nueva pregunta, también aplica la sincronización
  if (addQuestionButton) {
    addQuestionButton.addEventListener('click', () => {
      setTimeout(() => {
        const newQuestion = questionsContainer.lastElementChild;
        syncRadioValues(newQuestion);
      }, 0);
    });
  }

  // Añadir nueva pregunta
  addQuestionButton.addEventListener('click', () => {
    const questionCount = questionsContainer.querySelectorAll('.question').length;
    const newQuestionHTML = `
      <div class="question" data-index="${questionCount}">
        <div class="question-header">
          <label>Pregunta ${questionCount + 1}</label>
          <input type="text" name="preguntas[${questionCount}][pregunta]" required placeholder="Escribe tu pregunta aquí">
          <button type="button" class="remove-question" title="Eliminar pregunta">&times;</button>
        </div>
        <div class="answers">
          ${[0,1,2,3].map(rIdx => `
            <div class="answer">
              <input type="text" name="preguntas[${questionCount}][respuestas][${rIdx}][respuesta]" required placeholder="Respuesta ${rIdx + 1}">
              <label>
                <input type="radio" name="preguntas[${questionCount}][respuesta_correcta]" value="" required>
                Correcta
              </label>
            </div>
          `).join('')}
        </div>
        <div class="multimedia-container">
          <label class="custom-file-label">
            Añadir multimedia
            <input type="file" name="preguntas[${questionCount}][multimedia]" class="multimedia-input">
          </label>
          <img class="preview-img" src="" style="display:none; max-width: 200px; margin-top: 10px;">
        </div>
      </div>
    `;
    questionsContainer.insertAdjacentHTML('beforeend', newQuestionHTML);
    const newQuestion = questionsContainer.lastElementChild;
    attachRemoveEvent(newQuestion);
    setupImagePreview(newQuestion);
  });

  // Evento para eliminar pregunta
  function attachRemoveEvent(questionElement) {
    const removeBtn = questionElement.querySelector('.remove-question');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        questionElement.remove();
        // Re-enumerar preguntas para mantener los índices y nombres consistentes
        renumberQuestions();
      });
    }
  }

  // Re-enumerar preguntas tras eliminar
  function renumberQuestions() {
    const questions = questionsContainer.querySelectorAll('.question');
    questions.forEach((q, idx) => {
      q.setAttribute('data-index', idx);
      q.querySelector('label').textContent = `Pregunta ${idx + 1}`;
      q.querySelector('input[type="text"]').setAttribute('name', `preguntas[${idx}][pregunta]`);
      // Respuestas
      const answers = q.querySelectorAll('.answer');
      answers.forEach((a, rIdx) => {
        a.querySelector('input[type="text"]').setAttribute('name', `preguntas[${idx}][respuestas][${rIdx}][respuesta]`);
        a.querySelector('input[type="radio"]').setAttribute('name', `preguntas[${idx}][respuesta_correcta]`);
      });
      // Multimedia
      const fileInput = q.querySelector('.multimedia-container input[type="file"]');
      if (fileInput) fileInput.setAttribute('name', `preguntas[${idx}][multimedia]`);
    });
  }

  function setupImagePreview(questionElem) {
    const fileInput = questionElem.querySelector('input[type="file"]');
    const previewImg = questionElem.querySelector('.preview-img');
    if (fileInput && previewImg) {
      fileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
          };
          reader.readAsDataURL(this.files[0]);
        } else {
          previewImg.src = '';
          previewImg.style.display = 'none';
        }
      });
    }
  }

  function attachPreviewEvent(questionElement) {
    const input = questionElement.querySelector('.multimedia-input');
    const previewImage = questionElement.querySelector('.preview-img');
    if (!input || !previewImage) return;

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        previewImage.style.display = 'none';
        previewImage.src = '';
      }
    });
  }

  // Inicializa los eventos para las preguntas ya existentes
  document.querySelectorAll('.question').forEach(questionElem => {
    attachRemoveEvent(questionElem);
    setupImagePreview(questionElem);
    attachPreviewEvent(questionElem);
  });
});