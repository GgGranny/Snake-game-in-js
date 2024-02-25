const board = document.getElementById("game-board");
const c = board.getContext("2d");
const gameWindow = {
    boardHeight: 400,
    boardWidth: 400,
}
const unitSize = 25;

let snake = [
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
]
let intervalId = 0;
let gameStart = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX = 100;
let foodY = 100;
let count = 0;
const gameStartAudio = new Audio("sound-effects/game-start-6104.mp3");
const characterDieAudio = new Audio("sound-effects/game-over-arcade-6435.mp3");
const getFoodAudio = new Audio("sound-effects/coin-collect-retro-8-bit-sound-effect-145251.mp3");
const scoreAudio = new Audio("sound-effects/cute-character-wee-1-188162.mp3");
window.onload = () => {
    board.width = gameWindow.boardWidth;
    board.height = gameWindow.boardHeight;
}
document.addEventListener("keydown", event => restart(event));
document.addEventListener("keydown", changeSnakeDirection);
startTheGame();


function restart(e) {
    if (gameStart === false && e.keyCode === 32) {
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            { x: unitSize * 3, y: 0 },
            { x: unitSize * 2, y: 0 },
            { x: unitSize, y: 0 },
            { x: 0, y: 0 }
        ];
        gameStart = true;
        count = 0;
        foodX = 100;
        foodY = 100;
        startTheGame();

    } else {
        return;
    }
}
function startTheGame() {
    gameStart = true;
    if (gameStart === true) {
        gameStartAudio.play();
        intervalId = setInterval(() => {
            clearBody();
            drawSnake();
            moveSnake();
            chackGameStatus();
            drawFood();
            drawScore();
            gameOver();
            gameOverMasg();
        }, 100);

    }
}
function drawScore() {
    c.textAlign = "center";
    c.font = "20px Arial";
    c.fillText(`Score: ${count}`, 50, 25);
    if (count % 10 == 0) {
        if (count > 0) {
            scoreAudio.play();
        }
    }
}
function drawSnake() {
    c.fillStyle = "blue";
    c.strokeStyle = "orange";
    snake.forEach(snakePart => {
        c.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        c.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function clearBody() {
    c.fillStyle = "lightblue";
    c.fillRect(0, 0, gameWindow.boardWidth, gameWindow.boardHeight);
}
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);
    if (snake[0].x == foodX && snake[0].y == foodY) {
        getFoodAudio.play();
        count += 1;
        makeFood(0, gameWindow.boardWidth - unitSize);
        drawFood();
    } else {
        snake.pop();
    }

}
function chackGameStatus() {
    if (snake[0].x > 380 || snake[0].x < 0 || snake[0].y > 380 || snake[0].y < 0) {
        clearInterval(intervalId);
        gameStart = false;
        gameOverMasg();
        return;
    }
    return;

}
function makeFood(min, max) {
    foodX = Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    foodY = Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    console.log(foodX, foodY);
}
function drawFood() {
    c.beginPath();
    c.fillStyle = "red";
    c.fillRect(foodX, foodY, unitSize, unitSize);
}
function changeSnakeDirection(event) {
    const keyCode = event.keyCode;
    const keyCodeForUp = 38;
    const keyCodeForDown = 40;
    const keyCodeForLeft = 37;
    const keyCodeForRight = 39;


    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);
    const goingRight = (xVelocity == unitSize);

    switch (true) {
        case (keyCode === keyCodeForUp && !goingDown):
            yVelocity = -unitSize;
            xVelocity = 0;
            break;
        case (keyCode === keyCodeForDown && !goingUp):
            yVelocity = unitSize;
            xVelocity = 0;
            break;
        case (keyCode === keyCodeForLeft && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyCode === keyCodeForRight && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
    }
}

function gameOver() {
    for (i = 1; i <= snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameStart = false;
            clearInterval(intervalId);
            break;
        } else {
            continue;
        }

    }
    return;

}
function gameOverMasg() {
    if (gameStart === false) {
        characterDieAudio.play();
        c.font = " 20px Arial";
        c.fontSize = 100;
        c.fillStyle = "red";
        c.textAlign = "center";
        c.fillText("GAME OVER : (", gameWindow.boardWidth / 2, gameWindow.boardHeight / 2);
        guideToRestart();
    }
    return;
}
function guideToRestart() {
    c.fillStyle = "white";
    c.fillText("Space To Try Again", gameWindow.boardWidth / 2, gameWindow.boardHeight - 150);
}