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
PUMP_SELECTOR.Looper = PUMP_SELECTOR.Looper || function ( parameters )  {
    var _this = this;
    this.Drawer = parameters.drawer;
    
    this.loop = function()  {
        if(_this.Drawer !== undefined)   { 
            _this.Drawer.UpdateAnimations();
            _this.Drawer.DrawVideo();
            if(PUMP_SELECTOR.Globals.DataToLoad > PUMP_SELECTOR.Globals.LoadedData || !PUMP_SELECTOR.LoadStarted) {
                PUMP_SELECTOR.Globals.Loaded = false;
                this.Drawer.DrawLoading();
            }else{
                PUMP_SELECTOR.Globals.Loaded = true;
                _this.Drawer.DrawChannelName();
                _this.Drawer.DrawWheel();
                _this.Drawer.DrawLevelSelector();
                _this.Drawer.DrawPreview();
                _this.Drawer.DrawLevelBar();
                _this.Drawer.DrawArrows();
                //_this.Drawer.DrawSpeed(_this.Speed);
                _this.Drawer.DrawAnimObj(4);
            }
        }
    }
};
