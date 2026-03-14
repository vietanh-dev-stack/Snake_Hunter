const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake = [{ x: 200, y: 200 }];

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

let direction = "RIGHT";

let score = 0;
let speed = 100;

const scoreDisplay = document.getElementById("score");

// âm thanh
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");

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

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // đi qua tường
    if (headX < 0) headX = 400 - box;
    if (headX >= 400) headX = 0;
    if (headY < 0) headY = 400 - box;
    if (headY >= 400) headY = 0;

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

    const newHead = {
        x: headX,
        y: headY
    };

    if (collision(newHead, snake)) {
        clearInterval(game);
        gameOverSound.play();
        alert("Game Over! Score: " + score);
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, speed);