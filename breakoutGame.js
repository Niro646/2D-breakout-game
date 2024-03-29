const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d"); //targets the element's context - the thing onto which the drawing will be rendered
let x = canvas.width / 2; // staring position of ball on x axis
let y = canvas.height - 30; // staring position of ball on y axis
let dx = 2; // movement of ball on x axis each frame
let dy = -2; // movement of ball on y axis each frame
const ballRadius = 10; // radius of ball
const paddleHeight = 10; // height of paddle
const paddleWidth = 75; // width of paddle
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3; // number of rows of bricks
const brickColumnCount = 5; // number of columns of bricks
const brickWidth = 75; // width of brick
const brickHeight = 20; // height of brick
const brickPadding = 10; // padding between bricks
const brickOffsetTop = 30; // top point from which it will start drawing bricks
const brickOffsetLeft = 30; // left point from which it will start drawing bricks
let score = 0;
let lives = 3;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawball() {
  //this function draws the ball
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  // this function draws the paddle
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // cleans the area of whole canvas
  drawBricks();
  drawball(); // calling function that draws the ball
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius) {
    // (0,0) is at top left, so if x + dx > canvas.width - ballRadius that means we reached right border
    // (0,0) is at top left, so if x + dx < 0 + ballRadius that means we reached left border
    dx = -dx;
  }

  x = x + dx; // לבדוק
  y = y + dy; // לבדוק

  if (y + dy < 0 + ballRadius) {
    // (0,0) is at top left, so if y+dy < 0 + ballRadius that means we reached cealing
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // (0,0) is at top left, so if y+dy > ccanvas.height - ballRadius that means we reached floor
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      console.log("Game Over");
      lives = lives - 1;
      if (!lives) {
        alert("Game Over"); // showing an alert message "game over" state upon the ball colliding with the bottom edge of the canvas.
        document.location.reload(); // restarting the game by reloading the document
      } else {
        console.log("Restarting game...");
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft; // basiclly the x value from the viewport minus the distance between the left edge of the canvas and the left edge of viewport
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  // checks if ball hits bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy; // changing direction of ball after hit
          b.status = 0; // changing status of brick to 0, meaning it's been hit
          score = score + 1; // increase number of points by one
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

draw();
