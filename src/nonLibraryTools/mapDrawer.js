var app;

// still left TODO
// * Make bounds of map more obvious
// * Make way to navigate around if map is very large
// * read in a map

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

    var rawColor = app.colorMappings[getType()];

    if (rawColor === undefined) rawColor = "#FF00FF";

    context.strokeStyle = "rgb("+hexToR(rawColor)+","+hexToG(rawColor)+","+hexToB(rawColor)+")";
    context.fillStyle = "rgba("+hexToR(rawColor)+","+hexToG(rawColor)+","+hexToB(rawColor)+",.3)";
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

function rotateElements (arry, forwards) {
    if (forwards) {
        var prevElem = arry[arry.length-1];
        for (var i=0; i<arry.length; i++) {
            var temp = arry[i];
            arry[i] = prevElem;
            prevElem = temp;
        }
    } else {
        var prevElem = arry[0];
        for (var i=arry.length-1; i>=0; i--) {
            var temp = arry[i];
            arry[i] = prevElem;
            prevElem = temp;
        }
    }
}

function toStringElem(elem) {
    if (typeof elem == 'number') {
        return elem;
    } else {
        return "\""+elem+"\"";
    }
}

function arrayToText (arry) {
    var result = "var map =   ";
    for (var i=0;i<arry.length;i++) {
        if (i == 0) {
            result += "[[";
        }else {
            result += "             ["
        }
        
        for (var j=0;j<arry[i].length;j++) {
            if (j == 0) {
                result += toStringElem(arry[i][j]);
            } else {
                result += ","+toStringElem(arry[i][j]);
            }
            
        }

        if (i != arry.length-1) {
            result += "],\n";
        } else {
            result += "]];"
        }
    }
    return result;
}

function transpose (a) {

  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
};

// http://www.javascripter.net/faq/hextorgb.htm
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

// APP LOGIC

var AppController = function () {
    this.lastMouse = false;
    this.startDrag = [0,0];
    this.endDrag = [0,0];
    this.colorMappings = {};
    this.updateColorMappings();
    this.gameMap = [[0]];
    this.gameMap = copyArrayIntoDifferentSize(this.gameMap, getHeight(), getWidth());
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

    for (var i = 0; i < this.gameMap.length; i++) {
        for (var j = 0; j < this.gameMap[i].length; j++) {
            var elem = this.gameMap[i][j];
            var rawColor = this.colorMappings[elem];
            if (rawColor === undefined) rawColor = "#FF00FF";
            context.fillStyle = rawColor;
            context.fillRect(j*TILE,i*TILE,TILE,TILE);
        }
    }

    // Draw background lines
    for (var x = 0; x < this.gameMap[0].length * TILE; x += TILE) {
        Utils.drawHorizontalLine(x, 0, this.gameMap.length * TILE, "#CCCCCC");
    }
    for (var y = 0; y < this.gameMap.length * TILE; y += TILE) {
        Utils.drawVerticalLine(0, this.gameMap[0].length * TILE, y, "#CCCCCC");
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

_shiftUp.onclick = function () {
    rotateElements(app.gameMap, false);
}

_shiftDown.onclick = function () {
    rotateElements(app.gameMap, true);
}

_shiftLeft.onclick = function () {
    for (var i=0; i<app.gameMap.length; i++) {
        rotateElements(app.gameMap[i], false);
    }
}

_shiftRight.onclick = function () {
    for (var i=0; i<app.gameMap.length; i++) {
        rotateElements(app.gameMap[i], true);
    }
}

_printCode.onclick = function () {
    if (_2dindexing.checked) {
        _codeArea.value = arrayToText(app.gameMap);
    } else {
        _codeArea.value = arrayToText(transpose(app.gameMap));
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