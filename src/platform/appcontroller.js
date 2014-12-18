var AppController = function () {

    // indexed [y][x]
    this.map = [[1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,1,0,0,0,0,0,0,1],
                [1,0,1,1,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1,0,0,0,1],
                [1,0,1,0,1,1,1,1,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1]];

    this.player = new Character();
}


AppController.prototype.isWall = function(cellX,cellY) {
    try {
        return this.map[cellY][cellX] === 1;
    } catch (e) {
        return false;
    }
}


AppController.prototype.inCellTrimTopBottom = function(x, y) {
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileX2 = Math.floor(x)-1;
    var tileY = Math.floor(y);

    var occupied = this.isWall(tileX, tileY);
    var occupied2 = this.isWall(tileX2, tileY);

    if (inTileX === 0) {
        return (occupied || occupied2) && inTileY !== 0 ;
    } else {
        return occupied && inTileY !== 0;
    }
}

AppController.prototype.inCellTrimLeftRight = function(x, y) {
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileY = Math.floor(y);
    var tileY2 = Math.floor(y)-1;

    var occupied = this.isWall(tileX, tileY);
    var occupied2 = this.isWall(tileX, tileY2);

    if (inTileY === 0) {
        return (occupied || occupied2) && inTileX !== 0 ;
    } else {
        return occupied && inTileX !== 0;
    }
}


AppController.prototype.update = function () {
    var left = Key.isDown(Key.LEFT);
    var right = Key.isDown(Key.RIGHT);

    if (!left && !right || left && right) {

        // use x accel as friction, these if statements are to prevent
        // oscillation
        if (this.player.vx > PLAYER_XACCEL) {
            this.player.vx -= PLAYER_XACCEL;
        } else if (this.player.vx < -PLAYER_XACCEL) {
            this.player.vx += PLAYER_XACCEL;
        } else {
            this.player.vx = 0;
        }
    } else if (Key.isDown(Key.LEFT)) {
        if (this.player.vx > -PLAYER_CAP_XVEL) {
            this.player.vx -= PLAYER_XACCEL;
            this.player.vx = Math.max(this.player.vx, -PLAYER_CAP_XVEL) //cap
        }
    } else if (Key.isDown(Key.RIGHT)) {
        if (this.player.vx < PLAYER_CAP_XVEL) {
            this.player.vx += PLAYER_XACCEL;
            this.player.vx = Math.min(this.player.vx, PLAYER_CAP_XVEL) //cap
        }
    }

    if(!this.player.touchBottom) {
        this.player.vy += PLAYER_YACCEL;
    } else {
        if (Key.isDown(Key.UP)) {
            this.player.vy = -PLAYER_JUMP;
        }
    }

    // var blah = .3
    // if (Key.isDown(Key.UP)) {
    //     this.player.vy = -blah;
    // } else if (Key.isDown(Key.DOWN)) {
    //     this.player.vy = blah;
    // } else {
    //     this.player.vy = 0;
    // }

    // if (Key.isDown(Key.LEFT)) {
    //     this.player.vx = -blah;
    // } else if (Key.isDown(Key.RIGHT)) {
    //     this.player.vx = blah;
    // } else {
    //     this.player.vx = 0;
    // }

    //this.player.setBottom(Math.floor(6.3));

    // Collision resolution
    if (this.player.vx > 0) {
        var potX = this.player.right() + this.player.vx; //potentialX

        var wouldHitWall = this.inCellTrimTopBottom(potX, this.player.top()) || 
                        this.inCellTrimTopBottom(potX, this.player.bottom())
        if (!wouldHitWall) {
            this.player.setRight(potX);
        } else {
            //TODO if i'm dipped in the ground, this will cause me to scoot left!
            this.player.setRight(Math.floor(potX));
            this.player.vx = 0;
        }
    }
    if (this.player.vx < 0) {
        var potX = this.player.left() + this.player.vx; //potentialX

        var wouldHitWall = this.inCellTrimTopBottom(potX, this.player.top()) || 
                        this.inCellTrimTopBottom(potX, this.player.bottom())
        if (!wouldHitWall) {
            this.player.setLeft(potX);
        } else {
            this.player.setLeft(Math.floor(potX)+1);
            this.player.vx = 0;
        }
    }
    if (this.player.vy > 0) {
        var potY = this.player.bottom() + this.player.vy; //potentialX

        var wouldHitWall = this.inCellTrimLeftRight(this.player.left(), potY) || 
                        this.inCellTrimLeftRight(this.player.right(), potY)
        if (!wouldHitWall) {
            this.player.setBottom(potY);
        } else {
            this.player.setBottom(Math.floor(potY));
            this.player.vy = 0;
        }
    }
    if (this.player.vy < 0) {
        var potY = this.player.top() + this.player.vy; //potentialX

        var wouldHitWall = this.inCellTrimLeftRight(this.player.left(), potY) || 
                        this.inCellTrimLeftRight(this.player.right(), potY)
        if (!wouldHitWall) {
            this.player.setTop(potY);
        } else {
            this.player.setTop(Math.floor(potY)+1);
            if (PLAYER_HEAD_BUMP_BOUNCE) {
                this.player.vy = 0;
            }
        }
    }


    this.player.touchLeft = this.inCellTrimTopBottom(this.player.left(), this.player.top()) || 
                this.inCellTrimTopBottom(this.player.left(), this.player.bottom())

    this.player.touchRight = this.inCellTrimTopBottom(this.player.right(), this.player.top()) || 
                this.inCellTrimTopBottom(this.player.right(), this.player.bottom())

    this.player.touchTop = this.inCellTrimLeftRight(this.player.left(), this.player.top()) || 
                this.inCellTrimLeftRight(this.player.right(), this.player.top())

    this.player.touchBottom = this.inCellTrimLeftRight(this.player.left(), this.player.bottom()) || 
                this.inCellTrimLeftRight(this.player.right(), this.player.bottom())

}

AppController.prototype.draw = function () {
    // Draw the background
    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,WIDTH,HEIGHT);



    // draw
    var i, j;
    for(i = 0; i < this.map.length; i++) {
        for(j = 0; j < this.map[i].length; j++) {
            if (this.map[i][j] === 1) { 
                Utils.drawRect(j*TILE, i*TILE, TILE, TILE);
            }
        }
    }

    this.player.draw();
}