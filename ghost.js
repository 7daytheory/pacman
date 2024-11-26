class Ghost {
    constructor(x,
        y,
        width,
        height,
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range
    ) {
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * randomTargetForGhosts.length);

        setInterval(() => {
            this.changeRandomDirection()
        }, 1000)
    }

    changeRandomDirection() {
        this.randomTargetIndex += 1;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() {
        if(this.isInRangeOfPacman()) {
            target = pacman;
        } else {
            this.target = randomTargetForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
            if(this.checkCollision()) {
                this.moveBackwards();
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

    isInRangeOfPacman() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());

        if(Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range) {
            return true;
        }

        return false;
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize),
        )

        this.moveForwards();

        if(this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateNewDirection() {
        let mp = [];

        for(let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: [],
        }]

        while(queue.length > 0) {
            let poped = queue.shift();
            if(poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighbourList = this.addNeighbours(poped, mp);
            }
        }
    }

    //Calculate neighbouring cells for ghost to move to next
    addNeighbours(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length

        if(
            poped.x - 1 >= 0 &&
            poped.y - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(DIRECTION_LEFT)
            queue.push({x: poped.x - 1, y: poped.x, moves: tempMoves})
        }

        if(
            poped.x + 1 >= 0 &&
            poped.y + 1 < numOfRows && 
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(DIRECTION_RIGHT)
            queue.push({x: poped.x + 1, y: poped.x, moves: tempMoves})
        }

        if(
            poped.x - 1 >= 0 &&
            poped.y - 1 < numOfRows &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(DIRECTION_UP)
            queue.push({x: poped.x, y: poped.x + 1, moves: tempMoves})
        }

        if(
            poped.x + 1 >= 0 &&
            poped.y + 1 < numOfRows &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice()
            tempMoves.push(DIRECTION_BOTTOM)
            queue.push({x: poped.x, y: poped.x - 1, moves: tempMoves})
        }

        return queue;
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1; //Set Animation for Pacman object
    }

    //Unlike Pacman - no rotation or tralsnation is applied - just place them on canvas
    draw() {
        canvasContext.save()
        canvasContext.drawImage(
            ghostFrames, //get images from spritesheet (ghost.png)
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageWidth,
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