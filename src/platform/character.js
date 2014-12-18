
var Character = function () {
    this.x = 5;
    this.y = 5.1;
    this.width = PLAYER_WIDTH/TILE;
    this.height = PLAYER_HEIGHT/TILE;
    this.vx = 0;
    this.vy = 0;

    this.touchLeft = true;
    this.touchRight = true;
    this.touchDown = true;
    this.touchUp = true;
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
    if (this.touchLeft) {
        Utils.drawRect(this.x * TILE, this.y * TILE, this.width*TILE/10, this.height*TILE, "#238341");
    }
}