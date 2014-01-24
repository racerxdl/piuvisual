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
PUMP_SELECTOR.SoundPlayer = PUMP_SELECTOR.SoundPlayer || function (parameters) {
    var _athis = this;
    this.idname = "aplay-"+new Date().getUTCMilliseconds();
    this.filename = parameters.filename;
    this.autoplay = parameters.autoplay || false;
    this.audiounit = new Audio();
    
    this.overrideext = parameters.overrideext || false;
    
    //this.audiounit.preload = "auto";
    //this.audiounit.autoplay = this.autoplay;
    this.audiounit.loop = parameters.loop || false;
    //console.debug("Creating PUMP_SELECTOR::AudioPlayer with "+_athis.filename);
    if(this.filename != undefined)  {
        if(this.overrideext)    {
            this.audiounit.src = this.filename;
        }else{
            if(this.audiounit.canPlayType && this.audiounit.canPlayType('audio/mpeg;').replace(/no/, ''))
                this.audiounit.src = this.filename+".mp3";
            else
                this.audiounit.src = this.filename+".ogg";
        }  
    }  
    this.Play = function()  {
        //console.debug("PUMP_SELECTOR::AudioPlayer("+_athis.idname+").Play()");
        if(PUMP_SELECTOR.Globals.EnableSound)   {
            if(_athis.audiounit.readyState != 0)    {
                _athis.audiounit.currentTime = 0;
                _athis.audiounit.play();
            }else{
                clearTimeout(_athis.playtimeout);
                _athis.playtimeout = setTimeout(_athis.Play, 1000);
            }
        }
    };
    this.Pause = function() {
        //console.debug("PUMP_SELECTOR::AudioPlayer("+_athis.idname+").Pause()");
        clearTimeout(_athis.playtimeout);
        _athis.audiounit.pause();
    };
    clearTimeout(_athis.playtimeout);
    if(parameters.autoplay) 
       this.playtimeout = setTimeout(_athis.Play, 1000);
       
};
