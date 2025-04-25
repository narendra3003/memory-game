// Selecting elements
const choices = document.querySelectorAll(".box");
const msgBox = document.querySelector("#msg");
const scoreBox = document.querySelector("#score");
const delayBy = 700;

// Variables
let canPlay = true;
let pattern = [];
let counter = 0;
let score = 0;

// Sounds
const correctSound = new Audio('correct.mp3');
const wrongSound = new Audio('wrong.mp3');
const clickSound = new Audio('click.mp3');

const toggleBtn = document.querySelector("#toggle-btn");
const spinner = document.querySelector("#spinner");
const alertBox = document.querySelector("#alert");
let isPaused = false;

// Toggle Pause/Play
toggleBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    toggleBtn.innerText = isPaused ? "▶️ Play" : "⏸️ Pause";
    if (isPaused) {
        canPlay = false;
        msgBox.innerText = "⏸️ Game Paused!";
    } else {
        canPlay = true;
        msgBox.innerText = "💬 Game Resumed!";
    }
});

// Show and hide spinner for async actions
const showSpinner = (show) => {
    if (show) spinner.classList.remove("hidden");
    else spinner.classList.add("hidden");
};

// Modify showPattern to show spinner and alerts
const showPattern = async () => {
    canPlay = false;
    showSpinner(true);
    alertBox.innerText = "⏳ Watch the pattern!";
    alertBox.classList.remove("hidden");

    for (let i of pattern) {
        if (isPaused) return;
        light(choices.item(i - 1));
        await delay(delayBy + 250);
    }

    alertBox.classList.add("hidden");
    showSpinner(false);
    canPlay = true;
};

// Modify gamePlayed to prevent interaction during animations
const gamePlayed = async (choice) => {
    if (!canPlay || isPaused) return;

    playSound(clickSound);
    light(choice, 500);

    if (pattern[counter] == choice.id) {
        msgBox.innerText = `✔️ Correct, choose ${counter + 1}`;
        msgBox.style.backgroundColor = "blue";
        counter++;
    } else {
        playSound(wrongSound);
        scoreBox.innerText = `⭐ Score: ${score}`;
        msgBox.innerText = "❌ Wrong, Better Luck Next Time!";
        msgBox.style.backgroundColor = "red";
        canPlay = false;
        enableButtons(); // Re-enable buttons when the game ends
        return;
    }

    // Check if the user completed the pattern
    if (counter == pattern.length) {
        msgBox.innerText = "🎉 Correct, Score +1!";
        msgBox.style.backgroundColor = "green";
        playSound(correctSound);

        score = counter;
        counter = 0;
        scoreBox.innerText = `⭐ Score: ${score}`;
        canPlay = false;

        await delay(2000);
        msgBox.innerText = `💪 Try for ${score + 1}`;
        score++;
        addNew();
        showPattern();
    }
};

// Enhance startOver to indicate loading
function startOver() {
    pattern = [];
    for (let i = 0; i < 5; i++) addNew();
    score = 0;
    canPlay = false;

    scoreBox.innerText = `⭐ Score: ${score}`;
    msgBox.innerText = "💬 Let's Play!";
    msgBox.style.backgroundColor = "blue";

    showSpinner(true);
    setTimeout(() => {
        showPattern();
        showSpinner(false);
    }, delayBy * pattern.length);
}

// Utility Functions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const playSound = (sound) => {
    sound.currentTime = 0; // Restart sound
    sound.play();
};

// Add a new random choice to the pattern
const addNew = () => {
    pattern.push(Math.floor(Math.random() * 9) + 1);
};

// Light up a button
const light = async (choice) => {
    choice.style.borderRadius = "2rem";
    choice.style.backgroundColor = "red";
    await delay(delayBy);
    choice.style.borderRadius = "1rem";
    choice.style.backgroundColor = "#74b9ff";
};

// Event Listeners
choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        if (canPlay) gamePlayed(choice);
    });
});

// Fix event listeners for reset and pattern buttons
document.querySelector("#reset-btn").addEventListener("click", () => {
    startOver();
});

document.querySelector("#pattern-btn").addEventListener("click", () => {
    if (canPlay) showPattern();
});

// Start game initially
startOver();
