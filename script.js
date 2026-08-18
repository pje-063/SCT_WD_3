const roundsData = [
    // Round 1
    [
        { question: "Which HTML tag is used to attach external CSS stylesheets?", options: ["<script>", "<style>", "<link>", "<css>"], answer: 2 },
        { question: "Which property is used to change the background color in CSS?", options: ["color", "background-color", "bgcolor", "canvas-color"], answer: 1 },
        { question: "Which keyword is used to declare a block-scoped variable in JS?", options: ["var", "let", "def", "set"], answer: 1 },
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management Language", "Home Tool Markup Language"], answer: 0 }
    ],
    // Round 2
    [
        { question: "Which CSS layout box model arrangement is 1-dimensional?", options: ["Grid", "Flexbox", "Float", "Position"], answer: 1 },
        { question: "Which function converts a JSON string into a JS Object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.convert()"], answer: 1 },
        { question: "What does DOM stand for in JavaScript?", options: ["Document Object Model", "Data Object Mode", "Digital Ordinance Map", "Desktop Oriented Markup"], answer: 0 },
        { question: "Which HTTP status code signifies 'Not Found'?", options: ["200", "500", "404", "301"], answer: 2 }
    ]
];

let currentRound = 0;
let currentIndex = 0;
let score = 0;
let streak = 0;
let selectedOption = null;
let timer = 15;
let timerInterval = null;

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const questionCounter = document.getElementById("questionCounter");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const typeBadge = document.getElementById("typeBadge");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const streakCount = document.getElementById("streakCount");
const questionView = document.getElementById("questionView");
const resultView = document.getElementById("resultView");
const finalScore = document.getElementById("finalScore");
const retryBtn = document.getElementById("retryBtn");
const nextRoundBtn = document.getElementById("nextRoundBtn");

function startTimer() {
    clearInterval(timerInterval);
    timer = 15;
    timerEl.textContent = timer;
    timerInterval = setInterval(() => {
        timer--;
        timerEl.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            autoSubmit();
        }
    }, 1000);
}

function loadQuestion() {
    startTimer();
    const currentQuestions = roundsData[currentRound];
    const current = currentQuestions[currentIndex];
    selectedOption = null;
    nextBtn.disabled = true;

    questionText.textContent = current.question;
    typeBadge.textContent = `ROUND ${currentRound + 1}`;
    questionCounter.textContent = `Question ${currentIndex + 1} of ${currentQuestions.length}`;

    const percent = Math.round(((currentIndex + 1) / currentQuestions.length) * 100);
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    optionsContainer.innerHTML = "";
    current.options.forEach((opt, idx) => {
        const div = document.createElement("div");
        div.className = "option-card";
        div.textContent = opt;
        div.onclick = () => selectOption(div, idx);
        optionsContainer.appendChild(div);
    });
}

function selectOption(element, index) {
    if (selectedOption !== null) return;
    clearInterval(timerInterval);
    selectedOption = index;

    const currentQuestions = roundsData[currentRound];
    const current = currentQuestions[currentIndex];
    const isCorrect = index === current.answer;

    if (isCorrect) {
        element.classList.add("correct");
        score++;
        streak++;
    } else {
        element.classList.add("wrong");
        streak = 0;
        optionsContainer.children[current.answer].classList.add("correct");
    }

    streakCount.textContent = streak;
    nextBtn.disabled = false;
}

function autoSubmit() {
    if (selectedOption === null) {
        const currentQuestions = roundsData[currentRound];
        const current = currentQuestions[currentIndex];
        optionsContainer.children[current.answer].classList.add("correct");
        streak = 0;
        streakCount.textContent = streak;
        nextBtn.disabled = false;
    }
}

nextBtn.addEventListener("click", () => {
    currentIndex++;
    const currentQuestions = roundsData[currentRound];
    if (currentIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    questionView.classList.add("hidden");
    resultView.classList.remove("hidden");
    const currentQuestions = roundsData[currentRound];
    finalScore.textContent = `${score} / ${currentQuestions.length}`;

    if (window.confetti && score === currentQuestions.length) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
}

retryBtn.addEventListener("click", () => {
    currentIndex = 0;
    score = 0;
    resultView.classList.add("hidden");
    questionView.classList.remove("hidden");
    loadQuestion();
});

nextRoundBtn.addEventListener("click", () => {
    currentRound = (currentRound + 1) % roundsData.length;
    currentIndex = 0;
    score = 0;
    resultView.classList.add("hidden");
    questionView.classList.remove("hidden");
    loadQuestion();
});

loadQuestion();