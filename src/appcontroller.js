var AppController = function () {
    this.x = 50;
    this.y = 50;
}

AppController.prototype = {
    update: function () {
    },

    draw: function () {
        // Draw the background
        context.fillStyle = "#FFFFFF";
        context.fillRect(0,0,WIDTH,HEIGHT);

        context.drawImage(Content.getImage('images/test.gif'), this.x, this.y)
    }

}