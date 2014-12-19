var Physics = {
    // will bounce head on ceiling if true, otherwise will 
    // slide on ceiling until y velocity is depleted
    headBounce: false,

    //can hold jump to repeatedly jump
    autoJump: false, 
};

/* moves player along isHorizontal axis by accel, and caps his speed at capSpeed
   player users decBtn and incBtn to decrease/increase position on isHorizontal axis */
Physics._move = function (isHorizontal, player, decBtn, incBtn, capSpeed, accel) {
    var decPress = Key.isDown(decBtn);
    var incPress = Key.isDown(incBtn);

    // getters and setters for X/Y velocity
    var get = function () {
        return (isHorizontal ? player.vx : player.vy);
    }

    var set = function (val) {
        if (isHorizontal) {
            player.vx = val;
        } else {
            player.vy = val;
        }
    }

    if (!decPress && !incPress || decPress && incPress) {
        // use x accel as friction, these if statements are to prevent
        // oscillation
        if (get() > accel) {
            set(get() - accel);
        } else if (get() < -accel) {
            set(get() + accel);
        } else {
            set(0);
        }
    } else if (decPress) {
        if (get() > -capSpeed) {
            set(get() - accel);
            set(Math.max(get(), -capSpeed)) //cap
        }
    } else if (incPress) {
        if (get() < capSpeed) {
            set(get() + accel);
            set(Math.min(get(), capSpeed)) //cap
        }
    }
}

/* moves player along horizontal axis by accel, and caps his speed at capSpeed
   player users leftBtn and rightBtn to decrease/increase position on horizontal axis */
Physics.moveLeftRight = function (player, leftBtn, rightBtn, capSpeed, accel) {
    this._move(true, player, leftBtn, rightBtn, capSpeed, accel);
}

/* moves player along vertical axis by accel, and caps his speed at capSpeed
   player users upBtn and downBtn to decrease/increase position on vertical axis */
Physics.moveUpDown = function (player, upBtn, downBtn, capSpeed, accel) {
    this._move(false, player, upBtn, downBtn, capSpeed, accel);
}

// applies gravity to players y velocity, and if the player presses jumpBtn, he
// will jump with jump power.
Physics.applyGravityAndJump = function (player, jumpBtn, gravity, jumpPower) {

    if (Physics.prevJumpBtn === undefined || this.autoJump) {
        Physics.prevJumpBtn = false;
    }

    if(!player.touchBottom) {
        player.vy += gravity;
        player.vy = Math.min(player.vy, 1); //max out at tile size
    } else {
        if (!Physics.prevJumpBtn && Key.isDown(jumpBtn)) {
            player.vy = -jumpPower;
        }
    }

    Physics.prevJumpBtn = Key.isDown(jumpBtn);
}

// checks if a coordinate has an occupied cell in the walls map
Physics.isWall = function(walls, cellX,cellY) {
    try {
        return walls[cellY][cellX] === 1;
    } catch (e) {
        return false;
    }
}

// Checks if a point (x,y) is inside a cell, ignoring the entire perimeter
Physics.inCellNoEdges = function(walls, x, y) {
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileY = Math.floor(y);

    var occupied = this.isWall(walls, tileX, tileY);

    return occupied && inTileX !== 0 && inTileY !== 0;
}

// This tells if a point (x,y) is inside a cell, ignoring the top
// and bottom edges of the cell
Physics.inCellTrimTopBottom = function(walls, x, y) {
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileX2 = Math.floor(x)-1;
    var tileY = Math.floor(y);

    // if x is at exactly n, we need to check the right edge of
    // block with x=n-1 and the left edge of block with x=n

    var occupied = this.isWall(walls, tileX, tileY);
    var occupied2 = this.isWall(walls, tileX2, tileY);

    // the inTileY !== 0 part is what actually trims off the top and the bottom
    // the rest is so that it doesn't register collisions there, the only problem
    // is that if two tiles exist vertically, it wont register a collision directly
    // between them. So for example, if the player is 1 tile unit wide, and he's aligned
    // precisely, he'll slide through the floor. A workaround is to add a third collision point
    // to the player in his middle bottom.
    if (inTileX === 0) {
        return (occupied || occupied2) && inTileY !== 0;
    } else {
        return occupied && inTileY !== 0;
    }
}

