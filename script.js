const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddle = {
    width: 10,
    height: 80,
    x: 10,
    y: canvas.height / 2 - 40,
    dy: 0,
    speed: 6
};

const computerPaddle = {
    width: 10,
    height: 80,
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    dy: 0,
    speed: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 6,
    dx: 5,
    dy: 5,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse tracking
let mouseY = canvas.height / 2;
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle
function updatePlayerPaddle() {
    // Arrow keys movement
    if (keys['ArrowUp'] && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (keys['ArrowDown'] && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }

    // Mouse movement
    const paddleCenter = paddle.height / 2;
    if (mouseY < paddle.y + paddleCenter) {
        if (paddle.y > 0) {
            paddle.y -= paddle.speed;
        }
    } else if (mouseY > paddle.y + paddleCenter) {
        if (paddle.y < canvas.height - paddle.height) {
            paddle.y += paddle.speed;
        }
    }

    // Keep paddle in bounds
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y > canvas.height - paddle.height) paddle.y = canvas.height - paddle.height;
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    const difficulty = 2.5; // Adjust for AI difficulty

    if (computerCenter < ball.y - 35) {
        computerPaddle.y += computerPaddle.speed * difficulty;
    } else if (computerCenter > ball.y + 35) {
        computerPaddle.y -= computerPaddle.speed * difficulty;
    }

    // Keep paddle in bounds
    if (computerPaddle.y < 0) computerPaddle.y = 0;
    if (computerPaddle.y > canvas.height - computerPaddle.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Update ball
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off top and bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Check paddle collision (player)
    if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = paddle.x + paddle.width + ball.radius;

        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - paddle.y) / paddle.height - 0.5;
        ball.dy += hitPos * 5;
    }

    // Check paddle collision (computer)
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.radius;

        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - computerPaddle.y) / computerPaddle.height - 0.5;
        ball.dy += hitPos * 5;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }

    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles and ball
    drawPaddle(paddle);
    drawPaddle(computerPaddle);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();