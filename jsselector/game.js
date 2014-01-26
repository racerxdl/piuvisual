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
PUMP_SELECTOR.Stop      =   false;
PUMP_SELECTOR.LoadNX    =   function ( speed, songid, mode, level, location )    {
	PUMPER.ScrollSpeed = (speed!==undefined)?speed:3;
	PUMPER.JPAKFile    = "nx20/"+songid+ ".jpak";
	PUMPER.JMode       = mode;
	PUMPER.Level       = level;
	PUMPER.Location    = location || "ARCADE";
	PUMP_SELECTOR.Stop = true;
    var PumpGame = new PUMPER.GameLoader({"loadtype" : PUMPER.TypeJPAKNX, "loadargs" : {"jpak":PUMPER.JPAKFile,"mode" : PUMPER.JMode, "level" : PUMPER.Level, "location" : PUMPER.Location, "autoplay" : true}, "canvasname" : "gamescreen", "gamestats" : GameStats}); 
    PumpGame.Load();
    return PumpGame;
};
PUMP_SELECTOR.Game = PUMP_SELECTOR.Game || function ( parameters ) {
    var _this = this;
    this.canvas = parameters.canvas;
    this.Looper = new PUMP_SELECTOR.Looper({});
    $.getJSON( "getlist.php", function( data ) {
        _this.songlist = data;
        console.log("PUMP_SELECTOR::Game::Loaded songlist. "+data.length+" songs.");
        _this.skin   = new PUMP_SELECTOR.Skin();
        _this.Wheel  = new PUMP_SELECTOR.Wheel({"songlist" : _this.songlist, "updateposition" : _this.UpdatePosition, skin : _this.skin, pos : {x: 250, y:306 } });
        _this.LevelSelector = new PUMP_SELECTOR.LevelSelector({"skin":_this.skin, pos : {x: 200, y:550 }});
        _this.Drawer = new PUMP_SELECTOR.Drawer({"canvas" : _this.canvas, "wheel" : _this.Wheel, "levelselector" : _this.LevelSelector, "skin" : _this.skin});
        _this.Looper = new PUMP_SELECTOR.Looper({"drawer" : _this.Drawer}); 
        _this.Looper.Speed = 2;
        _this.SoundManager = new PUMP_SELECTOR.SoundManager();
        PUMP_SELECTOR.Globals.SoundManager = _this.SoundManager;
        PUMP_SELECTOR.Globals.Drawer = _this.Drawer;
        PUMP_SELECTOR.Globals.Looper = _this.Looper;
        PUMP_SELECTOR.Globals.Wheel  = _this.Wheel;
        _this.StartEvent = new PUMP_SELECTOR.OneTimeEvent({ 
            taskfunction : function () { console.log("PUMP_SELECTOR::Game Loaded");_this.UpdatePosition(0);  delete(_this.StartEvent);},
            conditionfunction : function() { PUMP_SELECTOR.Globals.Loaded = (PUMP_SELECTOR.Globals.DataToLoad == PUMP_SELECTOR.Globals.LoadedData) ; return PUMP_SELECTOR.Globals.Loaded; } 
        });
        PUMP_SELECTOR.LoadStarted = true;
    });
    this.UpdatePosition = function(songn)    {
        console.log("PUMP_SELECTOR::Game::Changing song to: "+_this.songlist[songn].name);
        if(_this.songlist[songn].mission || _this.songlist[songn].training)   {
            _this.Drawer.Preview.ChangeVideo("videos/pv/"+_this.songlist[songn].songid, true);
            _this.SoundManager.PlayMusic("videos/pa/"+_this.songlist[songn].songid);
        }else{
            _this.Drawer.Preview.ChangeVideo("videos/pv/"+_this.songlist[songn].name, true);
            _this.SoundManager.PlayMusic("videos/pa/"+_this.songlist[songn].name);
        }
        _this.Drawer.LevelBar.UpdateLevelList(_this.songlist[songn].levellist);
        PUMP_SELECTOR.Globals.SelectedSong = _this.songlist[songn];
        var oldchannel = PUMP_SELECTOR.Globals.SelectedChannel;
        if(_this.songlist[songn].mission)
            PUMP_SELECTOR.Globals.SelectedChannel = "Mission Zone";
        else if(_this.songlist[songn].training)
            PUMP_SELECTOR.Globals.SelectedChannel = "Skill Up Zone";
        else if(_this.songlist[songn].mode == "Normal")
            PUMP_SELECTOR.Globals.SelectedChannel = _this.songlist[songn].game;
        else
            PUMP_SELECTOR.Globals.SelectedChannel = _this.songlist[songn].mode;
        if(oldchannel != PUMP_SELECTOR.Globals.SelectedChannel)
            _this.SoundManager.ChannelSound[PUMP_SELECTOR.Globals.SelectedChannel].Play();
    };

    this.SpeedUpCount   = 0;
    this.SpeedDownCount = 0;
    this.SpeedUpCode   = [81,69,81,69,83]; // Q E Q E S
    this.SpeedDownCode = [69,81,69,81,83]; // E Q E Q S
   
    this.DisablePreviewVideo = function()   {
        console.log("PUMP_SELECTOR::Game::DisablePreviewVideo");
        PUMP_SELECTOR.Globals.EnableVideoPreview = false;
        _this.Drawer.UpdateHandlers();
    };
    this.EnablePreviewVideo = function()   {
        console.log("PUMP_SELECTOR::Game::EnablePreviewVideo");
        PUMP_SELECTOR.Globals.EnableVideoPreview = true;
        _this.Drawer.UpdateHandlers();
    };
    
    this.EnableSound    =   function()  {
        console.log("PUMP_SELECTOR::Game::EnableSound");
        PUMP_SELECTOR.Globals.EnableSound = true;
        _this.Drawer.UpdateHandlers();
    };
    this.DisableSound    =   function()  {
        console.log("PUMP_SELECTOR::Game::DisableSound");
        PUMP_SELECTOR.Globals.EnableSound = false;
        _this.Drawer.UpdateHandlers();
    };
    this.OnKeyUp   = function(event)    {
        switch(event.keyCode)   {
            case 17: // Ctrl
                PUMP_SELECTOR.Globals.PressedKeys["CTRL"] = false;
                break;
            case 16: // Shift
                PUMP_SELECTOR.Globals.PressedKeys["SHIFT"] = false;
                break;                
        }
    
    }
    this.OnKeyDown = function(event)    {
        if(PUMP_SELECTOR.Globals.Loaded)    {
            var event = event || window.event;
            var supresskey = false;
            if (_this.SpeedUpCode[_this.SpeedUpCount] == event.keyCode)  {
                _this.SpeedUpCount += 1;
                if(_this.SpeedUpCount == _this.SpeedUpCode.length)  {   // Bingo! We got an code!
                    _this.SoundManager.PlayCMDSet();
                    _this.SpeedUpCount = 0;
                    supresskey = true;
                    var lastspeed = _this.Looper.Speed;
                    _this.Looper.Speed +=1
                    if(_this.Looper.Speed == 7)
                        _this.Looper.Speed = 1;
                        
                    _this.skin.BASE.Objs["SPEED"+lastspeed].visible = false;
                    _this.skin.BASE.Objs["SPEED"+_this.Looper.Speed].StartAnim();
                    console.log("PUMP_SELECTOR::Game::Code(SpeedUp): "+_this.Looper.Speed);
                }
            }else
                _this.SpeedUpCount  = 0;
                
            if (_this.SpeedDownCode[_this.SpeedDownCount] == event.keyCode)  {
                _this.SpeedDownCount += 1;
                if(_this.SpeedDownCount == _this.SpeedDownCode.length)  {   // Bingo! We got an code!
                    _this.SoundManager.PlayCMDSet();
                    _this.SpeedDownCount = 0;
                    supresskey = true;
                    var lastspeed = _this.Looper.Speed;
                    _this.Looper.Speed -=1
                    if(_this.Looper.Speed == 0)
                        _this.Looper.Speed = 6;
                        

                    _this.skin.BASE.Objs["SPEED"+lastspeed].visible = false;
                    _this.skin.BASE.Objs["SPEED"+_this.Looper.Speed].StartAnim();
                    console.log("PUMP_SELECTOR::Game::Code(SpeedDown): "+_this.Looper.Speed);
                }
            }else
                _this.SpeedDownCount  = 0;
            if(!supresskey) {
                switch(PUMP_SELECTOR.Globals.Scene)  {
                    case PUMP_SELECTOR.Scenes.SELECT_SONG:
                        switch(event.keyCode)   {
                            case 81: // Q
                                _this.SoundManager.PlayBack();
                                return false;
                                break;
                            case 69: // E
                                _this.SoundManager.PlayBack();
                                return false;
                                break;
                            case 83: // S
                                if(PUMP_SELECTOR.Globals.PressedKeys["CTRL"])   {   //  Toggle Sound
                                    if(PUMP_SELECTOR.Globals.EnableSound)   
                                        _this.DisableSound();
                                    else
                                        _this.EnableSound();
                                }else{
                                    if(!supresskey)
                                        _this.SoundManager.PlayPress();
                                    _this.Drawer.Wheel.MoveTo(250,550); 
                                    _this.Drawer.LevelSelector.MoveTo(200,306); 
                                    _this.Drawer.LevelBar.targetscale = 1;
                                    PUMP_SELECTOR.Globals.Scene = PUMP_SELECTOR.Scenes.SELECT_CHART;
                                }
                                return false;
                                break;
                            case 37: // Left Key
                            case 90: // Z
                                _this.Wheel.prevsong();
                                _this.SoundManager.PlaySwitch();
                                return false;
                                break;
                            case 39: // Right Key
                            case 67: // C
                                _this.Wheel.nextsong();
                                _this.SoundManager.PlaySwitch();
                                return false;
                                break;
                            case 17: // Ctrl
                                PUMP_SELECTOR.Globals.PressedKeys["CTRL"] = true;
                                return false;
                                break;
                            case 16: // Shift
                                PUMP_SELECTOR.Globals.PressedKeys["SHIFT"] = true;
                                return false;
                                break
                            case 80: // P
                             if(PUMP_SELECTOR.Globals.PressedKeys["CTRL"])   {   //  Toggle Sound
                                    if(PUMP_SELECTOR.Globals.EnableVideoPreview)   
                                        _this.DisablePreviewVideo();
                                    else
                                        _this.EnablePreviewVideo();
                             }
                             return false;
                            default:
                                console.log("PUMP_SELECTOR::Game unhandled keycode: "+event.keyCode);
                        }
                        break;
                    case PUMP_SELECTOR.Scenes.SELECT_CHART:
                        switch(event.keyCode)   {
                            case 81: // Q
                            case 69: // E
                                _this.SoundManager.PlaySwitch();
                                if(PUMP_SELECTOR.Globals.ChartSelected)
                                    PUMP_SELECTOR.Globals.ChartSelected = false;
                                else{
                                    PUMP_SELECTOR.Globals.Scene = PUMP_SELECTOR.Scenes.SELECT_SONG; 
                                    _this.Drawer.Wheel.MoveTo(250,306); 
                                    _this.Drawer.LevelSelector.MoveTo(200,550); 
                                    _this.Drawer.LevelBar.targetscale = 0.82;
                                }
                                return false;
                                break;
                            case 83: // S
                                if(PUMP_SELECTOR.Globals.PressedKeys["CTRL"])   {   //  Toggle Sound
                                    if(PUMP_SELECTOR.Globals.EnableSound)   
                                        _this.DisableSound();
                                    else
                                        _this.EnableSound();
                                }else{
                                    if(!supresskey)
                                        _this.SoundManager.PlayPress();
                                    if(PUMP_SELECTOR.Globals.ChartSelected) {
                                        //alert("Open Song: "+PUMP_SELECTOR.Globals.SelectedSong.songartist+" - "+PUMP_SELECTOR.Globals.SelectedSong.songname+" -> Chart Level: "+PUMP_SELECTOR.Globals.SelectedSong.levellist[PUMP_SELECTOR.Globals.SelectedChart].level+" -> Scroll Speed: "+_this.Looper.Speed);
                                        var SelSong = PUMP_SELECTOR.Globals.SelectedSong;
                                        var SelLevel = PUMP_SELECTOR.Globals.SelectedChart;
                                        var Location = (SelSong.mission)?"MISSION":( (SelSong.training)?"TRAINING":"ARCADE");
                                        var Level = SelSong.levellist[SelLevel].reallevel;
                                        var Mode  = SelSong.levellist[SelLevel].type.toUpperCase();
                                        PUMP_SELECTOR.Globals.SoundManager.Music.Pause();
                                        alert("Function disabled on this sample");
                                        //PUMP_SELECTOR.Globals.PumpGame = PUMP_SELECTOR.LoadNX( _this.Looper.Speed, SelSong.songid, Mode, Level, Location );
                                    }else
                                        PUMP_SELECTOR.Globals.ChartSelected = true;
                                    
                                    //_this.Drawer.Wheel.MoveTo(250,550); 
                                    //PUMP_SELECTOR.Globals.Scene = PUMP_SELECTOR.Scenes.SELECT_CHART;  
                                }
                                return false;
                                break;
                            case 37: // Left Key
                            case 90: // Z
                                _this.LevelSelector.prevlevel();
                                _this.SoundManager.PlaySwitch();
                                PUMP_SELECTOR.Globals.ChartSelected = false;
                                return false;
                                break;
                            case 39: // Right Key
                            case 67: // C
                                _this.LevelSelector.nextlevel();
                                _this.SoundManager.PlaySwitch();
                                PUMP_SELECTOR.Globals.ChartSelected = false;
                                return false;
                                break;
                            case 17: // Ctrl
                                PUMP_SELECTOR.Globals.PressedKeys["CTRL"] = true;
                                return false;
                                break;
                            case 16: // Shift
                                PUMP_SELECTOR.Globals.PressedKeys["SHIFT"] = true;
                                return false;
                                break
                        }
                        break;
                }
             }
         }
    };
    
    document.onkeydown = this.OnKeyDown;
    document.onkeyup   = this.OnKeyUp;
};
