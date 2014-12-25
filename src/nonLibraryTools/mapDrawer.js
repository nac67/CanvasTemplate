var app;

// CONSTANTS
var TILE = 20;

// HTML JUNK
var _shiftLeft = document.getElementById('shiftLeft');
var _shiftRight = document.getElementById('shiftRight');
var _shiftUp = document.getElementById('shiftUp');
var _shiftDown = document.getElementById('shiftDown');
var _widthInput = document.getElementById('widthInput');
var _setSize = document.getElementById('setSize');
var _heightInput = document.getElementById('heightInput');
var _2dindexing = document.getElementById('2dindexing');
var _type = document.getElementById('type');
var _printCode = document.getElementById('printCode');
var _readCode = document.getElementById('readCode');
var _updateColors = document.getElementById('updateColors');
var _codeArea = document.getElementById('codeArea');
var _colorArea = document.getElementById('colorArea');

// INITIAL SETUP
_colorArea.value = "0 #FFFFFF\n1 #000000";
_type.value = "1";
_2dindexing.checked = true;
_widthInput.value = "30";
_heightInput.value = "20";

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

function getWidth() {
    return parseInt(_widthInput.value);
}

function getHeight() {
    return parseInt(_heightInput.value);
}

function getType() {
    var result = parseInt(_type.value);
    if (!isNaN(result)) {
        return result;
    } else {
        return _type.value;
    }
}

function getRectangle(start, end) {
    var left = Math.min(start[0], end[0]);
    var top = Math.min(start[1], end[1]);
    var right = Math.max(start[0], end[0]);
    var bottom = Math.max(start[1], end[1]);
    left = Math.max(0, left);
    top = Math.max(0, top);
    left = Math.min(app.gameMap[0].length-1, left);
    top = Math.min(app.gameMap.length-1, top);
    right = Math.max(0, right);
    bottom = Math.max(0, bottom);
    right = Math.min(app.gameMap[0].length-1, right);
    bottom = Math.min(app.gameMap.length-1, bottom);
    // seemingly redudant checks are for when you start 
    // the dragging outside of the rectangle

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

function create2DArray(rows, cols) {
    var result = [];
    for (var i=0; i<rows; i++) {
        result.push([]);
        for (var j=0; j<cols; j++) {
            result[i].push(0);
        }
    }
     return result;
}

function copyArrayIntoDifferentSize (oldArray, newRows, newCols) {
    var result = [];
    for (var i=0; i<newRows; i++) {
        result.push([]);
        for (var j=0; j<newCols; j++) {
            if (i < oldArray.length && j < oldArray[i].length) {
                result[i].push(oldArray[i][j]);
            } else {
                result[i].push(0);
            }
        }
    }
    return result;
}


// APP LOGIC

var AppController = function () {
    this.lastMouse = false;
    this.startDrag = [0,0];
    this.endDrag = [0,0];
    this.colorMappings = {};
    this.updateColorMappings();
    this.gameMap = create2DArray(getHeight(), getWidth());
}

AppController.prototype.update = function () {
    if (!this.lastMouse && Mouse.leftDown) { 
        // Mouse down
        this.startDrag = getCoord(mouseX(), mouseY());
        this.endDrag = getCoord(mouseX(), mouseY());
    } else if (Mouse.leftDown) {
        // Mouse drag
        this.endDrag = getCoord(mouseX(), mouseY());
    } else if (this.lastMouse && mouseX() < 800 && mouseY() < 600) {
        // Mouse up
        this.endDrag = getCoord(mouseX(), mouseY());
        if (!Key.isDown(65)) { //A
            this.populate(getType());
        } else {
            this.populate(0);
        }
    }   
    this.lastMouse = Mouse.leftDown;
}

AppController.prototype.draw = function () {
    console.log("width: "+this.gameMap[0].length+" height: "+this.gameMap.length);

    for (var i = 0; i < this.gameMap.length; i++) {
        for (var j = 0; j < this.gameMap[i].length; j++) {
            var elem = this.gameMap[i][j];
            context.fillStyle = this.colorMappings[elem];
            context.fillRect(j*TILE,i*TILE,TILE,TILE);
        }
    }

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

AppController.prototype.populate = function (t) {
    var rect = getRectangle(this.startDrag, this.endDrag);
    for (var i=rect[1]; i<=rect[3]; i++) {
        for (var j=rect[0]; j<=rect[2];j++) {
            this.gameMap[i][j] = t;
        }
    }
}

AppController.prototype.updateColorMappings = function () {
    this.colorMappings = {};
    var lines = _colorArea.value.split("\n");
    for (var i=0;i<lines.length;i++){
        var typeColor = lines[i].split(" ");
        this.colorMappings[typeColor[0]] = typeColor[1];
    }
}


// BUTTON STUFF
_updateColors.onclick = function () {
    app.updateColorMappings();
}

_setSize.onclick = function () {
    app.gameMap = copyArrayIntoDifferentSize(app.gameMap, getHeight(), getWidth());
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