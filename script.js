// The following variables below are all the sound variables and mute/unmute fucntions 
let backgroundMusic = new Audio();
let portalEnterSound = new Audio();
let portalExitSound = new Audio();

backgroundMusic.src = "sounds/bg-music.mp3";
portalEnterSound.src = "sounds/warp-entrance.mp3";
portalExitSound.src = "sounds/warp-exit.mp3";
let backgroundMusicStatus = 0;
let backgroundMusicInterval;

function playBackgroundMusic() {
    backgroundMusic.play();
    if (backgroundMusicStatus == 1) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = 1;
    }
}

function muteBackgroundMusic() {
    const muteBtnImg = document.getElementById("mute-btn-img");
    if (backgroundMusicStatus == 0) {
        muteBtnImg.setAttribute("src", "assets/HEADER/mute.png");
        backgroundMusic.volume = 0;
        backgroundMusicStatus++;
    } else {
        muteBtnImg.setAttribute("src", "assets/HEADER/unmute.png");
        backgroundMusic.volume = 1;
        backgroundMusicStatus--;
    }
}

document.getElementById("mute-header-btn").addEventListener("click", muteBackgroundMusic)
//END HERE


// The following lines of codes are for the start animation (click to start)
document.addEventListener('click', () => {
    const portal = document.getElementById('portal');
    const burst = document.getElementById('portal-burst');

    void burst.offsetWidth;
    
    burst.classList.add('expand');
    portal.classList.add('show');

    setTimeout(() => {
    portalEnterSound.play();
    document.getElementById('start-title').style.opacity = '0';
    document.getElementById('start-header').style.opacity = '0';
    document.getElementById('bottom-ct').style.bottom = '-80px';
    document.getElementById('top-ct').style.top = '-80px';
    }, 0);

    setTimeout(() => {
        portal.classList.add('zoom');
    }, 600);

    setTimeout(() => {
        portalExitSound.play();
        document.getElementById('background-img').style.opacity = '0';
        document.getElementById('bottom-ct').style.bottom = '-480px';
        document.getElementById('top-ct').style.top = '-480px';
        portal.classList.add('shrink');
    }, 1900);

    setTimeout(() => {
        document.getElementById('background-img').style.opacity = '0';
    }, 2600);

    setTimeout(() => {
        hideStartScreen();
        newLevel();
        resetBoard();
        startTimer();
        changeDisplay();
        burst.classList.remove('expand');
        portal.classList.remove('show', 'zoom', 'shrink');
    }, 2600);
}, { once: true });
//END HERE


// The following variables below are all the timer fucntions 
const initialTime = 45;
let timeRemaining = initialTime;
let timerInterval;


function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// The following lines of codes include all of the functions and variables needed for you to transition from the start screen to the game board
let startScreenTimer;

function hideStartScreen() {
    document.getElementById("start-screen").style.display = "none";
    playBackgroundMusic();
    backgroundMusicInterval = setInterval(playBackgroundMusic, 120000);
    clearInterval(startScreenTimer);
}
//END HERE

// The following lines of codes hides all the header and gameboard elements, and shows the end message
function endGame(){
    const portal = document.getElementById('portal2');
    
    portal.classList.add('show');

    score
    document.getElementById("game-board").style.display = "none"
    document.getElementById("header").style.display = "none"
    clearInterval(backgroundMusicInterval)
    backgroundMusic.volume = 0
    if (score >= 7){
        document.getElementById("pass-end-screen").style.display = "flex"

        const scrambled = "UEFTU0lPTkFURQ==";
        const secretCode = atob(scrambled);

        const secretMessage = document.getElementById("secret-message");
        if (secretMessage) {
            secretMessage.innerHTML = "SECRET MESSAGE: <b>" 
                + secretCode + "</b>.";
        }

    } else {
        document.getElementById("fail-end-screen").style.display = "flex"
    }
}

// FAIL SCREEN PORTAL RESET
document.addEventListener("DOMContentLoaded", () => {
    const resetPortal = document.getElementById("portal-reset");
    if (resetPortal) {
        resetPortal.addEventListener("click", () => {
            location.reload();
        });
    }
});

