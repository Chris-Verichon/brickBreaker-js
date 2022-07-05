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

const updateAll = () => {
  moveAll();
  drawAll();
}

const ballReset = () => {
  if(playerAttempts <= 0) {
    showEndingScreen = true;
  }

  ballX = canvas.width/2;
  ballY = 400;

  ballSpeedX = 0;
  ballSpeedY = 5;
}

const ballMovement = () => {
  ballX += ballSpeedX;

  //right
  if(ballX > canvas.width && ballSpeedX > 0.0) {
    ballSpeedX *= -1;
  }

  //left
  if(ballX < 0 && ballSpeedX < 0.0) {
    ballSpeedX *= -1;
  }

  ballY += ballSpeedY;

  // bottom
  if(ballY > canvas.height) {
    playerAttempts--;
    ballReset();
  }

  // top
  if(ballY < 0 && ballSpeedY < 0.0) {
    ballSpeedY *= -1;
  }
}

const isBrickAtColRow = (col, row) => {
  if(col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {
    let brickIndexUnderCoord = rowColToArrayIndex(col, row);
    return brickGrid[brickIndexUnderCoord];
  } else {
    return false;
  }
}

const ballBrickCollision = () => {
  let ballBrickCol = Math.floor(ballX / BRICK_WIDTH);
  let ballBrickRow = Math.floor(ballY / BRICK_HEIGHT);
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

  if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
    if(isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false;
      bricksLeft--; //remove brick from the amount
      console.log(bricksLeft);
      playerScore += 10;
      console.log(playerScore);

      let previousBallX = ballX - ballSpeedX;
      let previousBallY = ballY - ballSpeedY;
      let previousBrickCol =  Math.floor(previousBallX / BRICK_WIDTH);
      let previousBrickRow = Math.floor(previousBallY / BRICK_HEIGHT);

      let bothTestsFailed = true;

      if(previousBrickCol != ballBrickCol) {
        if(isBrickAtColRow(previousBrickCol, ballBrickRow) == false) {
          ballSpeedX *= -1;
          bothTestsFailed = false;
        }
      }

      if(previousBrickRow != ballBrickRow) {
        if(isBrickAtColRow(previousBrickCol, ballBrickRow) == false) {
          ballSpeedY *= -1;
          bothTestsFailed = false;
        }
      }

      if(bothTestsFailed) { //armpit case prevents the ball from going through when both corners are covered
        ballSpeedX *= -1;
        ballSpeedY *= -1;
      }
    }
  }
}

const ballPaddleCollision = () => {
  let paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_HEIGHT;
  let paddleLeftEdgeX = paddleX;
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

  if(ballY+10 > paddleTopEdgeY && //below the top of the paddle
     ballY < paddleBottomEdgeY && //above the bottom of the paddle
     ballX+10 > paddleLeftEdgeX && //right of the left side of the paddle
     ballX-10 < paddleRightEdgeX) { //left of the right side of the paddle

    ballSpeedY *= -1;

    let centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
    let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
    ballSpeedX = ballDistFromPaddleCenterX * 0.35;

    if(bricksLeft == 0) {
      //                        brickReset();
      showEndingScreen = true;
    }
  }
}

const moveAll = () => {
  if(showEndingScreen) {
    return;
  }

  ballMovement();

  ballBrickCollision();

  ballPaddleCollision();
}

const brickReset = () => {
  bricksLeft = 0;

  let i;

  for(i = 0; i < 3 * BRICK_COLS; i++) {
    brickGrid[i] = false;
  }

  for(; i < BRICK_COLS * BRICK_ROWS; i++) {
    if(Math.random() < 0.5) {
      brickGrid[i] = true;
      bricksLeft++;//counts how many bricks there are on the scene and stores the value
      maximumScore += 10;
    }else {
      brickGrid[i] = false;
    }//end of else (random check)
  }//end of for
  console.log(maximumScore);
}//end of brickReset

const rowColToArrayIndex = (col, row) => {
  return col + row * BRICK_COLS;
}

const drawBricks = () => {
  for(let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for(let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow);

      if(brickGrid[arrayIndex]) {
        rect((BRICK_WIDTH*eachCol), BRICK_HEIGHT*eachRow, BRICK_WIDTH-BRICK_GAP, BRICK_HEIGHT-BRICK_GAP, '#087c94');
      }//end of brick drawing if true
    }
  }//end of brick for
}//end of drawBricks

const drawAll = () => {
  //background
  rect(0, 0, canvas.width, canvas.height, 'black');

  if(showEndingScreen) {
    if(playerScore == maximumScore) {
      text("YOU WIN!", canvas.width/2, 100, 'white', 'bold 3em Arial', 'center');
      text("SCORE: " + playerScore, canvas.width/2, 250, 'white', 'bold 2em Arial', 'center');
      text("ATTEMPTS: " + playerAttempts, canvas.width/2, 400, 'white', 'bold 2em Arial', 'center');
      text("Click to continue", canvas.width/2, 550, 'white', 'bold 1.5em Arial', 'center');
    } else {
      text("YOU LOSE!", canvas.width/2, 100, 'white', 'bold 3em Arial', 'center');
      text("SCORE: " + playerScore, canvas.width/2, 250, 'white', 'bold 2em Arial', 'center');
      text("ATTEMPTS: " + playerAttempts, canvas.width/2, 400, 'white', 'bold 2em Arial', 'center');
      text("Click to continue", canvas.width/2, 550, 'white', 'bold 1.5em Arial', 'center');
    }
    return;
  }

  //ball
  circle(ballX, ballY, 10, 'white');

  //paddle
  rect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  //bricks
  drawBricks();

  let mouseBrickCol = Math.floor(mouseX / BRICK_WIDTH);
  let mouseBrickRow = Math.floor(mouseY / BRICK_HEIGHT);
  let brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
  text(mouseBrickCol + "," + mouseBrickRow + ":" + brickIndexUnderMouse, mouseX, mouseY, 'yellow', '12px Arial');

  text("Score: " + playerScore, 10, 30, 'white', 'bold 1.4em monospace', 'left');
  text("Attempts: " + playerAttempts, 673, 30, 'white', 'bold 1.4em monospace', 'left');
}

const rect = (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

const circle = (centerX, centerY, radius, fillColor) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

const text = (showWords, textX, textY, fillColor, fontSizeStyle, textAlignment) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.font = fontSizeStyle;
  canvasContext.textAlign = textAlignment;
  canvasContext.fillText(showWords, textX, textY);
}