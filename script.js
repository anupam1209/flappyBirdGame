// Elements
const gameArea = document.getElementById("gameArea");
const goku = document.getElementById("goku");
const scoreDisplay = document.getElementById("score");

// Create start message element
const startMessage = document.createElement("div");
startMessage.classList.add("start-message");
startMessage.innerHTML = "Press space bar or tap to start the game";
gameArea.appendChild(startMessage);

let gokuTop = gameArea.offsetHeight / 3; // Goku starts 1/3rd from the top
let gravity = 0.25; // Reduced gravity so Goku falls more slowly
let lift = -7; // Slightly reduced lift for better control
let velocity = 0;
let gameSpeed = 3; // Initial Pipe speed (this will increase)
let pipeGap = 200; // Gap between top and bottom pipes
let pipes = [];
let pipeInterval;
let score = 0;
let isGameOver = false;
let speedIncreaseInterval = 5; // Increase speed every 5 points
let isGameStarted = false; // Flag to check if the game has started

goku.style.top = gokuTop + "px";

document.addEventListener("keydown", fly);
document.addEventListener("touchstart", fly);

function fly() {
  if (!isGameStarted) {
    isGameStarted = true;
    startGame();
    
    // Hide start message when game starts
    startMessage.style.display = "none";
  }
  velocity = lift; // Move Goku up when space is pressed
}

function createPipes() {
  const pipeTop = document.createElement("div");
  const pipeBottom = document.createElement("div");
  const pipeHeight = Math.floor(
    Math.random() * (gameArea.offsetHeight - pipeGap)
  );

  pipeTop.classList.add("pipe");
  pipeBottom.classList.add("pipe");

  pipeTop.style.height = pipeHeight + "px";
  pipeTop.style.top = "0";
  pipeTop.style.left = gameArea.offsetWidth + "px";

  pipeBottom.style.height = gameArea.offsetHeight - pipeHeight - pipeGap + "px";
  pipeBottom.style.bottom = "0";
  pipeBottom.style.left = gameArea.offsetWidth + "px";

  gameArea.appendChild(pipeTop);
  gameArea.appendChild(pipeBottom);

  pipes.push({ top: pipeTop, bottom: pipeBottom });
}

function gameLoop() {
  if (isGameStarted) {
    // Gravity and movement for Goku
    velocity += gravity;
    gokuTop += velocity;
    goku.style.top = gokuTop + "px";

    // Get Goku's actual dimensions for more accurate collision detection
    const gokuRect = goku.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Prevent Goku from going out of bounds
    if (gokuTop < 0) {
      // Only handle ceiling collision here
      endGame();
    }
    
    // Handle floor collision more accurately
    if (gokuRect.bottom >= gameAreaRect.bottom) {
      endGame();
    }

    // Move pipes and check for collisions
    pipes.forEach((pipe, index) => {
      let pipeLeft = parseInt(pipe.top.style.left) - gameSpeed;

      // Remove pipes that move off the screen
      if (pipeLeft < -60) {
        pipe.top.remove();
        pipe.bottom.remove();
        pipes.splice(index, 1);
        score++; // Increment score when pipes pass by
        scoreDisplay.innerText = `${score}`;

        // Increase game speed as score increases
        if (score % speedIncreaseInterval === 0) {
          gameSpeed += 0.5; // Increment speed by 0.5 for every multiple of the interval
        }
      } else {
        pipe.top.style.left = pipeLeft + "px";
        pipe.bottom.style.left = pipeLeft + "px";

        // Collision detection
        let pipeTopRect = pipe.top.getBoundingClientRect();
        let pipeBottomRect = pipe.bottom.getBoundingClientRect();

        // More accurate collision detection with a small buffer (5px) for better gameplay
        if (
          gokuRect.right > pipeTopRect.left + 5 &&
          gokuRect.left < pipeTopRect.right - 5
        ) {
          if (
            gokuRect.top < pipeTopRect.bottom - 5 ||
            gokuRect.bottom > pipeBottomRect.top + 5
          ) {
            endGame();
          }
        }
      }
    });
  }

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  setTimeout(() => {
    pipeInterval = setInterval(createPipes, 2000); // New pipe every 2 seconds
  }, 3000); // Delay pipe generation for 3 seconds

  requestAnimationFrame(gameLoop);
}

function endGame() {
  isGameOver = true;
  clearInterval(pipeInterval);
  alert(`Game Over! Your score is: ${score}`);
  location.reload(); // Reload the game on game over
}

// Start the game loop without starting the game
requestAnimationFrame(gameLoop);