// END HERE


// GAME FUNCTIONS PROPER

let levelPrompt = document.getElementById("game-level-title")
let questionPrompt = document.getElementById("game-level-text")

const stationLevel = [
  ["STATION 1", "It is the platform used for online course content and submission."],
  ["STATION 2", "The official school email service used for announcements and communication."],
  ["STATION 3", "It is a session that requires students to be physically present in class."],
  ["STATION 4", "A class where students work on practical, hands-on activities."],
  ["STATION 5", "The maximum number of students in a Laboratory Class."],
  ["STATION 6", "It is a learning modality that allows students to attend classes either on-site or online at the same time."],
  ["STATION 7", "The only school that has the hybrid learning modality available."],
  ["STATION 8", "Students must inform this office about mental health-related absences."],
  ["STATION 9", "Where you can access the academic calendar and course tools."],
  ["STATION 10", "It is a class conducted through virtual platforms where students and teachers interact without being physically present together."]
]

function newLevel() {
    levelPrompt.innerHTML = stationLevel[currentLevel][0]
    questionPrompt.innerHTML = stationLevel[currentLevel][1]
}

const gridSize = 6;
let clickedLetters = [];
let clickedPositions = [];
let currentLevel = 0;
let allowedDirection = null;
const buttonStates = {};
let score = 0;


const wordsToFind = [
  "BIGSKY",
  "BMAIL",
  "FTF",
  "LAB",
  "TWENTY",
  "HYBRID",
  "SDEAS",
  "BWC",
  "BESTAR",
  "ONLINE"
]

function getRandomLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
}

function placeWordOnGrid(word) {
    const direction = Math.floor(Math.random() * 3);
    let startRow, startCol;

    switch (direction) {
        case 0: // Horizontal
            startRow = Math.floor(Math.random() * gridSize);
            startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
                document.getElementById(`grid-button-${startRow * gridSize + startCol + i + 1}`).innerText = word[i];
            }
            break;
        case 1: // Vertical
            startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
            startCol = Math.floor(Math.random() * gridSize);
            for (let i = 0; i < word.length; i++) {
                document.getElementById(`grid-button-${(startRow + i) * gridSize + startCol + 1}`).innerText = word[i];
            }
            break;
        case 2: // Diagonal
            startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
            startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
            for (let i = 0; i < word.length; i++) {
                document.getElementById(`grid-button-${(startRow + i) * gridSize + startCol + i + 1}`).innerText = word[i];
            }
            break;
    }
}

function resetBoard() {
    clickedLetters = [];
    clickedPositions = [];
    allowedDirection = null;

    for (let i = 1; i <= gridSize * gridSize; i++) {
        document.getElementById(`grid-button-${i}`).innerText = getRandomLetter();
        buttonStates[i] = false;
        document.getElementById(`grid-button-${i}`).style.backgroundColor = "white";
    }

    if (currentLevel < wordsToFind.length) {
            clearInterval(timerInterval);
            timeRemaining = initialTime;
            startTimer();
        const currentWord = wordsToFind[currentLevel];
        placeWordOnGrid(currentWord);
    } else {
        endGame();
    }
}

function resetLevel() {
    alert("Invalid move! The board will reset to the current level.");
    
    clickedLetters = [];
    clickedPositions = [];
    allowedDirection = null;
    for (let i = 1; i <= gridSize * gridSize; i++) {
        document.getElementById(`grid-button-${i}`).innerText = getRandomLetter();
        buttonStates[i] = false;
        document.getElementById(`grid-button-${i}`).style.backgroundColor = "white";
    }
    
    if (currentLevel < wordsToFind.length) {
        const currentWord = wordsToFind[currentLevel];
        placeWordOnGrid(currentWord);
    }
}

function determineDirection(startPos, nextPos) {
    const startRow = Math.floor((startPos - 1) / gridSize);
    const startCol = (startPos - 1) % gridSize;
    const nextRow = Math.floor((nextPos - 1) / gridSize);
    const nextCol = (nextPos - 1) % gridSize;

    if (startRow === nextRow) {
        return "horizontal";
    } else if (startCol === nextCol) {
        return "vertical";
    } else if (Math.abs(startRow - nextRow) === Math.abs(startCol - nextCol)) {
        return "diagonal";
    }
    return null;
}

