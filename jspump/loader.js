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



/*
 * 	This is the Step Types used on the Loader.
 * 	Not all have been implemented.
 */
PUMPER.TypeInvalid  =   0;		//	The default one, for undefined type
PUMPER.TypeUCS      =   1;		//	UCS File Loader
PUMPER.TypeNX       =   2;		//	NX20/10 File Loader
PUMPER.TypeSM       =   3;		//	SM File Loader
PUMPER.TypeSMA      =   4;		//	SMA File Loader
PUMPER.TypeSSC      =   5;		//	SSC File Loader
PUMPER.TypeJPAKNX   =   6;		//	JPAK'd NX20 file (piuvisual struct) file loader
PUMPER.TypeTextUCS  =   7;		//	Text Type UCS (not a file loader, just receive the Text as parameter)

/*
 * 	The Loader Constructor.
 * 	It uses a parameters object with following items:
 * 		-	loadtype			=>	The type of file that we are loading (refer to PUMPER.TypeXXXXXX)
 * 			loadargs			=>	The load arguments, specific for each file type
 * 			gamestats			=>	The stats.js instance for updating the framerate.
 * 			canvasname			=>	The canvas name to use on drawings
 * 			HighSpeedAnimation	=>	If true, it will render as 240FPS setInterval not using the requestAnimationFrame. Default is false
 */
PUMPER.GameLoader = PUMPER.GameLoader || function(parameters)   {

    this.loadtype       =   parameters["loadtype"]         || PUMPER.TypeInvalid;
    this.loadargs       =   parameters["loadargs"]         || {};
    this.gamestats      =   parameters["gamestats"]        || {};
    this.canvasname     =   parameters["canvasname"]       || {};
    this.compcodec      =   PUMPER.GetCompatibleCodecs();
    this.HighSpeedAnimation = parameters["HighSpeedAnimation"] || false;
    if(this.loadtype == PUMPER.TypeInvalid) 
        PUMPER.debug("Invalid Load Type!");
           
};

/*
 *	This function starts the loading and parsing of the file.
 *	The behaviour is specific for each type of files. 
 */
