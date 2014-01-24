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
PUMP_SELECTOR.Drawer = PUMP_SELECTOR.Drawer || function ( parameters )  {
    var _this = this;
    this.canvas = parameters.canvas;
    this.skin = parameters.skin;
    this.ctx = this.canvas.getContext("2d");

    this.BackgroundVideo = new PUMP_SELECTOR.VideoPlayer({filename:"img/mainbg", autoplay: true});
    this.Preview = new PUMP_SELECTOR.VideoPlayer({autoplay:true});
    this.Wheel = parameters.wheel || PUMP_SELECTOR.Wheel();
    this.LevelBar = new PUMP_SELECTOR.LevelBar({"skin":this.skin});
    this.LevelSelector = parameters.levelselector || PUMP_SELECTOR.LevelSelector({});
    this.AnimatedObjects = [];
    
    this.lastDelta = Date.now();
    /* Layers:
        0:  Drawer.DrawChannelName();
        1:  Drawer.DrawWheel();
        2:  Drawer.DrawPreview();
        3:  DrawArrows();
        4:  Drawer.DrawAnimObj(4);
    */
    this.AddAnimObj = function(obj) { 
        console.log("PUMP_SELECTOR::Drawer::Adding AnimObj "+obj.id);
        obj.Drawer = _this;
        _this.AnimatedObjects.push(obj);
    }
    this.UpdateAnimations = function(timeDelta) {
        var timeDelta = Date.now() - _this.lastDelta;
        _this.lastDelta = Date.now();
        _this.Wheel.Update(timeDelta);
        _this.LevelSelector.Update(timeDelta);
        for(i = 0; i < _this.AnimatedObjects.length; ++i )  {
            _this.AnimatedObjects[i].Update(timeDelta);
            if(_this.AnimatedObjects[i].CheckLife(timeDelta))
                --i;  
        }
        _this.LevelBar.Update(timeDelta);
    }
    this.DrawAnimObj = function(layer)   {
        for(i = 0; i < _this.AnimatedObjects.length; ++i ) {
            if(_this.AnimatedObjects[i].layer == layer) {
                _this.AnimatedObjects[i].Draw(_this.ctx);
            }
        }
    }
    
    this.RemoveAnimObj = function(objname)  {
        for(var i=0;i<_this.AnimatedObjects.length;i++) {
            if(_this.AnimatedObjects[i].id == objname)  {
                console.log("PUMP_SELECTOR::Drawer::Removing AnimObj "+objname);
                _this.AnimatedObjects.slice(i,1);
                break;
            }
        }
    }
    
    this.UpdateHandlers = function()    {
        _this.Preview.Enable = PUMP_SELECTOR.Globals.EnableVideoPreview;
        if(!_this.Preview.Enable)
            _this.Preview.Destroy();
        else
            _this.Preview.Create();
        if(PUMP_SELECTOR.Globals.EnableSound)
            PUMP_SELECTOR.Globals.SoundManager.PlayMusic(PUMP_SELECTOR.Globals.SoundManager.Music.filename);
        else
            PUMP_SELECTOR.Globals.SoundManager.PauseMusic();
    }
    
    this.DrawSongPreview = function(songImage)  {
        _this.ctx.drawImage(songImage, 132, 56, 376, 192);
    }
    this.DrawLevelBar = function() {
        _this.LevelBar.Draw(_this.ctx);
    }
    this.DrawWheel = function () {
        _this.Wheel.Draw(_this.ctx);
        _this.DrawAnimObj(1);
    }
    this.DrawLevelSelector = function () {
        _this.LevelSelector.Draw(_this.ctx);
    }
    this.DrawChannelName = function()  {
        _this.ctx.drawImage(_this.skin.BASE.CHANNEL, 175, 4);
        _this.skin.DrawChannelName(_this.ctx,120,11,PUMP_SELECTOR.Globals.SelectedChannel);
        _this.DrawAnimObj(0);
    }
    this.DrawPreview = function()   {
        //_this.ctx.drawImage(_this.skin.Base, 486, 85, 22, 165, 111, 68, 22, 165);
        //_this.ctx.drawImage(_this.skin.Base, 486, 85, 22, 165, 112+394, 68, 22, 165);
        _this.ctx.drawImage(_this.skin.BASE.FRAME, 120, 50);
        
        _this.DrawAnimObj(2);
    } 
    this.DrawArrows = function()    {
        _this.ctx.drawImage(_this.skin.BASE.UPLEFTA,         0,      0);
        _this.ctx.drawImage(_this.skin.BASE.UPRIGHTA,   640-78,      0);
        _this.ctx.drawImage(_this.skin.BASE.DOWNLEFTA,       0, 480-78);
        _this.ctx.drawImage(_this.skin.BASE.DOWNRIGHTA, 640-78, 480-78);
        _this.DrawAnimObj(3);
    }
    this.DrawVideo = function() {   
        _this.ctx.drawImage(_this.BackgroundVideo.GetVideo(),0,0,640,480);
        if(PUMP_SELECTOR.Globals.Loaded)    {
            _this.ctx.fillStyle = "rgb(0,0,0)";
            _this.ctx.fillRect (132, 56, 376, 192);
            _this.ctx.drawImage(_this.Wheel.GetSelected().preview, 	132, 56, 376, 192);
            if(PUMP_SELECTOR.Globals.EnableVideoPreview)
                _this.ctx.drawImage(_this.Preview.GetVideo(), 	132, 56, 376, 192);		
        }
    }
    
    this.DrawLoading = function()   {
        _this.ctx.font = "bold 56px sans-serif";
        _this.ctx.textAlign = 'center';
        _this.ctx.fillText("Loading", 320, 200);
        var percent = Math.round(100 * (PUMP_SELECTOR.Globals.LoadedData /  PUMP_SELECTOR.Globals.DataToLoad));
        _this.ctx.fillText("Loaded: "+percent+"%", 320, 260);
        _this.ctx.fillText(((PUMP_SELECTOR.Globals.LoadedData/1024)>>0)+"/"+((PUMP_SELECTOR.Globals.DataToLoad/1024)>>0), 320, 320);
    }
};
