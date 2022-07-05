let canvas, canvasContext;

//ball variables
let ballX = 400;
let ballSpeedX = 0;
let ballY = 530;
let ballSpeedY = 0;

//paddle variables and constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_DIST_FROM_EDGE = 60;
let paddleX = 350;

//mouse variables;
let mouseX;
let mouseY;

//bricks variables and constants
const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 20;
const BRICK_COLS = 10;
const BRICK_GAP = 2;
const BRICK_ROWS = 17;
let brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
let bricksLeft = 0;

//score variables
let maximumScore = 0;
let playerScore = 0;
let attempts = 5;
let playerAttempts = attempts;
let showEndingScreen = false;

const updateMousePosition = (evt) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - (PADDLE_WIDTH/2);

}

const handleMouseClick = (evt) => {
  if(showEndingScreen) {
    playerScore = 0;
    maximumScore = 0;
    playerAttempts = attempts;
    brickReset();
    ballReset();
    showEndingScreen = false;
  }

  if(ballSpeedX == 0 && ballSpeedY == 0) {
    ballSpeedX = 0;
    ballSpeedY = -5;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  let framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', updateMousePosition);

  brickReset();
}