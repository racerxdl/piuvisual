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
/*********************** SceneLayer ************************/
PUMPER.SceneLayer = PUMPER.SceneLayer || function ( parameters )    {
    this.Objects = [];
    this.width = parameters.width || 640;
    this.height = parameters.height || 480;
    this.blendtype = parameters.blendtype || "source-over";
};
PUMPER.SceneLayer.prototype.InitLayer       =   function ( )        {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    this.ForceRedraw = false;
};
PUMPER.SceneLayer.prototype.AddObject       =   function ( obj )    {
    this.Objects.push(obj);
};
PUMPER.SceneLayer.prototype.RemoveObject    =   function ( objname ) {
    var i           =   0, 
        len         =   this.Objects.length;
    while(i<len)    {
        if(this.Objects[i].id == objname)   {
            this.Objects.slice(i,1);
            break;
        }
        ++i;
    }
};
PUMPER.SceneLayer.prototype.NeedsUpdate     =   function ( )    {
    if(this.ForceRedraw)    
        return true;
    else{
        var i           =   0, 
            len         =   this.Objects.length,
            need        =   false;
        while(i<len)    {
            need |= this.Objects[i].NeedsRedraw;
            if(need) break;
            ++i;
        }
        return need;
    }
}; 

PUMPER.SceneLayer.prototype.GetCanvas       =   function ( )    { return this.canvas; };
PUMPER.SceneLayer.prototype.GetContext      =   function ( )    { return this.ctx };
PUMPER.SceneLayer.prototype.Update          =   function ( timeDelta )    {
    var i           =   0, 
        len         =   this.Objects.length;
    while(i<len)    {
        this.Objects[i].Update(timeDelta);
        ++i;       
    }
};
PUMPER.SceneLayer.prototype.UpdateCanvas    =   function ( )    {
    var i           =   0, 
        len         =   this.Objects.length;
    if(this.NeedsUpdate())  {
        this.ctx.clearRect(0,0,this.width,this.height);
        while(i<len)    {
            this.Objects[i].Draw(this.ctx);
            ++i;       
        }
    }
};

PUMPER.SceneLayer.prototype.ClearCanvas     =   function ( )    {
    this.ctx.clearRect(0,0,this.width,this.height);
};
