
var Character = function () {
    this.x = 5;
    this.y = 5.1;
    this.width = PLAYER_WIDTH/TILE;
    this.height = PLAYER_HEIGHT/TILE;
    this.vx = 0;
    this.vy = 0;

    this.touchLeft = false;
    this.touchRight = false;
    this.touchDown = false;
    this.touchUp = false;
}

Character.prototype.left = function () {
    return this.x;
}

Character.prototype.setLeft = function (x) {
    this.x = x;
}

Character.prototype.right = function () {
    return this.x + this.width;
}

Character.prototype.setRight = function (x) {
    this.x = x - this.width;
}

Character.prototype.top = function () {
    return this.y;
}

Character.prototype.setTop = function (y) {
    this.y = y;
}

Character.prototype.bottom = function () {
    return this.y + this.height;
}

Character.prototype.setBottom = function (y) {
    this.y = y - this.height;
}

Character.prototype.draw = function () {
    Utils.drawRect(this.x * TILE, this.y * TILE, this.width*TILE, this.height*TILE, "#238341");
    if (this.touchUp) {
        Utils.drawRect(this.x * TILE, this.y * TILE, this.width*TILE, this.height*TILE/5, "#c61236");
    }
    if (this.touchDown) {
        Utils.drawRect(this.x * TILE, this.y * TILE+ this.height*TILE*(4/5), this.width*TILE, this.height*TILE/5, "#c61236");
    }
    if (this.touchLeft) {
        Utils.drawRect(this.x * TILE, this.y * TILE, this.width*TILE/5, this.height*TILE, "#c61236");
    }
    if (this.touchRight) {
        Utils.drawRect(this.x * TILE + this.width*TILE*(4/5), this.y * TILE, this.width*TILE/5, this.height*TILE, "#c61236");
    }
}