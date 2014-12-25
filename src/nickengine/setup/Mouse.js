//TODO: currently if the canvas is inside another tag that has an offset position
//on the webpage, you will also need to subtract is offsetLeft and offsetRight
//from the mouse positions. What I plan to do is create a list of DOM elements
//that it can step through to subtract the appropriate offset from the mouse
//position. Ideally, it will be able to detect the DOM elements by itself.

var Mouse = (function () {

    window.document.addEventListener("mousedown",mouseDown);
    window.document.addEventListener("mouseup",mouseUp);
    window.document.addEventListener("mousemove",mouseMove);
    window.document.addEventListener("touchstart",mouseDown);
    window.document.addEventListener("touchend",mouseUp);
    window.document.addEventListener("touchmove",mouseMove);

    var leftDown = false;
    var x = 0;
    var y = 0;

    function mouseDown (event){

        Mouse.leftDown = true;

        if(event.targetTouches){
              event.preventDefault();
              mx = event.targetTouches[0].pageX;
              my = event.targetTouches[0].pageY;
        }else{
            if (event.x != undefined && event.y != undefined) {
                Mouse.x = document.body.scrollLeft +event.x;
                Mouse.y = document.body.scrollTop + event.y;
            } else { // Firefox method to get the position
                Mouse.x = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
                Mouse.y = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
            }
        }

        Mouse.x -= canvas.offsetLeft;
        Mouse.y -= canvas.offsetTop;
    }

    //TODO cache offset
    function mouseMove (event){
        if(event.targetTouches){
              event.preventDefault();
              mx = event.targetTouches[0].pageX;
              my = event.targetTouches[0].pageY;
        }else{
            if (event.x != undefined && event.y != undefined) {
                Mouse.x = document.body.scrollLeft +event.x;
                Mouse.y = document.body.scrollTop + event.y;
            } else { // Firefox method to get the position
                Mouse.x = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
                Mouse.y = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
            }
        }

        Mouse.x -= canvas.offsetLeft;
        Mouse.y -= canvas.offsetTop;
    }

    function mouseUp (event){
        Mouse.leftDown = false;
    }

    return {
        x: x,
        y: y,
        leftDown: leftDown
    }

}) ();