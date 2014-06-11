/*  
     ____ ___ _   ___     _____ ____  _   _   _    _     
    |  _ \_ _| | | \ \   / /_ _/ ___|| | | | / \  | |    
    | |_) | || | | |\ \ / / | |\___ \| | | |/ _ \ | |    
    |  __/| || |_| | \ V /  | | ___) | |_| / ___ \| |___ 
    |_|  |___|\___/   \_/  |___|____/ \___/_/   \_\_____|
                                                         

    HTML5 Canvas and WebGL Pump It Up Visualizer!
    Copyright (C) 2014  Lucas Teske

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
    
    Please notice that this license only applies for the codes of Pump It Up Visualizer.
    The assets from Pump It Up Fiesta 2 are NOT licensed here and their copyrights are
    holded by Andamiro. Also there is a few libraries that is used on Piuvisual that
    may have different license including but not limited to JPAK, jQuery and others.

*/


/*************************  Game  **************************/
/*
 * This is the Game Class. Everything will be hooked up here.
 * The constructor initializes the Effects, Sentinel, Drawer, Looper, Skin and all stuff.
 */
PUMPER.Game = PUMPER.Game || function ( parameters ) {
    //var _selfgame = this;
    if(parameters.canvas === undefined)
        PUMPER.debug("No canvas!!");
    if(parameters.notedata === undefined)
        PUMPER.debug("No notedata!!");
    
    //	Creates the Sentinel
    PUMPER.Globals.Game     =   this;
    PUMPER.Globals.Sentinel =   new PUMPER.Sentinel();
    PUMPER.Globals.Sentinel.InitSession();
    
    if(PUMPER.ScrollSpeed <= 0)
        PUMPER.ScrollSpeed = 3;
    PUMPER.debug("WebGL Support: "+PUMPER.Globals.WebGL);
    if(PUMPER.Globals.WebGL)    {
        PUMPER.debug("Enabling WebGL, Yupppiii!");
        $("body").append("<div style=\"color: white\">WebGL Render</div>");
    }else
        $("body").append("<div style=\"color: white\">Canvas Render</div>");
    
    //  Loads the bomb audio
    PUMPER.Globals.Bomb     =   new PUMPER.SoundPlayer({"filename":"audio/bomb2", "reset":true, "buildnew" : true});
    
    //	Loads canvas, webgl and game parameters.
    this.canvas             =   parameters.canvas || document.createElement('canvas');
    this.glopts             =   { antialias : false };
    this.gl                 =   (PUMPER.Globals.WebGL) ? ( (PUMPER.Globals.glExperimental)? this.canvas.getContext("experimental-webgl", this.glopts ) : this.canvas.getContext("webgl", this.glopts ) ) : undefined;
    this.skin               =   new PUMPER.F2Skin({"canvas":this.canvas, "gl":this.gl});
    this.notedata           =   parameters.notedata; 
    this.musicfile          =   parameters.musicfile;
    PUMPER.Globals.Double   =   this.notedata.Mode.toLowerCase().trim() == "double";
    PUMPER.Globals.FPSStats =   parameters.stats;
    //  Settings globals
    PUMPER.debug("Setting global vars");
    PUMPER.Globals.Music    =   new PUMPER.SoundPlayer({"filename":this.musicfile});
    PUMPER.Globals.NoteData =   this.notedata;
    PUMPER.Globals.CurrentScrollFactor = 1;
    PUMPER.ScreenHeight     =   this.canvas.height;
    PUMPER.ScreenWidth      =   this.canvas.width;
    PUMPER.singlereceptor   =   { "x": (this.canvas.width - (PUMPER.ShowWidth*5)) / 2 ,  "y": PUMPER.OffsetY, "width": PUMPER.ShowWidth * 5,  "height" : PUMPER.ArrowSize };
    PUMPER.doublereceptor   =   { "x": (this.canvas.width - (PUMPER.ShowWidth*10)) / 2 , "y": PUMPER.OffsetY, "width": PUMPER.ShowWidth * 10, "height" : PUMPER.ArrowSize };
    PUMPER.singlenotesx     =   [ ];
    for(var i=0;i<5;i++)    
        PUMPER.singlenotesx.push(PUMPER.singlereceptor.x + PUMPER.ShowWidth * i -4);
    
    PUMPER.doublenotesx     =   [ ];
    for(var i=0;i<10;i++)    
        PUMPER.doublenotesx.push(PUMPER.doublereceptor.x + PUMPER.ShowWidth * i -4 + (i>4?6:0));
    if(!PUMPER.Globals.WebGL)  
        this.Drawer             =   new PUMPER.Drawer({ "canvas": this.canvas,    "skin" : this.skin });
    else
        this.Drawer             =   new PUMPER.GL.Drawer({ "canvas": this.canvas,    "skin" : this.skin, "gl" : this.gl });
    
    this.Looper             =   new PUMPER.Looper({ "drawer" : this.Drawer,   "notedata" : this.notedata, "skin" : this.skin});
    PUMPER.Globals.Drawer   =   this.Drawer;
    PUMPER.Globals.Looper   =   this.Looper;
    PUMPER.Globals.Skin     =   this.skin;
    PUMPER.Globals.DefaultNoteSkin = this.notedata.NoteSkinBank[0];
    PUMPER.Globals.EffectBank = new PUMPER.EffectBank({"drawer":this.Drawer, "gl" : this.gl});
    for (var bank in this.notedata.NoteSkinBank) {
      if (this.notedata.NoteSkinBank.hasOwnProperty(bank)) {
        PUMPER.Globals.Skin.LoadNoteSkin(this.notedata.NoteSkinBank[bank]);
      }
    }
    PUMPER.Globals.LoadStarted = true;
    
    /**
     * 	This will pause the music if user focus out from the screen.
     */
    $(window).blur(function() {	
	    PUMPER.Globals.Music.Pause();
	});
    /*	//	Not used anymore
	this.wPlay = function() {
	    PUMPER.Globals.Music.Play();
	};
	*/
};

