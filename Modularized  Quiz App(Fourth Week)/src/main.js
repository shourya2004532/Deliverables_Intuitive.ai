import { questions } from "./data.js";
import {
  formatTimer,
  getProgressPercent,
  getResultSummary,
  validateQuestions
} from "./utils.js";
import { calculateScore } from "./score.js";

const sections = document.querySelectorAll("section");
const homeSection = document.querySelector(".home");
const quizSection = document.querySelector(".quiz");
const resultSection = document.querySelector(".result");

const questionEl = document.getElementById("question");
const options = Array.from(document.querySelectorAll(".option"));
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const submitBtn = document.getElementById("submitBtn");
const progressFill = document.querySelector(".progress-fill");
const startBtn = document.getElementById("startBtn");
const resultDetails = document.getElementById("resultDetails");
const resultScoreEl = document.querySelector("#resultScore .number");
const resultBarFill = document.getElementById("resultBarFill");
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");

const QUIZ_TIME = 30;

let idx = 0;
let score = 0;
let attempted = 0;
let time = QUIZ_TIME;
let timerId = null;

const show = (section) => {
  sections.forEach((s) => s.classList.remove("active"));
  section.classList.add("active");
};

const updateTimer = () => {
  if (timerEl) timerEl.textContent = formatTimer(time);
};

const updateProgress = () => {
  if (progress) {
    progress.textContent = `Question ${idx + 1} / ${questions.length}`;
  }
  if (progressFill) {
    const pct = getProgressPercent(idx, questions.length);
    progressFill.style.width = `${pct}%`;
  }
};

const lockOptions = () => {
  options.forEach((btn) => {
    btn.onclick = null;
    btn.onkeydown = null;
    btn.disabled = true;
  });
};

const enableNext = () => {
  if (!nextBtn) return;
  nextBtn.disabled = false;
  nextBtn.classList.add("enabled");
};

const loadQuestion = () => {
  clearInterval(timerId);
  time = QUIZ_TIME;
  updateTimer();
  updateProgress();

  const { q, o } = questions[idx];
  if (questionEl) questionEl.textContent = q;

  options.forEach((btn, i) => {
    btn.textContent = o[i] ?? "";
    btn.className = "option";
    btn.disabled = false;
    const selectHandler = () => selectOption(i);
    btn.onclick = selectHandler;
    btn.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") selectHandler();
    };
  });

  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.classList.remove("enabled");
  }

  timerId = setInterval(() => {
    time -= 1;
    updateTimer();
    if (time <= 0) goNext();
  }, 1000);
};

const selectOption = (index) => {
  clearInterval(timerId);
  attempted += 1;
  lockOptions();

  const correctIndex = questions[idx].a;
  if (index === correctIndex) {
    options[index].classList.add("correct");
  } else {
    options[index].classList.add("wrong");
    if (options[correctIndex]) options[correctIndex].classList.add("correct");
  }

  score = calculateScore(score, index, correctIndex);

  enableNext();
};

const goNext = () => {
  clearInterval(timerId);
  idx += 1;
  if (idx < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
};

const finishQuiz = () => {
  show(resultSection);

  const summary = getResultSummary({
    score,
    attempted,
    total: questions.length
  });

  if (resultScoreEl) resultScoreEl.textContent = summary.safeScore;

  if (resultDetails) {
    resultDetails.innerHTML =
      `<b>Attempted:</b> ${summary.safeAttempted} | ` +
      `<b>Unattempted:</b> ${summary.unattempted}`;
  }

  if (resultBarFill) resultBarFill.style.width = `${summary.pct}%`;
};

const resetQuiz = () => {
  idx = 0;
  score = 0;
  attempted = 0;
  if (progressFill) progressFill.style.width = "0%";
};

const init = () => {
  const validation = validateQuestions(questions);
  if (!validation.valid) {
    if (startBtn) startBtn.disabled = true;
    console.error("Invalid quiz data:", validation.reason);
    return;
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      resetQuiz();
      show(quizSection);
      loadQuestion();
    });
  }

  if (skipBtn) skipBtn.addEventListener("click", goNext);
  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      clearInterval(timerId);
      finishQuiz();
    });
  }
  if (homeBtn) homeBtn.addEventListener("click", () => show(homeSection));
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      resetQuiz();
      show(quizSection);
      loadQuestion();
    });
  }
};

init();
