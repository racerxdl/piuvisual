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
PUMP_SELECTOR.AnimatedObject = PUMP_SELECTOR.AnimatedObject || function (parameters) {
    var _this = this;
    
    this.opacity = parameters.opacity || 1;
    this.x = parameters.x || 0;
    this.y = parameters.y || 0;
    this.scale = parameters.scale || {x:1,y:1};
    
    this.layer = parameters.layer || 3;
    
    this.image = parameters.image || new Image();
    
    this.infinite = parameters.infinite || true;
    this.lifetime = parameters.lifetime || 0;
    this.visible  = parameters.visible || true;
    
    this.livedtime = 0;
    this.Drawer = undefined;
    this.id = '_AnimObj_' + Math.floor(Math.random()*1000000) + "_" + (new Date()).getTime();
    console.log("Created new PUMP_SELECTOR::AnimatedObject with id "+this.id);
    
    this.anchor = { x : this.image.width/2 , y : this.image.height / 2 };
    this.dir = false;
    this.Draw = function(ctx)   {
        if(_this.opacity != 0 && _this.visible)  {
            var oldAlpha = ctx.globalAlpha;
            var newHeight   =   (_this.image.height * _this.scale.y) >> 0,
                newWidth    =   (_this.image.width * _this.scale.x) >> 0,
                newX        =   (_this.x + _this.anchor.x - newWidth/2) >> 0,
                newY        =   (_this.y + _this.anchor.y - newHeight/2) >> 0;
           ctx.globalAlpha = _this.opacity;
           ctx.drawImage(_this.image,newX,newY,newWidth, newHeight);
           ctx.globalAlpha = oldAlpha;
           if(PUMP_SELECTOR.Globals.DrawAnchors)   {
                ctx.beginPath();
                ctx.arc(_this.anchor.x+_this.x, _this.anchor.y+_this.y, 4, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#003300';
                ctx.stroke();
             }
        }
    }
    this.Update = parameters.update || function(timeDelta)   {
        //  PlaceHolder
    }
    this.CheckLife = function(timeDelta)    {
        if(!_this.infinite)
            _this.livedtime += timeDelta;
        if( (_this.livedtime >= _this.lifetime) && !_this.infinite) {
            //  Good bye, cruel world! :'(
            _this.Drawer.RemoveAnimObj(_this.id);
            return true;
        }    
        return false;
    }
};

