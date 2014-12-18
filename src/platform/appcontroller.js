var AppController = function () {

    // indexed [y][x]
    this.map = [[1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,1,1,1,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1]];

    this.player = new Character();
}

//checks if (x,y) is inside a world cell,
// includeTop determines if the y position is sitting
// exactly where the top of a cell is, whether to include
// that in the collision. This is important if you want
// to make something move left and right, you don't want
// to include the top because then the player will think his
// feet are hitting a wall, when they're just touching the ground.
// likewise, we need to register a collision for determining if 
// the player is grounded.
AppController.prototype.inCell = function(x, y, includeTop, includeLeft) {
    if (includeTop === undefined) { 
        includeTop = true;
    }
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileY = Math.floor(y);
    try {
        var occupied = this.map[tileY][tileX] === 1;



        return occupied && (includeTop || y != tileY) && (includeLeft || x != tileX);
    } catch (e) {
        return false;
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


    var blah = .3
    if (Key.isDown(Key.UP)) {
        this.player.vy = -blah;
    } else if (Key.isDown(Key.DOWN)) {
        this.player.vy = blah;
    } else {
        this.player.vy = 0;
    }

    if (Key.isDown(Key.LEFT)) {
        this.player.vx = -blah;
    } else if (Key.isDown(Key.RIGHT)) {
        this.player.vx = blah;
    } else {
        this.player.vx = 0;
    }

    //this.player.setBottom(Math.floor(6.3));

    // Collision resolution
    if (this.player.vx > 0) {
        var potX = this.player.right() + this.player.vx; //potentialX

        var wouldHitWall = this.inCell(potX, this.player.top(), false, true) || 
                        this.inCell(potX, this.player.bottom(), false, true)
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

        var wouldHitWall = this.inCell(potX, this.player.top(), false, false) || 
                        this.inCell(potX, this.player.bottom(), false, false)
        if (!wouldHitWall) {
            this.player.setLeft(potX);
        } else {
            this.player.setLeft(Math.floor(potX)+1);
            this.player.vx = 0;
        }
    }
    if (this.player.vy > 0) {
        var potY = this.player.bottom() + this.player.vy; //potentialX

        var wouldHitWall = this.inCell(this.player.left(), potY, true, false) || 
                        this.inCell(this.player.right(), potY, true, false)
        if (!wouldHitWall) {
            this.player.setBottom(potY);
        } else {
            //TODO if i'm dipped in the ground, this will cause me to scoot left!
            this.player.setBottom(Math.floor(potY));
            this.player.vy = 0;
        }
    }
    if (this.player.vy < 0) {
        var potY = this.player.top() + this.player.vy; //potentialX

        var wouldHitWall = this.inCell(this.player.left(), potY, false, false) || 
                        this.inCell(this.player.right(), potY, false, false)
        if (!wouldHitWall) {
            this.player.setTop(potY);
        } else {
            //TODO if i'm dipped in the ground, this will cause me to scoot left!
            this.player.setTop(Math.floor(potY)+1);
            this.player.vy = 0;
        }
    }

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