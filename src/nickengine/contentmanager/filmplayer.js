var Filmplayer = function () {
    this.currentStrip = 0;        //index of which strip it should currently play
    this.filmStrips = [];         //[Filmstrip] list of strips
    this.frameIndex = [];         //[int] where the playhead currently is in the filmstrip
    this.nameMappings = {};       //<string,int> film name -> index in other arrays
    this.nameGivenIndex = [];     // nameGivenIndex[i] gives the name of filmstrip #i
    this.frameDuration = 1;
    this.frameTimer=0;

    this.paused = false;
}

/** If the player is paused, it will resume playing */
Filmplayer.prototype.play = function () {
    this.paused = false;
}

/** Pauses the player until play is called */
Filmplayer.prototype.pause = function () {
    this.paused = true;
}

/** Sets the frame of the current filmstrip to n. This leaves
    all other filmstrips playheads where they were. Wraparound
    makes sure there are no index out of bound problems. */
Filmplayer.prototype.setFrame = function (n) {
    n = n%this.filmStrips[this.currentStrip].numFrames;
    this.frameIndex[this.currentStrip] = n;
}

/** Restarts the current filmstrip */
Filmplayer.prototype.restart = function () {
    this.frameIndex[this.currentStrip] = 0;
}

/** If not paused, it advances the current filmstrip by 1 frame */
Filmplayer.prototype.updateFrame = function () {
    this.frameTimer++;
    if(!this.paused && this.frameTimer%this.frameDuration == 0){
        var n = this.frameIndex[this.currentStrip];
        this.setFrame(n+1);
    }
}

/** Adds a filmstrip into the player by the given name. This name is
    later used for swapFilm */
Filmplayer.prototype.addFilmStrip = function (name, strip){
    this.nameMappings[name] = this.filmStrips.length;
    this.nameGivenIndex[this.filmStrips.length] = name;
    this.filmStrips.push(strip);
    this.frameIndex.push(0);
}

/** Switches the current filmstrip to one of the given name. If the name
    does not exist, it writes that error and does nothing */
Filmplayer.prototype.swapFilm = function (name) {
    var index = this.nameMappings[name];
    if(index != undefined){
        this.currentStrip = index;
    }else{
        console.log("'"+name+"'' is not a valid name for a filmstrip.");
    }
}

/** Returns the name id of the currently playing film strip */
Filmplayer.prototype.getFilm = function () {
    return this.nameGivenIndex[this.currentStrip];
}

/** Draws the current strip to the canvas */
Filmplayer.prototype.draw = function (x,y,alpha){
    var f = this.frameIndex[this.currentStrip];
    this.filmStrips[this.currentStrip].draw(f,x,y,alpha);
}