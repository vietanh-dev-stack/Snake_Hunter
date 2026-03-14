const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let direction;
let food;

let score = 0;
let speed = 100;
let game;

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highscore");

// high score
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreDisplay.innerText = highScore;

// âm thanh
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");

function initGame() {

    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";

    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };

}

initGame();

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";

}

function collision(head, body) {

    for (let i = 0; i < body.length; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            return true;
        }
    }

    return false;

}

function draw() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    // vẽ rắn
    for (let i = 0; i < snake.length; i++) {

        ctx.fillStyle = i === 0 ? "#00ffcc" : "#00aa55";

        ctx.fillRect(
            snake[i].x,
            snake[i].y,
            box - 2,
            box - 2
        );

    }

    // vẽ thức ăn
    ctx.beginPath();
    ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // đi xuyên tường
    if (headX < 0) headX = 400 - box;
    if (headX >= 400) headX = 0;
    if (headY < 0) headY = 400 - box;
    if (headY >= 400) headY = 0;

    // ăn mồi
    if (headX === food.x && headY === food.y) {

        score++;
        scoreDisplay.innerText = score;

        eatSound.play();

        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };

        // tăng tốc
        if (speed > 40) {
            speed -= 2;
            clearInterval(game);
            game = setInterval(draw, speed);
        }

    } else {

        snake.pop();

    }

    const newHead = { x: headX, y: headY };

    // game over
    if (collision(newHead, snake)) {

        clearInterval(game);
        gameOverSound.play();

        // lưu high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreDisplay.innerText = highScore;
        }

        ctx.fillStyle = "white";
        ctx.font = "35px Arial";
        ctx.fillText("GAME OVER", 110, 200);

        return;

    }

    snake.unshift(newHead);

}

// start game
document.getElementById("startBtn").onclick = function () {

    clearInterval(game);
    game = setInterval(draw, speed);

}

// restart
function resetGame() {

    score = 0;
    speed = 100;

    scoreDisplay.innerText = score;

    initGame();

    clearInterval(game);
    game = setInterval(draw, speed);

}