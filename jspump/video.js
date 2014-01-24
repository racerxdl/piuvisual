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
/********************** VideoPlayer  ************************/
PUMPER.VideoPlayer = PUMPER.VideoPlayer || function ( parameters ) {
    this.filename = parameters.filename;
    this.autoplay = parameters.autoplay || false;
    this.Enable   = parameters.enable || true;
    this.idname = "vplay-"+new Date().getUTCMilliseconds();

    this.Create();
};
PUMPER.VideoPlayer.prototype.GetVideo = function()  {   return this.videounit; };
PUMPER.VideoPlayer.prototype.Destroy  = function()  {
        $("#"+this.idname).remove();
        $(this.videoHolder).remove();
        this.videounit = new Image();
        this.Created = false;
};
PUMPER.VideoPlayer.prototype.Create = function()    {
        if(!this.Created && this.Enable) {
            if(this.filename == undefined || !this.Enable)    {
                PUMPER.debug("Creating PUMPER::VideoPlayer with Dummy as "+this.idname);
                this.videounit = new Image();
            }else{
                PUMPER.debug("Creating PUMPER::VideoPlayer with "+this.filename+" as "+this.idname);
                this.videoHolder = document.createElement('div');
	            this.videoHolder.setAttribute("style", "display:none;");
	            $(this.videoHolder).html('<video controls loop id="'+this.idname+'"  width="320" height="240" hidden>' + 
		                '<source src="'+this.filename+'.webm" type=video/webm>' + 
                        '<source src="'+this.filename+'.ogg" type=video/ogg>'  + 
                        '<source src="'+this.filename+'.mp4" type=video/mp4>'  + 
                        '</video>');
                $('body').append(this.videoHolder);   
                _vthis.videounit = document.getElementById(this.idname);   
                if(this.autoplay) 
                    setTimeout(this.Play, 1000);
            }
            this.Created = true;
        }else{
            if(!this.Enable)
                 this.videounit = new Image();
        }
    }
PUMPER.VideoPlayer.prototype.Play = function()  {
        PUMPER.debug("PUMPER::VideoPlayer("+this.idname+").Play()");
        if(this.Enable)
            this.videounit.play();
};
PUMPER.VideoPlayer.prototype.Pause = function() {
        PUMPER.debug("PUMPER::VideoPlayer("+this.idname+").Pause()");
        this.videounit.pause();
};
PUMPER.VideoPlayer.prototype.ChangeVideo = function(filename,autoplay) {
        this.filename = filename;
        this.autoplay = autoplay || false;
        this.Destroy();
        this.Create();
};
