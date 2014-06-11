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
 * This is the main file of Piuvisual
 */

var PUMPER = function() {};
PUMPER.Version = 1.5;

/**
 * 	Adds a trim prototype if there is no trim on Strings
 */
if (!String.prototype.trim) {
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

    String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

    String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

    String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
};

/*
 * 	Global variables
 */
PUMPER.Globals = {
    DrawAnchors     :   false,			//	Draw Object Anchors (Only for Non-WebGL)
    Drawer          :   undefined,		//	Global Drawer Holder
    Looper          :   undefined,		//	Global Looper Holder
    Skin            :   undefined,		//	Global Skin Holder
    CurrentBPM      :   0,				//	Current Music BPM
    CurrentCombo    :   0,				//	Current Combo
    EnableSound     :   true,			//	Enable Sound
    EnableVideo     :   false,			//	Enable Video
    Double          :   false,			//	Song is Double
    EffectBlock     :   [],				//	Effect Block Holder
    DisableLog      :   false,			//	Disable Logging
    EnableDebug     :   true,			//	Enable Debug
    ObjectsLoaded   :   0,				//	Objects Loaded
    ObjectsToLoad   :   0,				//	Objects to Load
    AllLoaded       :   false,			//	If All is Loaded
    CheckLoaded     :   function()  {	//	Global Function to check if all objects is loaded
        if(PUMPER.Globals.ObjectsLoaded == PUMPER.Globals.ObjectsToLoad)    
            PUMPER.Globals.AllLoaded = true;
        return PUMPER.Globals.AllLoaded;
    },
    WebGL           :   false,			//	Running on WebGL Context
    glExperimental  :   false			//	WebGL is on Experimental Version
};

/*
 * 	Returns true if the browser supports WebGL
 */
function hasWebGL() {
    var canvas = document.createElement('canvas');
    try { gl = canvas.getContext("webgl", { failIfMajorPerformanceCaveat : true }); }catch (x) { gl = null; }
    if (gl === null) {try { gl = canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat : true }); PUMPER.Globals.glExperimental = true; }catch (x) { gl = null; }}
    if(gl) 
        return true; 
    else
        return false; 
}

//PUMPER.Globals.WebGL = hasWebGL();
PUMPER.Globals.WebGL = false; // Disabled for now

/*
 * Logging function
 */
PUMPER.log    =   function(msg)   {
    if(!PUMPER.Globals.DisableLog)
        console.log("PUMPER(log):> "+msg);
};

/*
 * 	Debug Logging Function
 */
PUMPER.debug  =   function(msg)   {
    if(PUMPER.Globals.EnableDebug)
        console.log("PUMPER(debug):> "+msg);
};

/*
 * 	Fixes an int to 3 decimal cases left padding by 7
 */
PUMPER.FixTo3	=	function(val)	{
	return PUMPER.Pad(val.toFixed(3),7);
};

/*
 * 	Left pad the number by size
 */
PUMPER.Pad		=	function(num, size) {
    var s = "000000000000" + num;
    return s.substr(s.length-size);
};

/*
 * 	Updates the infohead if exists
 */
PUMPER.UpdateInfoHead	=	function()	{
    if($("#infohead") !== undefined)
    	$("#infohead").html("BPM: "+PUMPER.Globals.CurrentBPM+" BEAT "+PUMPER.FixTo3(PUMPER.Globals.Game.notedata.CurrentBeat)+" TIME: "+PUMPER.FixTo3(PUMPER.Globals.Music.GetTime())+" BLOCK: "+PUMPER.Pad(PUMPER.Globals.Game.notedata.CurrentBPMChange,3)+" SPEED: "+PUMPER.ScrollSpeed+"x");
};

//  Skin Properties
PUMPER.ArrowSize                = 64;		//	The arrow size. Fixed at 64 by the noteskin
PUMPER.ShowWidth                = 50;		//	The width to draw. This affects the spacing between notes
PUMPER.OffsetY                  = 32;		//	The Offset of the receiver.

//  Game Properties
PUMPER.ScrollSpeed              = 3;		//	The Scroll Speed

//  Note Types
PUMPER.NoteNull                 = 0;
PUMPER.NoteTap                  = 1;
PUMPER.NoteHoldHead             = 2;
PUMPER.NoteHoldBody             = 3;
PUMPER.NoteHoldTail             = 4;
PUMPER.NoteFake                 = 5;
PUMPER.NoteItem                 = 6;
PUMPER.NoteEffect               = 7;
PUMPER.NoteItemFake             = 8;
PUMPER.NoteHoldHeadFake         = 9;
PUMPER.NoteHoldBodyFake         = 10;
PUMPER.NoteHoldTailFake         = 11;