PUMPER.GameLoader.prototype.Load    =   function()  {
    var _this = this;
    switch(this.loadtype)   {
    	/**
    	 * 	This is the Text UCS Loader. It will receive a loadarg called "ucsdata" that will be used in the parser.
    	 * 	It uses the same parser as TypeUCS, but TypeUCS loads it from an URL.
    	 * 	It will load background image from folder ucs/img/{SONGID}.jpg and song from ucs/mp3/{SONGID}.mp3 (if mp3 is supported) or ucs/ogg/{SONGID}.ogg (if ogg is supported)
    	 * 	If MP3 is supported, MP3 Will be loaded.
    	 */
        case PUMPER.TypeTextUCS:
            if(this.loadargs["ucsdata"] !== undefined && this.loadargs.songid !== undefined) {
                this.soundfile = (this.compcodec.audio.indexOf("mp3") > -1)?"ucs/mp3/"+this.loadargs["songid"]+".mp3":"ucs/ogg/"+this.loadargs["songid"]+".ogg";
                this.imagefile = "ucs/img/"+this.loadargs.songid+".jpg";
                this._UCS = PUMPER.UCSParser(this.loadargs.ucsdata);
                var gameCanvas = document.getElementById(_this.canvasname);
                PUMPER.Globals.PumpGame = new PUMPER.Game({"notedata" : this._UCS, "musicfile" : this.soundfile, "canvas": gameCanvas, "stats" : this.gamestats});
                PUMPER.Globals.PumpGame.AddBackground(_this.imagefile);
                this.Animate();
                setTimeout(function() { PUMPER.Globals.PumpGame.Play(); }, 1000);
            }else
                PUMPER.debug("No UCS data specifed!");               
            break;
        /**
         * 	Same as over, but uses a "ucsfile" parameter and loads that url.
         */
        case PUMPER.TypeUCS:
            if(this.loadargs["ucsfile"] !== undefined && this.loadargs["songid"] !== undefined) {
                this.soundfile = (this.compcodec.audio.indexOf("mp3") > -1)?"ucs/mp3/"+this.loadargs.songid+".mp3":"ucs/ogg/"+this.loadargs.songid+".ogg";
                this.imagefile = "ucs/img/"+this.loadargs.songid+".jpg";
                $.ajax({
                    url : _this.loadargs.ucsfile,
                    dataType: "text",
                        success : function (data) {
                            _this._UCS = PUMPER.UCSParser(data);
                            var gameCanvas = document.getElementById(_this.canvasname);
                            PUMPER.Globals.PumpGame = new PUMPER.Game({"notedata" : _this._UCS, "musicfile" : _this.soundfile, "canvas": gameCanvas, "stats" : _this.gamestats});
                            PUMPER.Globals.PumpGame.AddBackground(_this.imagefile);
                            _this.Animate();
                        }
                });
            }else
                PUMPER.debug("No UCS file specifed!");        
            break;
        /**
         * 	This is the NX20/NX10 Loader. Current the NX Parser will not parse NX10, only NX20
    	 * 	It will load background image from folder ucs/img/{SONGID}.jpg and song from ucs/mp3/{SONGID}.mp3 (if mp3 is supported) or ucs/ogg/{SONGID}.ogg (if ogg is supported)
    	 * 	If MP3 is supported, MP3 Will be loaded.
    	 * 	It will load NX file from a loadarg "nxfile"
         */
        case PUMPER.TypeNX:
            if(this.loadargs.nxfile !== undefined && this.loadargs.songid !== undefined) {
                this.soundfile = (this.compcodec.audio.indexOf("mp3") > -1)?"ucs/mp3/"+this.loadargs.songid+".mp3":"ucs/ogg/"+this.loadargs.songid+".ogg";
                this.imagefile = "ucs/img/"+this.loadargs.songid+".jpg";
                
                var oReq = new XMLHttpRequest();
                oReq.open("GET", this.loadargs.nxfile, true);
                oReq.responseType = 'arraybuffer';
                oReq.onload = function(e) {
                    _this._NX = PUMPER.NXParser(this.response);
                    var gameCanvas = document.getElementById(_this.canvasname);
                    PUMPER.Globals.PumpGame = new PUMPER.Game({"notedata" : _this._NX, "musicfile" : _this.soundfile, "canvas": gameCanvas, "stats" : _this.gamestats});
                    PUMPER.Globals.PumpGame.AddBackground(_this.imagefile);
                    _this.Animate();
                    if(_this.loadargs.autoplay)
                        setTimeout(function() { PUMPER.Globals.PumpGame.Play(); }, 1000);
                };
                oReq.send();
            }else
                PUMPER.debug("No UCS file specifed!");        
            break;
        /**
         * 	This will load a NX file inside an JPAK.
         * 	It will load a JPAK file with url specified on "jpak" loadarg, it will use also the level and mode parameter to pick the chart.
         * 	The structure of the JPAK file needs to follow this:
         * 	-	MUSIC.MP3					//	The MP3 song file
         * 	-	MUSIC.OGG					//	The OGG song file
         * 	-	PREVIEW.MP3					//	The preview song MP3, not needed for this loader.
         * 	-	PREVIEW.OGG					//	The preview song OGG, not needed for this loader.
         * 	-	PREVIEW.MP4					//	The preview video mp4, not needed for this loader.
         * 	-	TITLE.JPG					//	The background image
         * 	-	CHARTS						//	The charts folder
         * 	//	This is the charts folder content. You don't need to have all these folders created.
         * 	//	This is just for reference how you should place your NX charts inside the folders
         * 	-	CHARTS/SINGLE				//	The single charts folder
         * 	-	CHARTS/SINGLE/{LEVEL}.NX	//	The single chart with level {LEVEL}
         * 	-	CHARTS/DOUBLE				//	The double charts folder
         * 	-	CHARTS/SINGLEPERFORMANCE	//	The single performance charts folder
         * 	-	CHARTS/DOUBLEPERFORMANCE	//	The double performance charts folder
         * 	-	CHARTS/MISSION				//	The mission folders
         */
        case PUMPER.TypeJPAKNX:
            if(this.loadargs.jpak !== undefined && this.loadargs.level !== undefined && this.loadargs.mode !== undefined)   {
                var gameCanvas = document.getElementById(_this.canvasname);
                if(PUMPER.Globals.WebGL)    {
                    this.buffcnv    =   PUMPER.createBuffCanvas(gameCanvas.width, gameCanvas.height);
                    this.ctx        =   this.buffcnv.getContext("2d");
                    this.gl         =   (PUMPER.Globals.WebGL) ? ( (PUMPER.Globals.glExperimental)? gameCanvas.getContext("experimental-webgl") : gameCanvas.getContext("webgl") ) : undefined;
                    this.Renderer   =   new PUMPER.GL.Renderer({"canvas": gameCanvas, "gl": this.gl});
                    var img = this.gl.createTexture();
                    img.width = gameCanvas.width; 
                    img.height = gameCanvas.height;
                    img.rwidth = gameCanvas.width;
                    img.rheight = gameCanvas.height;     
                    this.loadobject = new PUMPER.AnimatedObject({"image" : img, "gl" : this.gl});
                }else
                    this.ctx = gameCanvas.getContext("2d");
                this.jpakloader = new JPAK.jpakloader({"file" : this.loadargs.jpak});
                this.jpakloader.onload = function()   {
                    var NXFileName  = (_this.loadargs.location=="ARCADE")?"/CHARTS/"+_this.loadargs.mode+"/"+_this.loadargs.level+".NX":"/CHARTS/"+_this.loadargs.location+"/"+_this.loadargs.mode+"/"+_this.loadargs.level+".NX";
                    var NXFile      = this.GetFileArrayBuffer(NXFileName);
                    var AudioURL    = (_this.compcodec.audio.indexOf("mp3") > -1)?this.GetFileURL("/MUSIC.MP3", "audio/mpeg"):this.GetFileURL("/MUSIC.OGG", "audio/ogg");
                    var TitleIMG    = this.GetFileURL("/TITLE.JPG", "image/jpeg");
                    if(NXFile !== undefined && AudioURL !== undefined && TitleIMG !== undefined)    {
                        _this.soundfile = AudioURL;
                        _this.imagefile = TitleIMG;
                        _this._NX = PUMPER.NXParser(NXFile);
                        var gameCanvas = document.getElementById(_this.canvasname);
                        PUMPER.Globals.PumpGame = new PUMPER.Game({"notedata" : _this._NX, "musicfile" : _this.soundfile, "canvas": gameCanvas, "stats" : _this.gamestats});
                        PUMPER.Globals.PumpGame.AddBackground(_this.imagefile);
                        _this.Animate();                  
                        if(_this.loadargs.autoplay)
                            setTimeout(function() { PUMPER.Globals.PumpGame.Play(); }, 1000);
                    }else
                        alert("Fail to load step - Not valid step file!");
                    
                };
                this.jpakloader.onprogress = function(progress)    {
                    _this.HasProgress = true;
                    _this.LoadedPercent = progress.percent;
                    _this.LoadedBytes = progress.loaded;
                    _this.TotalBytes = progress.total;
                    _this.DrawLoading();
                };
                this.jpakloader.Load();            
            }
            break;
        /**
         * 	This is the ALPHA SSC Loader.
         * 	It will load an SSC file from the URL in loadargs "sscfile" and the chart number by loadargs "chartnumber"
         */
        case PUMPER.TypeSSC:
            if(this.loadargs["sscfile"] !== undefined && this.loadargs["chartnumber"] !== undefined) {
                //this.soundfile = (this.compcodec.audio.indexOf("mp3") > -1)?"ucs/mp3/"+this.loadargs.songid+".mp3":"ucs/ogg/"+this.loadargs.songid+".ogg";
                this.soundfile = "ssc/ogg/"+this.loadargs.sscname+".ogg";
                this.imagefile = "ssc/img/"+this.loadargs.sscname+".png";
                $.ajax({
                    url : _this.loadargs.sscfile,
                    dataType: "text",
                        success : function (data) {
                            _this._SSC = PUMPER.SSCParser(data,_this.loadargs["chartnumber"]);
                            var gameCanvas = document.getElementById(_this.canvasname);
                            PUMPER.Globals.PumpGame = new PUMPER.Game({"notedata" : _this._SSC, "musicfile" : _this.soundfile, "canvas": gameCanvas, "stats" : _this.gamestats});
                            PUMPER.Globals.PumpGame.AddBackground(_this.imagefile);
                            _this.Animate();
                        }
                });
            }else
                PUMPER.debug("No SSC file specifed!");               
            break;
        case PUMPER.TypeSM:
        case PUMPER.TypeSMA:
            PUMPER.debug("Not implemented!");
            break;
    
        default:    
            PUMPER.debug("Invalid load type! Cannot load :(");
    }
};

