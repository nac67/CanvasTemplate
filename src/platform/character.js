
var Character = function () {
    this.x = 2.2
    this.y = 2.4;
    this.width = PLAYER_WIDTH/TILE;
    this.height = PLAYER_HEIGHT/TILE;
    this.vx = 0;
    this.vy = 0;

    this.touchLeft = false;
    this.touchRight = false;
    this.touchTop = false;
    this.touchBottom = false;
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

    var touchColor = "#c61236"; 
    if (this.touchTop) {
        Utils.drawRect(this.x * TILE, this.y * TILE, this.width*TILE, this.height*TILE/5, touchColor);
    }
    if (this.touchBottom) {
        Utils.drawRect(this.x * TILE, this.y * TILE+ this.height*TILE*(4/5), this.width*TILE, this.height*TILE/5, touchColor);
    }
    if (this.touchLeft) {
        Utils.drawRect(this.x * TILE, this.y * TILE, this.width*TILE/5, this.height*TILE, touchColor);
    }
    if (this.touchRight) {
        Utils.drawRect(this.x * TILE + this.width*TILE*(4/5), this.y * TILE, this.width*TILE/5, this.height*TILE, touchColor);
    }
}