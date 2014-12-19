var Physics = {};

Physics.moveLeftRight = function (player, leftBtn, rightBtn) {
    var left = Key.isDown(leftBtn);
    var right = Key.isDown(rightBtn);

    if (!left && !right || left && right) {

        // use x accel as friction, these if statements are to prevent
        // oscillation
        if (player.vx > PLAYER_XACCEL) {
            player.vx -= PLAYER_XACCEL;
        } else if (player.vx < -PLAYER_XACCEL) {
            player.vx += PLAYER_XACCEL;
        } else {
            player.vx = 0;
        }
    } else if (left) {
        if (player.vx > -PLAYER_CAP_XVEL) {
            player.vx -= PLAYER_XACCEL;
            player.vx = Math.max(player.vx, -PLAYER_CAP_XVEL) //cap
        }
    } else if (right) {
        if (player.vx < PLAYER_CAP_XVEL) {
            player.vx += PLAYER_XACCEL;
            player.vx = Math.min(player.vx, PLAYER_CAP_XVEL) //cap
        }
    }
}

Physics.moveUpDown = function (player, upBtn, downBtn) {
    var up = Key.isDown(upBtn);
    var down = Key.isDown(downBtn);

    if (!up && !down || up && down) {

        // use x accel as friction, these if statements are to prevent
        // oscillation
        if (player.vy > PLAYER_YACCEL) {
            player.vy -= PLAYER_YACCEL;
        } else if (player.vy < -PLAYER_YACCEL) {
            player.vy += PLAYER_YACCEL;
        } else {
            player.vy = 0;
        }
    } else if (up) {
        if (player.vy > -PLAYER_CAP_YVEL) {
            player.vy -= PLAYER_YACCEL;
            player.vy = Math.max(player.vy, -PLAYER_CAP_YVEL) //cap
        }
    } else if (down) {
        if (player.vy < PLAYER_CAP_YVEL) {
            player.vy += PLAYER_YACCEL;
            player.vy = Math.min(player.vy, PLAYER_CAP_YVEL) //cap
        }
    }
}

Physics.applyGravityAndJump = function (player, jumpBtn) {

    if (Physics.prevJumpBtn === undefined) {
        Physics.prevJumpBtn = false;
    }

    if(!player.touchBottom) {
        player.vy += PLAYER_YACCEL;
        player.vy = Math.min(player.vy, PLAYER_CAP_YVEL);
    } else {
        if (!Physics.prevJumpBtn && Key.isDown(jumpBtn)) {
            player.vy = -PLAYER_JUMP;
        }
    }

    Physics.prevJumpBtn = Key.isDown(jumpBtn);
}


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
// and bottom edges
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
    // the rest is so that 
    if (inTileX === 0) {
        return (occupied || occupied2) && inTileY !== 0;
    } else {
        return occupied && inTileY !== 0;
    }
}

// This tells if a point (x,y) is inside a cell, ignoring the left and right edges
Physics.inCellTrimLeftRight = function(walls, x, y) {
    var inTileX = x % 1;
    var inTileY = y % 1;
    var tileX = Math.floor(x);
    var tileY = Math.floor(y);
    var tileY2 = Math.floor(y)-1;

    // if y is at exactly n, we need to check the bottom edge of
    // block with x=n-1 and the top edge of block with x=n

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

Physics.step = function (walls, player) {
    if (player.vx > 0) {
        var potX = player.right() + player.vx; //potentialX

        var wouldHitWall = this.inCellNoEdges(walls, potX, player.top()) || 
                        this.inCellNoEdges(walls, potX, player.bottom())
        if (!wouldHitWall) {
            player.setRight(potX);
        } else {
            //TODO if i'm dipped in the ground, this will cause me to scoot left!
            player.setRight(Math.floor(potX));
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
            player.setLeft(Math.floor(potX)+1);
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
            player.setBottom(Math.floor(potY));
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
            player.setTop(Math.floor(potY)+1);
            if (PLAYER_HEAD_BUMP_BOUNCE) {
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