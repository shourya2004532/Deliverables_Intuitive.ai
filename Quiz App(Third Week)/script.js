const questions = [
  { q: "Time complexity of binary search?", o: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], a: 1 },
  { q: "Which data structure follows FIFO?", o: ["Stack", "Queue", "Heap", "Tree"], a: 1 },
  { q: "Inorder traversal of BST results in?", o: ["Random", "Reverse", "Sorted", "Level"], a: 2 },
  { q: "Which structure enables recursion?", o: ["Queue", "Stack", "Heap", "Graph"], a: 1 },
  { q: "Which algorithm uses a priority queue?", o: ["DFS", "BFS", "Dijkstra", "Binary Search"], a: 2 },
  { q: "Which sorting algorithm is stable?", o: ["Quick", "Heap", "Merge", "Selection"], a: 2 },
  { q: "DFS internally relies on?", o: ["Queue", "Stack", "Heap", "Map"], a: 1 },
  { q: "Average time complexity of hashing?", o: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], a: 0 },
  { q: "Which structure supports undo operations?", o: ["Queue", "Stack", "Tree", "Graph"], a: 1 },
  { q: "Shortest path algorithm?", o: ["DFS", "BFS", "Dijkstra", "Binary Search"], a: 2 },

  { q: "Merge sort time complexity?", o: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"], a: 2 },
  { q: "Traversal using queue?", o: ["Inorder", "Preorder", "Postorder", "Level"], a: 3 },
  { q: "Worst case search in BST?", o: ["O(log n)", "O(n)", "O(1)", "O(n log n)"], a: 1 },
  { q: "Two pointers technique applies to?", o: ["DP", "Greedy", "Arrays", "Graphs"], a: 2 },
  { q: "Cycle detection uses?", o: ["DFS", "Binary Search", "Sorting", "Greedy"], a: 0 },
  { q: "Non-linear data structure?", o: ["Array", "Stack", "Queue", "Graph"], a: 3 },
  { q: "LIFO principle belongs to?", o: ["Queue", "Stack", "Heap", "Map"], a: 1 },
  { q: "BFS uses?", o: ["Stack", "Queue", "Heap", "Set"], a: 1 },
  { q: "Improves brute force?", o: ["Recursion", "Optimization", "Backtracking", "DFS"], a: 1 },
  { q: "Key-value storage structure?", o: ["Array", "Stack", "HashMap", "Queue"], a: 2 }
];

let idx = 0, score = 0, attempted = 0;
let time = 30, timer;

const sections = document.querySelectorAll("section");
const home = document.querySelector(".home");
const quiz = document.querySelector(".quiz");
const result = document.querySelector(".result");

const questionEl = document.getElementById("question");
const options = document.querySelectorAll(".option");
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const submitBtn = document.getElementById("submitBtn");
const progressFill = document.querySelector('.progress-fill');
const startBtn = document.getElementById("startBtn");
const resultDetails = document.getElementById('resultDetails');
const resultScoreEl = document.querySelector('#resultScore .number');
const resultBarFill = document.getElementById('resultBarFill');
const logoLink = document.getElementById('logoLink');

function show(section) {
  sections.forEach(s => s.classList.remove("active"));
  section.classList.add("active");
}

startBtn.onclick = () => {
  resetQuiz();
  show(quiz);
  load();
};

function load() {
  clearInterval(timer);
  time = 30;
  timerEl.textContent = `⏱ ${time}`;

  progress.textContent = `Question ${idx + 1} / ${questions.length}`;
  questionEl.textContent = questions[idx].q;

  options.forEach((btn, i) => {
    btn.textContent = questions[idx].o[i];
     btn.className = "option";
    btn.onclick = () => select(i);
    btn.onkeydown = (e)=>{ if(e.key === 'Enter' || e.key === ' ') select(i); };
  });

  nextBtn.disabled = true;
  nextBtn.classList.remove("enabled");

  timer = setInterval(() => {
    time--;
    timerEl.textContent = `⏱ ${time}`;
    if (time === 0) next();
  }, 1000);
}

function select(i) {
  clearInterval(timer);
  attempted++;

  options.forEach(b => b.onclick = null);

  if (i === questions[idx].a) {
    options[i].classList.add("correct");
    score++;
  } else {
    options[i].classList.add("wrong");
    options[questions[idx].a].classList.add("correct");
  }

  nextBtn.disabled = false;
  nextBtn.classList.add("enabled");
}

skipBtn.onclick = next;
nextBtn.onclick = next;

function next() {
  clearInterval(timer);
  idx++;
  idx < questions.length ? load() : finish();
  // update progress fill at question change
  if(progressFill){
    const pct = Math.round((idx-1) / questions.length * 100);
    progressFill.style.width = pct + '%';
  }
}

if(submitBtn){
  submitBtn.addEventListener('click', ()=>{
    clearInterval(timer);
    finish();
  });
}

function finish() {
  show(result);

  const outOf = questions.length;

      resultScoreEl.textContent = score;
 

  // details text
  if(resultDetails){
    resultDetails.innerHTML = `<b>Attempted:</b> ${attempted} &nbsp; • &nbsp; <b>Unattempted:</b> ${questions.length - attempted}`;
  }

  // fill result bar
  const pct = Math.round((score / questions.length) * 100);
  if(resultBarFill) resultBarFill.style.width = pct + '%';

}



function resetQuiz() {
  idx = score = attempted = 0;
}

homeBtn.onclick = () => show(home);
restartBtn.onclick = () => {
  resetQuiz();
  show(quiz);
  load();
};




