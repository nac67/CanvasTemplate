var app;
var TILE = 20;

var _shiftLeft = document.getElementById('shiftLeft');
var _shiftRight = document.getElementById('shiftRight');
var _shiftUp = document.getElementById('shiftUp');
var _shiftDown = document.getElementById('shiftDown');
var _widthInput = document.getElementById('widthInput');
var _setWidth = document.getElementById('setWidth');
var _heightInput = document.getElementById('heightInput');
var _setHeight = document.getElementById('setHeight');
var _type = document.getElementById('type');
var _printCode = document.getElementById('printCode');
var _readCode = document.getElementById('readCode');
var _updateColors = document.getElementById('updateColors');
var _codeArea = document.getElementById('codeArea');
var _colorArea = document.getElementById('colorArea');

var AppController = function () {

}

AppController.prototype.update = function () {

}

AppController.prototype.draw = function () {
    // Draw background lines
    for (var x = 0; x < 800; x += TILE) {
        Utils.drawHorizontalLine(x, 0, 600, "#CCCCCC");
    }
    for (var y = 0; y < 800; y += TILE) {
        Utils.drawVerticalLine(0, 800, y, "#CCCCCC");
    }
}

startApp();
function startApp () {
    app = new AppController();
    animate(); //begin self-calling animate function
}



function animate() {
    app.update();
    // Draw the background
    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,800,600);
    app.draw();
  
    // request new frame
    requestAnimFrame(function() {
        animate();
    });
}