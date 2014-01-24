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
PUMP_SELECTOR.LevelBar = PUMP_SELECTOR.LevelBar || function (parameters) {
    var _this = this;
    this.skin = parameters.skin;
    this.levellist = [];
    this.scale = 0.82;
    this.targetscale = this.scale;
    this.movespeed = 0.01;
    //0,6910299
    this.UpdateLevelList = function(levellist)  {
        _this.levellist = levellist;
    } 
    this.Draw = function(ctx)  {
        var width  = 602 * _this.scale;
        var height = 52  * _this.scale;
        var newx   = 320 - width/2;
        var newy   = 240 - height/2 + 38;
        var circlesize = 44* _this.scale
        ctx.drawImage(_this.skin.LEVELBAR.LEVELBAR, newx, newy, width, height);
        for(var i=0;i<_this.levellist.length;i++)   {
            var lvl = _this.levellist[i];
             ctx.drawImage(_this.skin.LEVELBAR[lvl.type.toUpperCase()],0,0,44,44,newx+i*((4*_this.scale)+circlesize)+(15*_this.scale),newy+(5*_this.scale),circlesize,circlesize);
             _this.skin.DrawBigNumber(ctx, newx+i*((4*_this.scale)+circlesize)+(21*_this.scale), newy+(20*_this.scale), lvl.level, 15*_this.scale, 2);
        }  
        if(PUMP_SELECTOR.Globals.Scene == PUMP_SELECTOR.Scenes.SELECT_CHART)      
            _this.skin.DrawP1Selector(ctx,newx+(5*_this.scale) + PUMP_SELECTOR.Globals.SelectedChart *((4*_this.scale)+circlesize) ,newy-(5*_this.scale),_this.scale+0.05); 
    }
    this.Update = function(timeDelta)   {
        var delta = _this.targetscale - _this.scale;
        if(delta == 0) 
            _this.scale = _this.targetscale;
        else    
            _this.scale += timeDelta * delta * _this.movespeed;    
    }
}
