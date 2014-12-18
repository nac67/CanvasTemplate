var Character = function () {
    this.x = 5;
    this.y = 5;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.vx = 0;
    this.vy = 0;
}

Character.prototype.left = function () {
    return this.x;
}

Character.prototype.right = function () {
    return this.x + this.width;
}

Character.prototype.up = function () {
    return this.y;
}

Character.prototype.down = fuction () {
    return this.y + this.height;
}

Character.prototype.draw = function () {
    Utils.drawRect(this.x * TILE, this.y * TILE, this.width, this.height, "#238341");
}