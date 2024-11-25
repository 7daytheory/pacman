class Pacman {
    constructor(x,y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.nextDirection = this.direction
        this.currentFrame = 1;
        this.frameCount = 7;

        // Pacman sound setup
        this.movementSound = new Audio('assets/sounds/pacman-sound.mp3');
        this.movementSound.loop = true; // Enable looping

        //this.movementSound.play(); *** Temporary turn off while working on project

        setInterval(() => {
            this.changeAnimation();
        }, 100)
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
            if(this.checkCollision()) {
                this.moveBackwards();
            }
    }

    eat() {
        for(let i = 0; i < map.length; i++) {
            console.log(i);
            for(let j = 0; j < map[0].length; j++) {
            console.log(map[0]);
            if(
                map[i][j] == 2 &&
                this.getMapX() == j &&
                this.getMapY() == i
            ) {
                console.log(map[i][j]);
                map[i][j] = 3;
                score++;
            }
            }
        }
    }

    moveBackwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed; // Reverse current movement
                break;
            case DIRECTION_LEFT:
                this.x += this.speed; // Reverse current movement
                break;
            case DIRECTION_UP:
                this.y += this.speed; // Reverse current movement
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed; // Reverse current movement
                break;
        }
    }

    moveForwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed; // Move right by increasing x
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed; // Move left by decreasing x
                break;
            case DIRECTION_UP:
                this.y -= this.speed; // Move up by decreasing y
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed; // Move down by increasing y
                break;
        }
    }

    checkCollision() {
        let isCollided = false;

        if(
        map[this.getMapY()][this.getMapX()] == 1 
        || map[this.getMapYRightSide()][this.getMapX()] == 1
        || map[this.getMapY()][this.getMapXRightSide()] == 1
        || map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true;
        } else {
            return false;
        }

    }

    checkGhostCollission() {

    }

    changeDirectionIfPossible() {
        if(this.direction == this.nextDirection) return; // If new direction and next direction are same do nothing

        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1; //Set Animation for Pacman object
    }

    draw() {
        canvasContext.save()
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2,
        );

        canvasContext.rotate((this.direction * 90 * Math.PI) / 180)

        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2,
        )

        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height,
        )

        canvasContext.restore();
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize)
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize)
    }

    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize)
    }

    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize)
    }
}