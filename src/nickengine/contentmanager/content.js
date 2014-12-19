/** 
 * This is the content management system for the engine.
 * 
 * Since this game runs online, you must preload all image assets before 
 * starting the game. After the game starts, you shouldn't load any more images.
 * 
 * There are 3 steps:
 * 1) create the loader
 *     use function createLoader
 * 2) load all required assets
 *     To load an image, use preloadImage or preloadFilm. Both of these 
 *     will add the image to the preloader's queue and then store them 
 *     in this module's dictionary for later lookup. 
 * 3) start the loader
 *     This will start the loader and when its finished it will start 
 *     the game.
 * 
 * You can recall any previously loaded image after the game starts by 
 * using getImage.
 */
var Content = function () {
    var images = {};
    var films = {};
    var loader;
    var percentDone = 0;
    var loadAny = false; //loader screws up if not loading anything, so check if anything needs loading

    /////////////////////////////////////////
    // TO BE USED BEFORE STARTING PRELOADER
    /////////////////////////////////////////

    /** Do this before you do anything else 
        Should only be done once */
    var createLoader = function () {
        loader = new PxLoader();
    }

    /** Loads and stores an image in the dictionary for later recall 
        Should only be done once per image */
    var preloadImage = function (src){
        var bitmap = loader.addImage(src);
        images[src] = bitmap;
        loadAny = true;
        return bitmap;
    }

    /** Loads an image and creates a filmstrip 
        Should only be done once per filmstrip */
    var preloadFilm = function (src, width, height, frames, framesInRow) {
        var bitmap = preloadImage(src);
        var film =  new Filmstrip(bitmap, width, height, frames, framesInRow);
        films[src] = film;
        loadAny = true;
        return film;
    }

    /** Starts the preloader then when its finished runs callback function */
    var loadThenStart = function(callback) {
        if (loadAny) {
            loader.addCompletionListener(callback);
            loader.addProgressListener(function(e) { 
               percentDone = e.completedCount/e.totalCount; 
               drawPreloader(percentDone);
            }); 
            drawPreloader(0);
            loader.start();
        } else {
            callback();
        }
    }


    var getPercent = function () {
        return percentDone;
    }


    /////////////////////////////////////////
    // TO BE USED AFTER STARTING PRELOADER
    /////////////////////////////////////////

    /** Retrieves an image that has been previously loaded 
        Can be done multiple times */
    var getImage = function (src) {
        var bitmap = images[src];
        if(bitmap == undefined){
            alert("FAILED to retrieve image.\nYou have not previously loaded: "+src);
            return null;
        }else{
            return bitmap;
        }
    }

    /** Retrieves an flimstrip that has been previously loaded 
        Can be done multiple times */
    var getFilm = function (src) {
        var film = films[src];
        if(film == undefined){
            alert("FAILED to retrieve film.\nYou have not previously loaded: "+src+ " or it is not a filmstrip, but an image instead");
            return null;
        }else{
            return film;
        }
    }


    /** Will draw a preloader bar onto the screen with
        a bar signifying pct percent completion */
    var drawPreloader = function(pct) {
        var width = WIDTH * .7;
        var height = 30;
        var x1 = WIDTH/2 - (width/2);
        var y1 = HEIGHT/2 - (height/2);
        context.lineStyle = "#000000";
        context.fillStyle = "#CCCCCC";
        context.fillRect(x1,y1,width*pct,height);
        context.strokeRect(x1,y1,width,height);
    }


    /////////////////////////////////////////

    return {
        createLoader: createLoader,
        getImage: getImage,
        getFilm: getFilm,
        preloadFilm: preloadFilm,
        preloadImage: preloadImage,
        loadThenStart: loadThenStart,
        getPercent: getPercent
    }

} ();