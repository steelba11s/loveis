const questions = [
  {
    text: "Ты любишь Артура?",
    answers: ["Да", "Конечно да", "Очень сильно да", "Не люблю"],
  },
  {
    text: "Правда любишь?",
    answers: ["Правда", "Очень правда", "Сильнее всех", "Нет"],
  },
  {
    text: "Правда-правда любишь?",
    answers: ["Дааа", "Правда-правда", "Клянусь сердечком", "Не уверена"],
  },
  {
    text: "Насколько сильно ты любишь Артура?",
    answers: ["Сильно", "Очень сильно", "Бесконечно", "Чуть-чуть"],
  },
  {
    text: "Кто самый милый?",
    answers: ["Артур", "Соня", "Мы вместе", "Не знаю"],
  },
  {
    text: "Ты согласна получить обнимашку?",
    answers: ["Да", "Срочно", "Две", "Нет"],
  },
  {
    text: "Ты скучаешь по Артуру?",
    answers: ["Да", "Очень", "Каждую секунду", "Нет"],
  },
  {
    text: "Артур заслуживает поцелуй?",
    answers: ["Да", "Конечно", "Много поцелуев", "Не заслуживает"],
  },
  {
    text: "Ты самая лучшая девушка на свете?",
    answers: ["Да", "Да, Артур так сказал", "Конечно", "Не знаю"],
  },
  {
    text: "Готова увидеть наши милые фото?",
    answers: ["Да", "Очень", "Показывай скорее", "Нет"],
  },
];

const wrongAnswers = new Set([
  "Не люблю",
  "Нет",
  "Не уверена",
  "Чуть-чуть",
  "Не знаю",
  "Не заслуживает",
]);

const wrongReactions = [
  "Эта кнопка не подходит для такого серьезного теста.",
  "Артур не верит этому ответу.",
  "Попробуй еще раз, но сердцем.",
  "Кнопка передумала быть неправильной.",
  "Ладно, она почти согласна стать хорошей кнопкой.",
];

const gallery = [
  {
    src: "img/photo_2026-01-24_21-00-13.jpg",
    caption: "Наш милый момент",
  },
  {
    src: "img/photo_2026-02-05_15-48-58.jpg",
    caption: "Тут мы особенно красивые",
  },
  {
    src: "img/photo_2026-02-05_15-49-03.jpg",
    caption: "Фото, которое хочется пересматривать",
  },
  {
    src: "img/photo_2026-03-11_19-59-28.jpg",
    caption: "Самая любимая улыбка",
  },
  {
    src: "img/photo_2026-03-26_20-16-28.jpg",
    caption: "Еще одно доказательство, что мы милые",
  },
  {
    src: "img/photo_2026-04-03_16-54-04.jpg",
    caption: "Момент, который останется в памяти",
  },
];

const compliments = [
  "Ты самая милая девочка на свете.",
  "У тебя улыбка, от которой сразу становится теплее.",
  "Артур очень рад, что у него есть Соня.",
  "С тобой даже обычный день становится любимым.",
  "Ты красивая, нежная и очень важная.",
  "Соня плюс Артур - самая правильная команда.",
  "Ты делаешь Артура счастливее просто тем, что ты есть.",
];

const app = document.querySelector(".app");
const startScreen = document.querySelector("#startScreen");
const quizScreen = document.querySelector("#quizScreen");
const resultScreen = document.querySelector("#resultScreen");
const startButton = document.querySelector("#startButton");
const questionCounter = document.querySelector("#questionCounter");
const progressBar = document.querySelector("#progressBar");
const questionText = document.querySelector("#questionText");
const reactionText = document.querySelector("#reactionText");
const answers = document.querySelector("#answers");
const showGalleryButton = document.querySelector("#showGalleryButton");
const gallerySection = document.querySelector("#gallerySection");
const galleryGrid = document.querySelector("#galleryGrid");
const complimentButton = document.querySelector("#complimentButton");
const complimentText = document.querySelector("#complimentText");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const lightboxClose = document.querySelector("#lightboxClose");

let currentQuestion = 0;
let escapeCount = 0;
let complimentIndex = 0;

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach((item) => {
    item.classList.toggle("is-active", item === screen);
  });
}

function renderQuestion() {
  const question = questions[currentQuestion];

  escapeCount = 0;
  questionCounter.textContent = `${currentQuestion + 1} из ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = question.text;
  reactionText.textContent = "Выбирай честно, но правильно.";
  answers.innerHTML = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    const isWrong = wrongAnswers.has(answer);

    button.type = "button";
    button.className = `answer-button ${isWrong ? "wrong" : "correct"}`;
    button.textContent = answer;
    button.dataset.wrong = String(isWrong);

    if (isWrong) {
      button.addEventListener("mouseenter", () => moveWrongButton(button));
      button.addEventListener("pointerdown", (event) => {
        if (escapeCount < 4) {
          event.preventDefault();
          moveWrongButton(button);
        }
      });
    }

    button.addEventListener("click", () => {
      if (button.dataset.wrong === "true" && escapeCount < 4) {
        moveWrongButton(button);
        return;
      }

      nextQuestion();
    });

    answers.append(button);
  });
}

function moveWrongButton(button) {
  const width = button.offsetWidth || 210;
  const height = button.offsetHeight || 54;
  const padding = 18;
  const maxLeft = Math.max(padding, window.innerWidth - width - padding);
  const maxTop = Math.max(padding, window.innerHeight - height - padding);
  const left = Math.floor(Math.random() * (maxLeft - padding + 1)) + padding;
  const top = Math.floor(Math.random() * (maxTop - padding + 1)) + padding;

  escapeCount += 1;
  button.classList.add("is-running");
  button.style.left = `${left}px`;
  button.style.top = `${top}px`;
  reactionText.textContent = wrongReactions[Math.min(escapeCount - 1, wrongReactions.length - 1)];

  if (escapeCount >= 4) {
    button.textContent = "Ладно, люблю";
    button.dataset.wrong = "false";
    button.classList.remove("wrong");
    button.classList.add("correct");
  }
}

function nextQuestion() {
  currentQuestion += 1;

  if (currentQuestion >= questions.length) {
    app.classList.add("is-finished");
    showScreen(resultScreen);
    return;
  }

  renderQuestion();
}

function renderGallery() {
  galleryGrid.innerHTML = "";

  gallery.forEach((photo) => {
    const figure = document.createElement("figure");
    const button = document.createElement("button");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");

    figure.className = "photo-card";
    button.type = "button";
    image.src = photo.src;
    image.alt = photo.caption;
    image.loading = "lazy";
    caption.textContent = photo.caption;

    button.append(image, caption);
    button.addEventListener("click", () => openLightbox(photo));
    figure.append(button);
    galleryGrid.append(figure);
  });
}

function openLightbox(photo) {
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.caption;
  lightboxCaption.textContent = photo.caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

startButton.addEventListener("click", () => {
  currentQuestion = 0;
  app.classList.remove("is-finished");
  renderQuestion();
  showScreen(quizScreen);
});

showGalleryButton.addEventListener("click", () => {
  gallerySection.scrollIntoView({ behavior: "smooth" });
});

complimentButton.addEventListener("click", () => {
  complimentIndex = (complimentIndex + 1) % compliments.length;
  complimentText.textContent = compliments[complimentIndex];
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

renderGallery();
