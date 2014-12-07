var app;

init();

function init () {
    Content.createLoader();

    //preload assets
    Content.preloadImage('images/carrot.png');
    Content.preloadFilm('images/rat.png', 110, 50, 30, 6);
    Content.preloadFilm('images/Spazout.png', 110, 50, 60, 8);

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