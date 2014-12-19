var AppController = function () {

    // indexed [y][x]
    this.map = [[1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1,0,0,0,1],
                [1,0,1,0,1,1,1,1,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1]];

    this.player = new Character();
    Physics.headBounce = PLAYER_HEAD_BUMP_BOUNCE;
}

AppController.prototype.update = function () {
    Physics.moveLeftRight(this.player, Key.LEFT, Key.RIGHT, PLAYER_CAP_XVEL, PLAYER_XACCEL);
    Physics.applyGravityAndJump(this.player, Key.UP, PLAYER_YACCEL, PLAYER_JUMP);
    Physics.step(this.player, this.map);
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