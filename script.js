"use strict";

// Color constants. Change for personal preferences
var colorFood = "green";
var colorBody = "blue";
var colorHead = "red";
var colorOutline = "white";

// Initial snake states
var moveDirection = {
    Stop: 0,
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4
};
var startingSnakeLength = 10;
var snakeCellWidth = 10;
var snakeMovingSpeed = 10;
var startPos = 30;

// Get canvas info
var gameCanvas = $("#gameboard")[0];
var boardContext = gameCanvas.getContext("2d");
boardContext.translate(0.5, 0.5);
var gameCanvasWidth = $("#gameboard").width();
var gameCanvasHeight = $("#gameboard").height();
var borderWidthUnit = gameCanvasWidth / snakeCellWidth
var borderHeightunit = gameCanvasHeight / snakeCellWidth
var gameTimerID;

// Snake variables
var snakeArray = [];
var snakeHead = { x:0, y:0 };
var snakeTail = { x:0, y:0 };
var currentDirection = moveDirection.Stop;
var foodPos = { x:0, y:0 };

// Creates an array of coordinates of where the snake will be respawned and draw each cell.
var createSnakeArray = function() {
	snakeArray = [];
	for (var i = 0; i < startingSnakeLength; i++) {
		snakeArray.push({ x:startPos-i, y:startPos });	
		drawCell(snakeArray[i].x, snakeArray[i].y, colorBody);	
	}
}

// Takes in x & y coordinates and fills that area (the area defined by snakeCellWidth) with the given color.
var drawCell = function(x, y, color) {
	boardContext.fillStyle = color;
	boardContext.fillRect(x * snakeCellWidth, y * snakeCellWidth, snakeCellWidth, snakeCellWidth);
	boardContext.strokeStyle = colorOutline;
	boardContext.strokeRect(x * snakeCellWidth, y * snakeCellWidth, snakeCellWidth, snakeCellWidth);
}

// Detects which arrow key was pressed and changes the snake's current direction accordingly.
var detectArrowKeyInput = function() {
	document.onkeydown = function(e) {
	    switch (e.keyCode) {
	        case 37: // Left arrow
	        	if (currentDirection !== moveDirection.Right && currentDirection !== moveDirection.Stop) {
	        		currentDirection = moveDirection.Left;
     			}
	            break;
	        case 38: // Up arrow
	        	if (currentDirection !== moveDirection.Down) {
	        		currentDirection = moveDirection.Up;
    			}
	            break;
	        case 39: // Right arrow
	        	if (currentDirection !== moveDirection.Left) {
	        		currentDirection = moveDirection.Right;
    			}
	            break;
	        case 40: // Down arrow
	        	if (currentDirection !== moveDirection.Up) {
	        		currentDirection = moveDirection.Down;
    			}
	            break;
	    }
	}
}

// Generates a food drop location inside of the canvas randomly
var dropFoodAtRandom = function() {
	var foodXPos = Math.floor((Math.random() * gameCanvasWidth / 10));
	var foodYPos = Math.floor((Math.random() * gameCanvasHeight / 10));
	foodPos = { x:foodXPos, y:foodYPos };
}

// Moves the snake according to the current direction by 
// clearing the tail cell and drawing a new head cell in front of the current head cell 
var moveSnake = function() {		
	if (currentDirection !== moveDirection.Stop) {
		snakeTail = snakeArray.pop();
		boardContext.clearRect(snakeTail.x * snakeCellWidth, snakeTail.y * snakeCellWidth, snakeCellWidth, snakeCellWidth);
		if (currentDirection == moveDirection.Right) {
			snakeHead = { x:snakeArray[0].x + 1, y:snakeArray[0].y };
		}
		
		else if (currentDirection == moveDirection.Left) {
			snakeHead = { x:snakeArray[0].x - 1, y:snakeArray[0].y };
		}
		
		else if (currentDirection == moveDirection.Up) {
			snakeHead = { x:snakeArray[0].x, y:snakeArray[0].y - 1 };
		}
		
		else if (currentDirection == moveDirection.Down) {
			snakeHead = { x:snakeArray[0].x, y:snakeArray[0].y + 1 };
		}
		snakeArray.unshift(snakeHead);
	}
	drawCell(snakeArray[0].x, snakeArray[0].y,  colorHead);
	drawCell(snakeArray[1].x, snakeArray[1].y,  colorBody);
	drawCell(foodPos.x , foodPos.y,  colorFood);
}

// Detects if the snake's head collided with the food and grows a tail if it did.
var detectCollisionWithFood = function() {
	if (snakeHead.x == foodPos.x && snakeHead.y == foodPos.y) {
		dropFoodAtRandom();
		var newSnakeTail = { x:0, y:0 };
		var snakeTailPos = snakeArray[snakeArray.length - 1];
		switch (currentDirection) {
		    case moveDirection.Right:
		    	newSnakeTail = { x:snakeTailPos.x - 1, y:snakeTailPos.y };
		    	break; 
		    case moveDirection.Left:
		    	newSnakeTail = { x:snakeTailPos.x + 1, y:snakeTailPos.y };
		    	break; 
		    case moveDirection.Up:
		    	newSnakeTail = { x:snakeTailPos.x, y:snakeTailPos.y + 1 };
		        break; 
		    case moveDirection.Down:
		    	newSnakeTail = { x:snakeTailPos.x, y:snakeTailPos.y - 1 };
		    	break; 
		}
		snakeArray.push(newSnakeTail);
	}
}

// Detects if snake's head is colliding with or outside of canvas border and
// ends the game if so.
var detectCollisionWithBorder = function () {
	if ((snakeHead.x >= borderWidthUnit || snakeHead.x <= -1) || (snakeHead.y >= borderHeightunit || snakeHead.y <= -1)) {
		endGameReset();
	}
}

// Detects if snake's head is colliding with its own body and
// ends the game if so.
var detectCollisionWithBody = function() {
	for (var y = 1; y < snakeArray.length; y++){
		if (snakeHead.x == snakeArray[y].x && snakeHead.y == snakeArray[y].y) {
			endGameReset();
		}
	}
}

// Ends the game and re-initializes the snake's states
var endGameReset = function() {
	snakeHead = { x:0, y:0 };
	clearInterval(gameTimerID);
	currentDirection = moveDirection.Stop;
	alert("you lost");
	boardContext.clearRect(0, 0, gameCanvasWidth, gameCanvasHeight); // clears the canvas
	gameLoop();
}

var start = function() {
	createSnakeArray();
	dropFoodAtRandom();
	detectArrowKeyInput();
}

var update = function() {
	moveSnake();
	detectCollisionWithBorder();
	detectCollisionWithBody();
	detectCollisionWithFood();
}

var gameLoop = function() {
	start();
	gameTimerID = setInterval(update, 1000 / snakeMovingSpeed);
}

$(document).ready(function() {
		gameLoop();
	}
);