// This tells if a point (x,y) is inside a cell, 
// ignoring the left and right edges of the cell
Physics.inCellTrimLeftRight = function(walls, x, y) {
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileY = Math.floor(y);
    var tileY2 = Math.floor(y)-1;

    var occupied = this.isWall(walls, tileX, tileY);
    var occupied2 = this.isWall(walls, tileX, tileY2);

    if (inTileY === 0) {
        return (occupied || occupied2) && inTileX !== 0 ;
    } else {
        return occupied && inTileX !== 0;
    }
}

//current assumptions:
// player is moving slower than a tile per frame
// player is smaller than a tile, otherwise additional checks are needed
// if player is exactly a tile, he will slide in between the gaps in tiles
// due to the way the trim methods work
// note if the player width/height is exactly a multiple of the tile size
// he'll be able to slide in between tiles because the collisoin checks
// will be happening right at the edges of tiles.
// a possible way to fix this is to set more collision points half way through the 
// player for the middles.


// returns the furthest right x position allowed, assuming
// that the current x position is inside a tile.
// right now this assumes that there is NOT another tile to the left
// this function mostly exists because it might get more complex
// in the future. You can also use this for the furthest down in the y direction
Physics.farthestRight = function (x) {
    return Math.floor(x);
}

Physics.farthestLeft = function (x) {
    return Math.floor(x)+1;
}

Physics.step = function (player, walls) {
    if (player.vx > 0) {
        var potX = player.right() + player.vx; //potentialX

        var wouldHitWall = this.inCellNoEdges(walls, potX, player.top()) || 
                        this.inCellNoEdges(walls, potX, player.bottom())
        if (!wouldHitWall) {
            player.setRight(potX);
        } else {
            //TODO if i'm dipped in the ground, this will cause me to scoot left!
            player.setRight(this.farthestRight(potX));
            player.vx = 0;
        }
    }
    if (player.vx < 0) {
        var potX = player.left() + player.vx; //potentialX

        var wouldHitWall = this.inCellNoEdges(walls, potX, player.top()) || 
                        this.inCellNoEdges(walls, potX, player.bottom())
        if (!wouldHitWall) {
            player.setLeft(potX);
        } else {
            player.setLeft(this.farthestLeft(potX));
            player.vx = 0;
        }
    }
    if (player.vy > 0) {
        var potY = player.bottom() + player.vy; //potentialX


        var wouldHitWall = this.inCellNoEdges(walls, player.left(), potY) || 
                        this.inCellNoEdges(walls, player.right(), potY)

        if (!wouldHitWall) {
            player.setBottom(potY);
        } else {
            player.setBottom(this.farthestRight(potY));
            player.vy = 0;
        }
    }
    if (player.vy < 0) {
        var potY = player.top() + player.vy; //potentialX

        var wouldHitWall = this.inCellNoEdges(walls, player.left(), potY) || 
                        this.inCellNoEdges(walls, player.right(), potY)

        if (!wouldHitWall) {
            player.setTop(potY);
        } else {
            player.setTop(this.farthestLeft(potY));
            if (this.headBounce) {
                player.vy = 0;
            }
        }
    }
    
    


    player.touchLeft = this.inCellTrimTopBottom(walls, player.left(), player.top()) || 
                this.inCellTrimTopBottom(walls, player.left(), player.bottom())

    player.touchRight = this.inCellTrimTopBottom(walls, player.right(), player.top()) || 
                this.inCellTrimTopBottom(walls, player.right(), player.bottom())

    player.touchTop = this.inCellTrimLeftRight(walls, player.left(), player.top()) || 
                this.inCellTrimLeftRight(walls, player.right(), player.top())

    player.touchBottom = this.inCellTrimLeftRight(walls, player.left(), player.bottom()) || 
                this.inCellTrimLeftRight(walls, player.right(), player.bottom())
}