/*
 * 	This is the Animate Start function. It will set the global variable HighSpeedAnimation and Trigger 
 * 	the global GameLoaderAnimate function.
 */
PUMPER.GameLoader.prototype.Animate =   function()  {
    PUMPER.Globals.HighSpeedAnimation = this.HighSpeedAnimation;
    PUMPER.GameLoaderAnimate();
};

/*
 * 	This will draw the loading screen
 */
PUMPER.GameLoader.prototype.DrawLoading = function()    {
    this.ctx.font = "bold 56px sans-serif";
    this.ctx.textAlign = 'center';
    this.ctx.clearRect(0,0,640,480);
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    if(this.HasProgress)    {
        this.ctx.fillText("Loaded: "+this.LoadedPercent+"%", 320, 260);
        this.ctx.fillText(((this.LoadedBytes/1024)>>0)+"/"+((this.TotalBytes/1024)>>0)+" KB", 320, 320);    
    }else{
        this.ctx.fillText("Loading", 320, 240);
    }
    if(PUMPER.Globals.WebGL)    {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.loadobject.image);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.buffcnv);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.loadobject.GLUpdate();
        this.Renderer.RenderObject(this.loadobject);  
    }
};

/*
 * 	The global function to animate.
 * 	if PUMPER.Globals.HighSpeedAnimation is true,	it will run the HighSpeedRequest function
 * 	otherwise it will call requestAnimFrame.
 */
PUMPER.GameLoaderAnimate = function()   {
    if( PUMPER.Globals.HighSpeedAnimation)
        PUMPER.HighSpeedRequest(PUMPER.GameLoaderAnimate);
    else
    	requestAnimFrame(PUMPER.GameLoaderAnimate);
	PUMPER.Globals.PumpGame.Looper.loop();

};