//Note Seed
PUMPER.NoteSeedAction           = 0;
PUMPER.NoteSeedShield           = 1;
PUMPER.NoteSeedChange           = 2; 
PUMPER.NoteSeedAcceleration     = 3; 
PUMPER.NoteSeedFlash            = 4; 
PUMPER.NoteSeedMineTap          = 5; 
PUMPER.NoteSeedMineHold         = 6; 
PUMPER.NoteSeedAttack           = 7;
PUMPER.NoteSeedDrain            = 8;
PUMPER.NoteSeedHeart            = 9; 
PUMPER.NoteSeedSpeed2           = 10;
PUMPER.NoteSeedRandom           = 11; 
PUMPER.NoteSeedSpeed3           = 12;
PUMPER.NoteSeedSpeed4           = 13; 
PUMPER.NoteSeedSpeed8           = 14; 
PUMPER.NoteSeedSpeed1           = 15; 
PUMPER.NoteSeedPotion           = 16; 
PUMPER.NoteSeedRotate0          = 17; 
PUMPER.NoteSeedRotate90         = 18; 
PUMPER.NoteSeedRotate180        = 19; 
PUMPER.NoteSeedRotate270        = 20; 
PUMPER.NoteSeedSpeed_           = 21; 
PUMPER.NoteSeedBomb             = 22; 
PUMPER.NoteSeedHyperPotion      = 23; 

//Modifier Type
PUMPER.ModNonStep         =   0;
PUMPER.ModFreedom         =   1;
PUMPER.ModVanish          =   2;
PUMPER.ModAppear          =   3;
PUMPER.ModHighJudge       =   4;
PUMPER.ModStandBreak      =   5;

/*
 * 	Clones a canvas context
 */
PUMPER.cloneCanvas = function ( canvas ) {
    var newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    context.drawImage(canvas, 0, 0);
    return newCanvas;
};

/*
 *	Creates a canvas buffer
 */
PUMPER.createBuffCanvas = function ( width, height)   {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;   
};

/*
 * 	Crops a image
 */
PUMPER.CropImage = function(image,x,y,width,height)   {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(image,x,y,width,height,0,0,width,height);
      return canvas;
};

/*
 * 	Cut and crop an image
 */

PUMPER.CropImageTarget = function(image,x,y,width,height,targetx,targety,targetw,targeth)   {
      var canvas = document.createElement('canvas');
      canvas.width = targetw;
      canvas.height = targeth;
      var context = canvas.getContext('2d');
      context.drawImage(image,x,y,width,height,targetx,targety,width,height);
      return canvas;
};

/*
 * 	Resizes an Image
 */
PUMPER.ResizeImage = function(image,width,height)   {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(image,0,0,image.width,image.height,0,0,width,height);
      return canvas;
};

PUMPER.PadInt = PUMPER.Pad;	//	Alias

/*
 * 	Gets the compatible codecs for video and audio elements
 */
PUMPER.GetCompatibleCodecs = function()  {
    var testEl = document.createElement( "video" ), testEl2 = document.createElement( "audio" ),
    video=[],audio=[];
    if ( testEl.canPlayType ) {
        // Check for MPEG-4 support
        if("" !== testEl.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ))
            video.push("mpeg4");

        // Check for h264 support
        if("" !== ( testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )|| testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) ))
            video.push("h264");

        // Check for Ogg support
        if("" !== testEl.canPlayType( 'video/ogg; codecs="theora"' ))
            video.push("ogg");

        // Check for Webm support
        if("" !== testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' ))
            video.push("webm");
        
    }
    if (testEl2.canPlayType)    {
        if("" !== testEl2.canPlayType('audio/mpeg'))
            audio.push("mp3");
        if("" !== testEl2.canPlayType('audio/ogg'))
            audio.push("ogg");
    }
    return { "video": video, "audio": audio };
};

/*
 * 	Parses the URL Hashes 
 */
PUMPER.parseHashes = function () {
	HashConfig = { "UCS" : undefined, "Speed" : 2};
	hashes = window.location.hash.split("#");
	hashes = hashes.filter(function(n){return n; });
	for(var hashn in hashes)		{
	    if (hashes.hasOwnProperty(hashn)) {
		    breaked = hashes[hashn].split("=");
		    HashConfig[breaked[0]] = breaked[1];
	    }
	}
	HashConfig.Speed = parseFloat(HashConfig.scrollSpeed);
	if(isNaN(HashConfig.scrollSpeed))	
		HashConfig.scrollSpeed = 2;
	return HashConfig;
};

/*
 * 	Does a 240FPS Refresh rate. Alternative to requestAnimFrame
 */
PUMPER.HighSpeedRequest = (function(){
	  return  function( callback ){
			    window.setTimeout(callback, 1000 / 240);
			  };
	})();

