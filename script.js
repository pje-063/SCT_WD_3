const questions = [
    {
        type: "single",
        question: "Which HTML tag is used to attach external CSS stylesheets?",
        options: ["<script>", "<style>", "<link>", "<css>"],
        answer: "<link>"
    },
    {
        type: "multi",
        question: "Select ALL valid JavaScript data types: (Choose multiple)",
        options: ["String", "Boolean", "Integer", "Number"],
        answer: ["String", "Boolean", "Number"]
    },
    {
        type: "blank",
        question: "Which CSS property controls text size?",
        answer: "font-size"
    },
    {
        type: "single",
        question: "Which array method adds an item to the end of an array?",
        options: ["pop()", "push()", "shift()", "unshift()"],
        answer: "push()"
    }
];

let currentIndex = 0;
let score = 0;
let userSelection = [];

const progressBar = document.getElementById("progressBar");
const questionTracker = document.getElementById("questionTracker");
const questionType = document.getElementById("questionType");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const hintText = document.getElementById("hintText");

const quizBody = document.getElementById("quizBody");
const quizFooter = document.getElementById("quizFooter");
const metaBar = document.querySelector(".meta-bar");
const resultsCard = document.getElementById("resultsCard");
const userScore = document.getElementById("userScore");
const totalQuestions = document.getElementById("totalQuestions");
const scoreMsg = document.getElementById("scoreMsg");
const restartBtn = document.getElementById("restartBtn");

function loadQuestion() {
    userSelection = [];
    nextBtn.disabled = true;
    hintText.textContent = "";
    optionsContainer.innerHTML = "";

    const item = questions[currentIndex];
    questionTracker.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
    questionText.textContent = item.question;

    if (item.type === "single") {
        questionType.textContent = "Single Select";
        renderSingle(item.options);
    } else if (item.type === "multi") {
        questionType.textContent = "Multi Select";
        hintText.textContent = "Select all correct answers";
        renderMulti(item.options);
    } else if (item.type === "blank") {
        questionType.textContent = "Fill in Blank";
        renderBlank();
    }
}

function renderSingle(options) {
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt;
        btn.onclick = () => {
            document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            userSelection = [opt];
            nextBtn.disabled = false;
        };
        optionsContainer.appendChild(btn);
    });
}

function renderMulti(options) {
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt;
        btn.onclick = () => {
            if (userSelection.includes(opt)) {
                userSelection = userSelection.filter(val => val !== opt);
                btn.classList.remove("selected");
            } else {
                userSelection.push(opt);
                btn.classList.add("selected");
            }
            nextBtn.disabled = userSelection.length === 0;
        };
        optionsContainer.appendChild(btn);
    });
}

function renderBlank() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your answer here...";
    input.className = "text-input";
    input.oninput = (e) => {
        const val = e.target.value.trim();
        userSelection = val ? [val] : [];
        nextBtn.disabled = val.length === 0;
    };
    optionsContainer.appendChild(input);
}

function nextQuestion() {
    const item = questions[currentIndex];
    let isCorrect = false;

    if (item.type === "single") {
        isCorrect = userSelection[0] === item.answer;
    } else if (item.type === "multi") {
        isCorrect = userSelection.length === item.answer.length &&
            userSelection.every(val => item.answer.includes(val));
    } else if (item.type === "blank") {
        isCorrect = userSelection[0].toLowerCase() === item.answer.toLowerCase();
    }

    if (isCorrect) score++;

    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizBody.classList.add("hidden");
    quizFooter.classList.add("hidden");
    metaBar.classList.add("hidden");
    resultsCard.classList.remove("hidden");

    userScore.textContent = score;
    totalQuestions.textContent = questions.length;

    const percentage = (score / questions.length) * 100;
    if (percentage === 100) {
        scoreMsg.textContent = "Perfect score! Exceptional work.";
    } else if (percentage >= 50) {
        scoreMsg.textContent = "Good job! Solid performance.";
    } else {
        scoreMsg.textContent = "Keep learning and try again!";
    }
}

function restartQuiz() {
    currentIndex = 0;
    score = 0;
    quizBody.classList.remove("hidden");
    quizFooter.classList.remove("hidden");
    metaBar.classList.remove("hidden");
    resultsCard.classList.add("hidden");
    loadQuestion();
}

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

loadQuestion();