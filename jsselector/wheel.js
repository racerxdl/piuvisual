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
PUMP_SELECTOR.Wheel = PUMP_SELECTOR.Wheel || function ( parameters ) {
    var _this = this;
    
    this.skin = parameters.skin;
    this.selectedindex = 0;
    this.lastselectedindex = 0;
    
    this.songlist = parameters.songlist || [];
    this.items = [];
    this.selector = undefined;
    
    this.pos = parameters.pos || { x: 0, y: 0};
    this.targetx = this.pos.x;
    this.targety = this.pos.y;
    this.movespeed = 0.01;
    this.visible = true;
    
    for(var i=0;i<this.songlist.length;i++) {
        var song = this.songlist[i];
        this.items.push(new PUMP_SELECTOR.WheelItem({"image": song.songid, targetx : this.pos.x, targety : this.pos.y,x : this.pos.x, y : this.pos.y, visible : false, "skin" : this.skin}));
    }
    
    this.AddAnimObj =   function(obj)   {
         this.animitems.push(obj);
    }
    this.UpdatePosition = parameters.updateposition || function () { };
    
    this.GetItem = function(idx)   {
        var orgidx = idx;
        idx = (idx<0) ? _this.songlist.length + idx  : ( idx >= _this.songlist.length ? idx - _this.songlist.length  : idx );
        return _this.items[idx];
    }
    this.GetSelected = function()   {
        return _this.GetItem(_this.selectedindex);
    }
    this.GetIndex = function(idx)  {
        return (idx<0) ? _this.songlist.length + idx  : ( idx >= _this.songlist.length ? idx - _this.songlist.length  : idx );
    }
    this.UpdateItems = function(timeDelta)  {
        for(var i=0;i<_this.items.length;i++)   
            _this.items[i].Update(timeDelta);
        if(_this.selector != undefined)
            _this.selector.Update(timeDelta);             
    }
    this.Draw = function(ctx)   {
        if(_this.visible)   {
            for(var i=-6;i<6;i++)    {
                _this.GetItem(_this.selectedindex + i).Draw(ctx);
            } 
            ctx.drawImage(_this.skin.BASE["MUSICFRAME"], this.pos.x-5, this.pos.y-2);
            _this.skin.DrawNumber(ctx,this.pos.x+42, this.pos.y+8,_this.selectedindex+1);
            _this.skin.DrawNumber(ctx,this.pos.x+76, this.pos.y+8,_this.items.length);    
            if(_this.selector != undefined)
                _this.selector.Draw(ctx);            
        }
    }
    this.LoadAllItems = function() {
        for(var i=0;i<_this.items.length;i++)   
            _this.items[i].Load();          
    }  
    
    this.UpdatePositions = function()    {
         var lastdelta = (_this.lastselectedindex - _this.selectedindex);
         if(lastdelta > 1)
            lastdelta = -1;
         else if(lastdelta <-1)
            lastdelta = 1;
            
         for(var i=-6;i<6;i++)    {
            var idx = _this.selectedindex + i,
            item = _this.GetItem(idx),
            x = _this.pos.x + i*item.width+10*i,
            y = _this.pos.y,
            lastx = _this.pos.x + (i-lastdelta)*item.width+10*(i-lastdelta),
            lasty = _this.pos.y;
            item.x = lastx;
            item.y = lasty;
            item.MoveTo(x,y);
        }            
    }
    this.RefreshPositions = function()  {
         for(var i=-6;i<6;i++)    {
            var idx = _this.selectedindex + i,
            item = _this.GetItem(idx),
            x = _this.pos.x + i*item.width+10*i,
            y = _this.pos.y;
            item.Move(x,y);
        }      
        _this.selector.Move(_this.pos.x-10,_this.pos.y);
    }
    this.nextsong = function()  {
        _this.lastselectedindex = _this.selectedindex;
        _this.selectedindex += 1;
        if(_this.selectedindex == _this.songlist.length)
            _this.selectedindex = 0;
        _this.UpdatePosition(_this.selectedindex);
        _this.UpdatePositions();
    }
    this.prevsong = function()  {
        _this.lastselectedindex = _this.selectedindex;
        _this.selectedindex -= 1;
        if(_this.selectedindex < 0 )
            _this.selectedindex = _this.songlist.length-1;   
        _this.UpdatePosition(_this.selectedindex);
        _this.UpdatePositions();
    }
    this.MoveTo = function(x,y) {
        _this.targetx = x;
        _this.targety = y;
    }
    this.Move = function(x,y)   {
        _this.targetx = x;
        _this.targety = y;
        _this.pos.x = x;
        _this.pos.y = y;
    }
    this.Update = function(timeDelta)   {
        var deltaX = _this.targetx - _this.pos.x,
            deltaY = _this.targety - _this.pos.y;
        if(Math.round(deltaX) == 0) 
            _this.pos.x = _this.targetx;
        else    
            _this.pos.x += timeDelta * deltaX * _this.movespeed;
        if(Math.round(deltaY) == 0)
            _this.pos.y = _this.targety;
        else
            _this.pos.y += timeDelta * deltaY * _this.movespeed;
        if(_this.pos.x != _this.targetx || _this.pos.y != _this.targety)
            _this.RefreshPositions();
        _this.UpdateItems(timeDelta);
    }
    //this.LoadAllItems();
    this.UpdatePositions();
};
