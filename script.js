// ======================================================
// SIMON SAYS v3.0
// Author : Saurabh
// ======================================================

// ===================== DOM =====================

const levelDisplay = document.getElementById("level");
const highScoreDisplay = document.getElementById("highScore");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");

const modal = document.getElementById("gameModal");
const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");
const playAgainBtn = document.getElementById("playAgain");

const buttons = document.querySelectorAll(".game-btn");

// ===================== CONFIG =====================

const colors = ["yellow", "red", "green", "blue"];

let flashSpeed = 600;

// ===================== GAME STATE =====================

let gameSequence = [];
let userSequence = [];

let level = 0;
let started = false;
let acceptingInput = false;

// ===================== HIGH SCORE =====================

let highScore = Number(localStorage.getItem("highScore")) || 0;

highScoreDisplay.innerText = highScore;

// ===================== AUDIO =====================

const correctSound = new Audio("assets/sounds/correct.mp3");
const wrongSound = new Audio("assets/sounds/wrong.mp3");

// ===================== EVENTS =====================

// Start Game

startBtn.addEventListener("click", startGame);

// Difficulty

difficultySelect.addEventListener("change", () => {

    flashSpeed = Number(difficultySelect.value);

});

// Play Again

playAgainBtn.addEventListener("click", () => {

    modal.classList.add("hidden");

    resetGame();

});

// Game Buttons

buttons.forEach(button => {

    button.addEventListener("click", () => {

        if (!started || !acceptingInput) return;

        flashButton(button);

        userSequence.push(button.id);

        checkAnswer(userSequence.length - 1);

    });

});

// Keyboard Support

document.addEventListener("keydown", (event) => {

    if (!started || !acceptingInput) return;

    const key = event.key.toLowerCase();

    const keyMap = {

        q: "yellow",
        w: "red",
        a: "green",
        s: "blue"

    };

    if (keyMap[key]) {

        document.getElementById(keyMap[key]).click();

    }

});

// ===================== START GAME =====================

function startGame() {

    if (started) return;

    started = true;

    level = 0;

    gameSequence = [];

    userSequence = [];

    startBtn.disabled = true;

    startBtn.innerHTML = "Playing...";

    message.innerHTML = "";

    nextLevel();

}

// ===================== NEXT LEVEL =====================

function nextLevel() {

    acceptingInput = false;

    userSequence = [];

    level++;

    levelDisplay.innerText = level;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    gameSequence.push(randomColor);

    setTimeout(playSequence, 600);

}

// ===================== PLAY SEQUENCE =====================

function playSequence() {

    let index = 0;

    const interval = setInterval(() => {

        flashButton(document.getElementById(gameSequence[index]));

        index++;

        if (index >= gameSequence.length) {

            clearInterval(interval);

            setTimeout(() => {

                acceptingInput = true;

            }, 250);

        }

    }, flashSpeed);

}

// ===================== FLASH BUTTON =====================

function flashButton(button) {

    correctSound.currentTime = 0;

    correctSound.play();

    button.classList.add("flash");

    setTimeout(() => {

        button.classList.remove("flash");

    }, 250);

}

// ===================== CHECK ANSWER =====================

function checkAnswer(index) {

    if (userSequence[index] !== gameSequence[index]) {

        gameOver();

        return;

    }

    // Completed current sequence
    if (userSequence.length === gameSequence.length) {

        acceptingInput = false;

        message.innerHTML = "✅ Correct!";

        setTimeout(() => {

            message.innerHTML = "";

            nextLevel();

        }, 900);

    }

}

// ===================== GAME OVER =====================

function gameOver() {

    acceptingInput = false;

    started = false;

    wrongSound.currentTime = 0;
    wrongSound.play();

    const score = level - 1;

    // Update High Score

    if (score > highScore) {

        highScore = score;

        localStorage.setItem("highScore", highScore);

        highScoreDisplay.innerText = highScore;

    }

    finalScore.innerText = score;
    bestScore.innerText = highScore;

    modal.classList.remove("hidden");

}

// ===================== RESET GAME =====================

function resetGame() {

    started = false;

    acceptingInput = false;

    level = 0;

    gameSequence = [];

    userSequence = [];

    levelDisplay.innerText = 0;

    message.innerHTML = "Click <strong>Start Game</strong> to begin.";

    startBtn.disabled = false;

    startBtn.innerHTML = `<i class="fa-solid fa-play"></i> Start Game`;

}

// ===================== OPTIONAL UTILITIES =====================

// Flash a button by color
function flashColor(color) {

    const button = document.getElementById(color);

    if (button) {

        flashButton(button);

    }

}

// Reset High Score (use from browser console if needed)
function resetHighScore() {

    localStorage.removeItem("highScore");

    highScore = 0;

    highScoreDisplay.innerText = 0;

}

// ===================== INITIAL STATE =====================

resetGame();