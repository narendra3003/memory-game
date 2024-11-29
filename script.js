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

// Reset the game and start over
function startOver() {
    pattern = [];
    for (let i = 0; i < 5; i++) addNew(); // Initialize with 5 steps
    score = 0;
    canPlay = false;

    scoreBox.innerText = `⭐ Score: ${score}`;
    msgBox.innerText = "💬 Let's Play!";
    msgBox.style.backgroundColor = "blue";

    showPattern();
    setTimeout(() => (canPlay = true), delayBy * pattern.length);
}

// Handle user gameplay
const gamePlayed = async (choice) => {
    playSound(clickSound); // Play click sound
    light(choice, 500); // Light up the clicked choice

    if (pattern[counter] == choice.id) {
        msgBox.innerText = `✔️ Correct, choose ${counter + 1}`;
        msgBox.style.backgroundColor = "blue";
        counter++;
    } else {
        playSound(wrongSound); // Play wrong sound
        scoreBox.innerText = `⭐ Score: ${score}`;
        msgBox.innerText = "❌ Wrong, Better Luck Next Time!";
        msgBox.style.backgroundColor = "red";
        canPlay = false;
        return;
    }

    // Check if the user completed the pattern
    if (counter == pattern.length) {
        msgBox.innerText = "🎉 Correct, Score +1!";
        msgBox.style.backgroundColor = "green";
        playSound(correctSound); // Play correct sound
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

// Show the current pattern
const showPattern = async () => {
    canPlay = false;
    setTimeout(() => (canPlay = true), 2000 * pattern.length);

    for (let i of pattern) {
        light(choices.item(i - 1), delayBy);
        await delay(delayBy + 250);
    }
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