function isMoveAllowed(newPos) {
    const newDirection = determineDirection(clickedPositions[0], newPos);

    if (allowedDirection === null) {
        allowedDirection = newDirection;
        return true;
    }

    return allowedDirection === newDirection;
}

function isAdjacent(lastPos, newPos) {
    const lastRow = Math.floor((lastPos - 1) / gridSize);
    const lastCol = (lastPos - 1) % gridSize;
    const newRow = Math.floor((newPos - 1) / gridSize);
    const newCol = (newPos - 1) % gridSize;

    return (
        Math.abs(lastRow - newRow) <= 1 &&
        Math.abs(lastCol - newCol) <= 1 &&
        !(lastRow === newRow && lastCol === newCol)
    );
}

function handleClick(buttonId) {
    const button = document.getElementById(buttonId);
    const letter = button.innerText;
    const buttonIndex = parseInt(buttonId.split('-')[2]);

    if (buttonStates[buttonIndex]) { // Unclick
        clickedLetters.pop();
        buttonStates[buttonIndex] = false;
        button.style.backgroundColor = "white";

        if (clickedPositions.length < 2) {
            allowedDirection = null;
        }
    } else { // Click
        if (clickedPositions.length === 0 || isAdjacent(clickedPositions[clickedPositions.length - 1], buttonIndex)) {
            if (clickedPositions.length > 0 && !isMoveAllowed(buttonIndex)) {
                resetLevel();
            } else {
                clickedLetters.push(letter);
                clickedPositions.push(buttonIndex);
                buttonStates[buttonIndex] = true;
                button.style.backgroundColor = "#df4385";
            }
        } else {
            resetLevel();
        }
    }
}

function checkForWord(currentWord) {
    const currentWordToFind = wordsToFind[currentLevel];

    // If it's the last round, end the game regardless of the word's correctness
    if (currentLevel === wordsToFind.length - 1) {
        if (currentWord === currentWordToFind) {
            score++;
            document.getElementById("game-level-score").innerText = "Score: " + score;
        }
        endGame();
        return;
    }

    // For rounds before the last one
    if (currentWord === currentWordToFind) {
        alert(`You found the word: ${currentWord}!`);
        score++;
        document.getElementById("game-level-score").innerText = "Score: " + score;
    } else {
        alert("That's not the correct word. Moving to the next level.");
    }

    // Move to the next level if there are more levels remaining
    currentLevel++;
    if (currentLevel < wordsToFind.length) {
        resetBoard();
        newLevel();
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeRemaining = initialTime;

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("game-level-time").innerText = "TIME: " + timeRemaining;

        if (timeRemaining <= 0) {
            currentLevel++;
            if (currentLevel >= wordsToFind.length) {
                endGame();
            } else {
                clearInterval(timerInterval);
                alert("Time's up! Moving to the next level.");
                newLevel();
                resetBoard();   
            }
        }
    }, 1000);
}



for (let i = 1; i <= gridSize * gridSize; i++) {
    let button = document.getElementById(`grid-button-${i}`);
    button.addEventListener('click', function () {
        handleClick(`grid-button-${i}`);
    });
}

const submitButton = document.getElementById("game-submit-btn");
submitButton.addEventListener('click', function () {
    if (currentLevel >= wordsToFind.length - 1) { // If it's the last level
        checkForWord(clickedLetters.join(""));
        endGame();
    } else {
        checkForWord(clickedLetters.join(""));
        clickedLetters = [];
        clickedPositions = [];
        allowedDirection = null;
        for (let i = 1; i <= gridSize * gridSize; i++) {
            let button = document.getElementById(`grid-button-${i}`);
            button.style.backgroundColor = "white";
            buttonStates[i] = false;
        }
    }
});

// GAME FUNCTIONS PROPER

function startGame(){
    hideStartScreen()
}