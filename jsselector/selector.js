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
/**
 *	@author Lucas Teske - lucas at teske dot net dot br
 */

var PUMP_SELECTOR = PUMP_SELECTOR || { VERSION: 1.0 };

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

self.console = self.console || {
	info: function () {},
	log: function () {},
	debug: function () {},
	warn: function () {},
	error: function () {}
};

String.prototype.trim = String.prototype.trim || function () {

	return this.replace( /^\s+|\s+$/g, '' );

};
PUMP_SELECTOR.Scenes = {
    "SELECT_SONG" : 0,
    "SELECT_CHART" : 1
}
PUMP_SELECTOR.Globals = {
    LoadStarted : false,
    LoadedData : 0,
    DataToLoad : 1,
    NumberOfSongs : 0,
    Loaded : false,
    SelectedChannel : "All Tunes",
    SelectedChart   :   0,
    ChartSelected   :   false,
    EnableVideoPreview : true,
    EnableSound : true,
    DrawAnchors : false,
    PressedKeys : {
        "CTRL" : false,
        "SHIFT" : false
    },
    Scene : PUMP_SELECTOR.Scenes.SELECT_SONG,
    SelectedSong : {}
}
PUMP_SELECTOR.CropImage = function(image,x,y,width,height)   {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(image,x,y,width,height,0,0,width,height);
      return canvas;
}
PUMP_SELECTOR.ResizeImage = function(image,width,height)   {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(image,0,0,image.width,image.height,0,0,width,height);
      return canvas;
}

PUMP_SELECTOR.PadInt = function (num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
PUMP_SELECTOR.GetCompatibleCodecs = PUMP_SELECTOR.GetCompatibleCodecs || function()  {
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
    delete(testEl);
    delete(testEl2);
    return { "video" : video, "audio" : audio };
}
