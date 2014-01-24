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
PUMP_SELECTOR.VideoPlayer = PUMP_SELECTOR.VideoPlayer || function ( parameters ) {
    var _vthis = this;
    this.filename = parameters.filename;
    this.autoplay = parameters.autoplay || false;
    this.Enable   = parameters.enable || true;
    this.idname = "vplay-"+new Date().getUTCMilliseconds();
    this.GetVideo = function()  {
        return _vthis.videounit;
    }
    this.Destroy = function()   {
        $("#"+_vthis.idname).remove();
        $(_vthis.videoHolder).remove();
        _vthis.videounit = new Image();
        _vthis.Created = false;
    }
    this.Create = function()    {
        if(!_vthis.Created && _vthis.Enable) {
            if(_vthis.filename == undefined || !_vthis.Enable)    {
                //console.debug("Creating PUMP_SELECTOR::VideoPlayer with Dummy as "+_vthis.idname);
                _vthis.videounit = new Image();
            }else{
                //console.debug("Creating PUMP_SELECTOR::VideoPlayer with "+_vthis.filename+" as "+_vthis.idname);
                _vthis.videoHolder = document.createElement('div');
	            _vthis.videoHolder.setAttribute("style", "display:none;");
	            $(_vthis.videoHolder).html('<video controls loop id="'+_vthis.idname+'"  width="320" height="240" hidden>' + 
		                '<source src="'+_vthis.filename+'.webm" type=video/webm>' + 
                        '<source src="'+_vthis.filename+'.ogg" type=video/ogg>'  + 
                        '<source src="'+_vthis.filename+'.mp4" type=video/mp4>'  + 
                        '</video>');
                $('body').append(_vthis.videoHolder);   
                _vthis.videounit = document.getElementById(_vthis.idname);   
                if(_vthis.autoplay) 
                    setTimeout(_vthis.Play, 1000);
            }
            _vthis.Created = true;
        }else{
            if(!_vthis.Enable)
                 _vthis.videounit = new Image();
        }
    }
    this.Play = function()  {
        //console.log("PUMP_SELECTOR::VideoPlayer("+_vthis.idname+").Play()");
        if(_vthis.Enable)
            _vthis.videounit.play();
    };
    this.Pause = function() {
        //console.log("PUMP_SELECTOR::VideoPlayer("+_vthis.idname+").Pause()");
        _vthis.videounit.pause();
    };
    this.ChangeVideo = function(filename,autoplay) {
        _vthis.filename = filename;
        _vthis.autoplay = autoplay || false;
        _vthis.Destroy();
        _vthis.Create();
    };
    this.Create();
};
