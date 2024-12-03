const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y , width, height);
}

//frames per second
let fps = 30;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "#222";
let foodColor = "#FFF";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

//Pacman Direction vars
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

//Setup different ghosts based on sprite image x/y co-ords
let ghostLocations = [
    {x:0 , y:0},
    {x:176 , y:0},
    {x:0 , y:121},
    {x:176 , y: 121},
]

//21 cols - 23 rows 
//if 1 wall, if 0 not wall
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for(let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if(map[i][j] == 2) {
            foodCount++;
        }
    }
}

//Random Ghost Targets
let randomTargetForGhosts = [
    {x: 1 * oneBlockSize, y: 1 * oneBlockSize},
    {x: 1 * oneBlockSize, y: (map.length -2) * oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: 1 * oneBlockSize},
    {
        x: (map[0].length - 2) * oneBlockSize, 
        y: (map.length -2) * oneBlockSize
    },
]

let gameLoop = () => {
    draw();
    update();
}

let update = () => {
    pacman.moveProcess();
    pacman.eat();

    for(let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }

    if(pacman.checkGhostCollision()) {
        restartGame();
    }
}

let restartGame = () => {
    console.log("Pacman and Ghost Hit - Restart Game!");
    createNewPacman();
    createGhosts();
    lives--;
    if(lives == 0) {
        gameOver();
    }

    if(score >= foodCount) {
        drawWin();
    }
}

let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
}

let drawGameOver = () => {
    canvasContext.font = "40px Arial";
    canvasContext.fillStyle = "red";
    canvasContext.fillText("Game Over!", 110, 250);
}

let drawWin = () => {
    canvasContext.font = "40px Arial";
    canvasContext.fillStyle = "green";
    canvasContext.fillText("You Win!", 110, 250);
}

let drawLives = () => {
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "yellow";
    canvasContext.fillText("Lives: ", 260, oneBlockSize * (map.length + 1) + 8)

    for(let i = 0;i < lives;i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            320 + i * oneBlockSize,
            oneBlockSize * map.length + 10,
            oneBlockSize,
            oneBlockSize
        )
    }
}

let drawFoods = () => {
    // Loop through each row of the grid/map
    for (let i = 0; i < map.length; i++) {
        // Loop through each column in the current row
        for(let j = 0; j < map[0].length; j++ ) {
            // Check if the current cell in the map contains a food item (represented as 2)
            if(map[i][j] == 2) {
                // If there's food - call createReact draw a small rectangle
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,  // Calculate x-coordinate for food, offset to center in cell
                    i * oneBlockSize + oneBlockSize / 3,  // Calculate y-coordinate for food, offset to center in cell
                    oneBlockSize / 3,                     // Width of the food rectangle
                    oneBlockSize / 3,                     // Height of the food rectangle
                    foodColor
                );
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#FFF"
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length +1) + 10
    )
}

let drawGhosts = () => {
    for(let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
}

let draw = () => {
    createRect(0,0, canvas.width, canvas.height, "black")
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
}

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) { // It's a wall
                // Draw the main wall block
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor // Main wall color
                );
                
                // Draw connecting walls to the left
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                // Draw connecting walls to the right
                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                // Draw connecting walls below
                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                // Draw connecting walls above
                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

//Create new pacman(start or death)
let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5,
    )
}

let createGhosts = () => {
    ghosts = []
    for(let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i,
        );
        ghosts.push(newGhost);
    }
}

createNewPacman();
createGhosts();
gameLoop();

// Setup key codes to move pacman on keydown
window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
            pacman.nextDirection = DIRECTION_LEFT;
            break;
        case "ArrowDown":
        case "KeyS":
            pacman.nextDirection = DIRECTION_BOTTOM;
            break;
        case "ArrowRight":
        case "KeyD":
            pacman.nextDirection = DIRECTION_RIGHT;
            break;
        case "ArrowUp":
        case "KeyW":
            pacman.nextDirection = DIRECTION_UP;
            break;
    }
});