/*
 * 	Plays the music
 */
PUMPER.Game.prototype.Play  =   function()  {
    PUMPER.Globals.Music.Play();
    //_selfgame.wPlay();
};

/*
 * 	Pauses the music
 */
PUMPER.Game.prototype.Pause =   function()  {
    PUMPER.Globals.Music.Pause();
};

/*
 * 	This is for adding a background image to the system.
 * 	For WebGL we need to create a texture and a Background object. But in default way, we initialize a PIUBGAOFF Shader Background.
 * 	For 2D Canvas, we just resize it to fit on the screen.
 */
PUMPER.Game.prototype.AddBackground = function(image)   {
    var bg = new Image();
    var _drawer = this;
    bg.onload = function()  {
        var img;
        var BGObject;
        if(PUMPER.Globals.WebGL)    {
            img = _drawer.gl.createTexture();
            _drawer.gl.bindTexture(_drawer.gl.TEXTURE_2D, img);
            _drawer.gl.pixelStorei(_drawer.gl.UNPACK_FLIP_Y_WEBGL, true);
            _drawer.gl.texImage2D(_drawer.gl.TEXTURE_2D, 0, _drawer.gl.RGBA, _drawer.gl.RGBA, _drawer.gl.UNSIGNED_BYTE, PUMPER.GL.ToPowerOfTwo(this));
            _drawer.gl.texParameteri(_drawer.gl.TEXTURE_2D, _drawer.gl.TEXTURE_MAG_FILTER, _drawer.gl.LINEAR);
            _drawer.gl.texParameteri(_drawer.gl.TEXTURE_2D, _drawer.gl.TEXTURE_MIN_FILTER, _drawer.gl.LINEAR_MIPMAP_NEAREST); 
            _drawer.gl.generateMipmap(_drawer.gl.TEXTURE_2D);
            _drawer.gl.bindTexture(_drawer.gl.TEXTURE_2D, null); 
            img.width = PUMPER.GL.nextHighestPowerOfTwo(this.width); 
            img.height = PUMPER.GL.nextHighestPowerOfTwo(this.height); 
            img.rwidth = this.width;
            img.rheight = this.height;    
            var SHD = new PUMPER.GL.PIUBGAOFF(_drawer.gl, PUMPER.ScreenWidth, PUMPER.ScreenHeight);
            SHD.Render();
            BGObject = new PUMPER.AnimatedObject({"image" : SHD.texture, "gl" : _drawer.gl});
            BGObject.shd = SHD; 
        }else{
            img = PUMPER.ResizeImage(this,PUMPER.ScreenWidth,PUMPER.ScreenHeight);
            BGObject = new PUMPER.AnimatedObject({"image" : img, "gl" : _drawer.gl});
        }
        //BGObject.scale.x = PUMPER.ScreenWidth / this.width;
        //console.log(this.width, PUMPER.ScreenWidth);
        PUMPER.Globals.Drawer.AddObj(BGObject,0); 
    };
    bg.src = image;
};
