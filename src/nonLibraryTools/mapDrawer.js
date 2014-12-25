var app;

// CONSTANTS
var TILE = 20;

// HTML JUNK
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

// INITIAL SETUP
_colorArea.value = "0 #FFFFFF\n1 #000000";
_type.value = "1";

// HELPFUL FUNCTIONS
function mouseX() {
    return Mouse.x - document.getElementById('td').offsetLeft - document.getElementById('tr').offsetLeft - document.getElementById('table').offsetLeft;
}

function mouseY() {
    return Mouse.y - document.getElementById('td').offsetTop - document.getElementById('tr').offsetTop - document.getElementById('table').offsetTop;
}

function getCoord(x,y) {
    return [Math.floor(x/TILE), Math.floor(y/TILE)];
}

function getRectangle(start, end) {
    var left = Math.min(start[0], end[0]);
    var top = Math.min(start[1], end[1]);
    var right = Math.max(start[0], end[0]);
    var bottom = Math.max(start[1], end[1]);
    return [left, top, right, bottom];
}

function drawSelectangle(start, end) {
    var rectangle = getRectangle(start, end);

    context.strokeStyle = "rgb(118,14,131)";
    context.fillStyle = "rgba(118,14,131,.3)";
    context.beginPath();

    var width = rectangle[2]-rectangle[0]+1;
    var height = rectangle[3]-rectangle[1]+1;

    context.rect(
        rectangle[0]*TILE+.5,
        rectangle[1]*TILE+.5,
        width*TILE, 
        height*TILE);

    context.fillRect(
        rectangle[0]*TILE+.5,
        rectangle[1]*TILE+.5,
        width*TILE, 
        height*TILE);

    context.stroke();
}


// APP LOGIC

var AppController = function () {
    this.lastMouse = false;
    this.startDrag = [0,0];
    this.endDrag = [0,0];
}

AppController.prototype.update = function () {
    if (!this.lastMouse && Mouse.leftDown) { 
        // Mouse down
        this.startDrag = getCoord(mouseX(), mouseY());
        this.endDrag = getCoord(mouseX(), mouseY());
    } else if (Mouse.leftDown) {
        // Mouse drag
        this.endDrag = getCoord(mouseX(), mouseY());
    } else if (this.lastMouse) {
        // Mouse up
        this.endDrag = getCoord(mouseX(), mouseY());
    }   
    this.lastMouse = Mouse.leftDown;
}

AppController.prototype.draw = function () {
    // Draw background lines
    for (var x = 0; x < 800; x += TILE) {
        Utils.drawHorizontalLine(x, 0, 600, "#CCCCCC");
    }
    for (var y = 0; y < 800; y += TILE) {
        Utils.drawVerticalLine(0, 800, y, "#CCCCCC");
    }

    if (Mouse.leftDown) {
        drawSelectangle(this.startDrag, this.endDrag);
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