var app;

init();

function init () {
    Content.createLoader();

    //preload assets
    Content.preloadImage('images/test.gif');

    Content.loadThenStart(startApp);
}

function startApp () {
    app = new AppController();
    animate(); //begin self-calling animate function
}



function animate() {
    app.update();
    app.draw();
  
    // request new frame
    requestAnimFrame(function() {
        animate();
    });
}