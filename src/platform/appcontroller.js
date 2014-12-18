var AppController = function () {

    // indexed [y][x]
    this.map = [[1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,1,1,1,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1]];

    this.player = new Character();
}

AppController.prototype.update = function () {
    var left = Key.isDown(Key.LEFT);
    var right = Key.isDown(Key.RIGHT);

    if (!left && !right || left && right) {
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
        }
    } else if (Key.isDown(Key.RIGHT)) {
        if (this.player.vx < PLAYER_CAP_XVEL) {
            this.player.vx += PLAYER_XACCEL;
        }
    }

    this.player.x += this.player.vx;
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