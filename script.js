// Elements
const gameArea = document.getElementById("gameArea");
const goku = document.getElementById("goku");
const scoreDisplay = document.getElementById("score");

// Game Variables
let gokuTop = gameArea.offsetHeight / 3; // Goku starts 1/3rd from the top
let gravity = 0.5; // Gravity, so Goku falls slowly
let lift = -8; // How much Goku moves up when space is pressed
let velocity = 0;
let gameSpeed = 3; // Initial Pipe speed (this will increase)
let pipeGap = 200; // Gap between top and bottom pipes
let pipes = [];
let pipeInterval;
let score = 0;
let isGameOver = false;
let speedIncreaseInterval = 5; // Increase speed every 5 points

// Start Goku at a safe height
goku.style.top = gokuTop + "px";

// Event Listeners
document.addEventListener("keydown", fly);

// Function to make Goku fly
function fly() {
  velocity = lift; // Move Goku up when space is pressed
}

// Create Pipes
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

// Game Loop
function gameLoop() {
  // Gravity and movement for Goku
  velocity += gravity;
  gokuTop += velocity;
  goku.style.top = gokuTop + "px";

  // Prevent Goku from going out of bounds
  if (gokuTop < 0 || gokuTop + goku.offsetHeight >= gameArea.offsetHeight) {
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
      let gokuRect = goku.getBoundingClientRect();
      let pipeTopRect = pipe.top.getBoundingClientRect();
      let pipeBottomRect = pipe.bottom.getBoundingClientRect();

      if (
        gokuRect.right > pipeTopRect.left &&
        gokuRect.left < pipeTopRect.right
      ) {
        if (
          gokuRect.top < pipeTopRect.bottom ||
          gokuRect.bottom > pipeBottomRect.top
        ) {
          endGame();
        }
      }
    }
  });

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start Pipe Generation and Game Loop
function startGame() {
  setTimeout(() => {
    pipeInterval = setInterval(createPipes, 2000); // New pipe every 2 seconds
  }, 3000); // Delay pipe generation for 3 seconds

  requestAnimationFrame(gameLoop);
}

// End Game
function endGame() {
  isGameOver = true;
  clearInterval(pipeInterval);
  alert(`Game Over! Your score is: ${score}`);
  location.reload(); // Reload the game on game over
}

// Start the game
startGame();
