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
/************************* Drawer **************************/
/* Layers:
    0:  Background Layer
    1:  Background Sprite Layer
    2:  Game Note Layer
    3:  Sprite UI Layer
    4:  Effect Layer
    


**Z NOT USED FOR NOW**  
    On WebGL Layers are defined by Z-index. So here is what I defined:
    
    0: -100
    1: -50
    2: -25
    3: -12.5
    4: 0  
    The Z distance between layers are for ordering locals.

PUMPER.GL.LayerZ = { 
    "0" : -100,     //  Background Layer  
    "1" : -50,      //  Background Sprite Layer
    "2" : -25,      //  Game Note Layer
    "3" : -12.5,    //  Sprite UI Layer
    "4" : 0         //  Effect Layer
}; 
*/
PUMPER.GL.Drawer = PUMPER.GL.Drawer || function ( parameters )  {
    this.canvas             =   parameters.canvas;
    this.skin               =   parameters.skin;
    this.gl                 =   parameters.gl;
    this.Renderer           =   new PUMPER.GL.Renderer({"canvas": this.canvas, "gl": this.gl});
    this.SceneLayers        =   [ ];                          // PUMPER.SceneLayer
    this.lastDelta          =   Date.now();
    this.NoteBlock          =   [];
    this.HoldBuffer         =   [[],[],[],[],[],[],[],[],[],[]];
    
    this.Notes              =   [ [], [], [] ];
    this.NotesIdx           =   0;
    this.NotesTexture       =   undefined;
    this.Longs              =   [ [], [], [] ];
    this.LongsIdx           =   0;
    this.LongsTexture       =   undefined;
    this.Items              =   [ [], [], [] ];
    this.ItemsIdx           =   0;
    this.ItemsTexture       =   undefined;
    this.LayerObjects       =   [ [], [], [], [], [] ];
        
};

PUMPER.GL.Drawer.prototype.Clear        =   function()  {
    this.Notes[0].length = 0;
    this.Notes[1].length = 0;
    this.Notes[2].length = 0;
    this.NotesIdx = 0;
    this.Items[0].length = 0;
    this.Items[1].length = 0;
    this.Items[2].length = 0;
    this.ItemsIdx = 0;
};

PUMPER.GL.Drawer.prototype.AddObj      =   function(obj, layer) {
    layer = layer !== undefined ? layer : "2"; 
    //PUMPER.debug("PUMPER::Drawer::Adding AnimObj "+obj.id+" in layer "+layer);
    obj.Drawer = this;
    this.LayerObjects[layer].push(obj);
};
PUMPER.GL.Drawer.prototype.DrawNotes   =   function() {
    var i           =   0, 
        len         =   this.NoteBlock.length,
        holdcount   =   0
        k           =   0
        klen        =   0;  
    while(i<len)    {
        var row = this.NoteBlock[i],
            n = 0, nlen = row.notes.length;
            while(n < nlen) {
                var note = row.notes[n];
                if(note.type == PUMPER.NoteHoldHead || note.type == PUMPER.NoteHoldHeadFake)    { 
                    if(this.HoldBuffer[n].length == 0)     {
                        this.HoldBuffer[n].push({"beatfrom":row.rowbeat, "beatend" : note.beatend, "pos" : n, "opacity" : note.opacity, "y" : row.y, "seed" : note.seed, "attr" : note.attr});
                    }else{
                        var found = false;
                        klen=this.HoldBuffer[n].length;
                        k=0;
                        while(k<klen)   {
                            if(this.HoldBuffer[n][k].beatfrom == row.rowbeat)   {
                                this.HoldBuffer[n][k].y = row.y;
                                //this.HoldBuffer[n][k].opacity = note.opacity;
                                found = true;
                                break;
                            }
                            ++k;
                        }
                        if(!found)
                            this.HoldBuffer[n].push({"beatfrom":row.rowbeat, "beatend" : note.beatend, "pos" : n, "opacity" : note.opacity, "y" : row.y, "seed" : note.seed, "attr" : note.attr});
                    }
                }else if(note.type == PUMPER.NoteHoldBody)   {
                    //if(row.y >= 0 && row.y <= PUMPER.OffsetY-3)
                    if(PUMPER.Globals.NoteData.BeatInCutZone(row.rowbeat, row))
                        PUMPER.Globals.EffectBlock[n].Start(PUMPER.Globals.NoteData.CurrentBeat);
                }
                if(note.type == PUMPER.NoteEffect)
                    this.ProcessEffect(note.opacity, n, row.y, note.rotation, note.seed, note.attr)
                else if(note.type != PUMPER.NoteHoldBody && note.type != PUMPER.NoteNull)  {    
                    if(PUMPER.Globals.NoteData.BeatInCutZone(row.rowbeat, row) && note.type != PUMPER.NoteItemFake && note.type != PUMPER.NoteFake)   {
                    //if(row.y >= 0 && row.y <= PUMPER.OffsetY-3 && note.type != PUMPER.NoteItemFake && note.type != PUMPER.NoteFake)   {
                            PUMPER.Globals.EffectBlock[n].Start(PUMPER.Globals.NoteData.CurrentBeat);
                    }else{
                        this.DrawNote(note.type, note.opacity, n, row.y, note.rotation, note.seed, note.attr);
                    }
                }
                ++n;
            }
        ++i;
    }
    i = 0;
    len = PUMPER.Globals.Double ? 10 : 5;
    while(i<len)    {
        var HoldK   =   this.HoldBuffer[i],
            lenK    =   HoldK.length,
            k       =   0,
            y       =   0;
        while(k<lenK)   {
            var Hold = HoldK[k];
            if(Hold.beatend < PUMPER.Globals.NoteData.CurrentBeat && Hold.beatend !== undefined)    {
                // You dont belong to us anymore!
                HoldK.splice(k, 1);
                --lenK;
                continue;
            }
            if(Hold.beatend === undefined)
                y = PUMPER.ScreenHeight;
            else
                y = PUMPER.Globals.NoteData.GetBeatY(Hold.beatend);
            Hold.y = PUMPER.Globals.NoteData.GetBeatY(Hold.beatfrom);
            if(Hold.y < PUMPER.OffsetY)
                Hold.y = PUMPER.OffsetY;
            this.DrawHoldBody(Hold.opacity, Hold.pos, Hold.y, Hold.seed, Hold.attr, y-Hold.y);
            if( Hold.y >= PUMPER.OffsetY)   {
                this.DrawNote(PUMPER.NoteTap, Hold.opacity, Hold.pos, Hold.y, 0, Hold.seed, Hold.attr);
            }else if( Hold.y <= PUMPER.OffsetY || ( Hold.y < PUMPER.OffsetY-3 && y > PUMPER.OffsetY-32) ) 
                this.DrawNote(PUMPER.NoteTap, Hold.opacity, Hold.pos, PUMPER.OffsetY, 0, Hold.seed, Hold.attr);
            
            ++k;
        }
        ++i;
    }
};
PUMPER.GL.Drawer.prototype.DrawHoldBody    =   function(nopacity, notepos, y, seed, attr, height)   { 
    if(nopacity != 0 && height-PUMPER.ArrowSize/2 > 0 && height > 0 && y > -200)  {
        height = (y<0)?height+y:height;
        y = (y<0)?0:y;
        var img = this.skin.GLGetNoteImage(PUMPER.NoteHoldBody, notepos%5, seed, attr);
        var pos = PUMPER.Globals.Double ? PUMPER.doublenotesx[notepos] : PUMPER.singlenotesx[notepos];
        var data = PUMPER.GL.GenSprite(pos,y+PUMPER.ArrowSize/2,PUMPER.ArrowSize,height+11,img.x,img.y,img.u,img.v,1,this.NotesIdx);
        this.NotesTexture = img.texture;
        this.Notes[0] = this.Notes[0].concat(data[0]);
        this.Notes[1] = this.Notes[1].concat(data[1]);
        this.Notes[2] = data[2].concat(this.Notes[2]);//.concat(data[2]);
        this.NotesIdx+= data[0].length/3;
    }
}
PUMPER.GL.Drawer.prototype.ProcessEffect   =   function(nopacity, notepos, y, noterotation, seed, attr, time)   {
    /*
    if(attr == 0 && seed == 22 && y <= PUMPER.OffsetY/2 )   {    //  Bomb Effect
        if(PUMPER.Globals.NoteData.CurrentBeat >> 0 != PUMPER.Globals.Bomb.LastBeatPlay)   {
            PUMPER.Globals.Bomb.Play();  
            PUMPER.Globals.Bomb.LastBeatPlay = PUMPER.Globals.NoteData.CurrentBeat >> 0;
        }
        PUMPER.Globals.EffectBank.FlashEffect.Start(PUMPER.Globals.NoteData.CurrentBeat);
    }else if(attr == 0 && seed == 17 && y <= PUMPER.OffsetY)  {   // Flash Effect
        PUMPER.Globals.EffectBank.FlashEffect.Start(PUMPER.Globals.NoteData.CurrentBeat);*/
        /*
         if(PUMPER.Globals.NoteData.CurrentBeat >> 0 != .LastBeatPlay)   {
            PUMPER.Globals.Bomb.Play();  
            PUMPER.Globals.Bomb.LastBeatPlay = PUMPER.Globals.NoteData.CurrentBeat >> 0;
        }     
    }else{
    
    }*/  
};
PUMPER.GL.Drawer.prototype.DrawNote    =   function(ntype, nopacity, notepos, y, noterotation, seed, attr)  {
    if(nopacity != 0 && ntype != PUMPER.NoteNull && (y > PUMPER.OffsetY-2 || ntype == PUMPER.NoteFake || ntype == PUMPER.NoteItemFake) )  {
        var img = this.skin.GLGetNoteImage(ntype, notepos%5, seed, attr);
        var pos = PUMPER.Globals.Double ? PUMPER.doublenotesx[notepos] : PUMPER.singlenotesx[notepos];
        var data = PUMPER.GL.GenSprite(pos,y,PUMPER.ArrowSize,PUMPER.ArrowSize,img.x,img.y,img.u,img.v,1,this.NotesIdx);
        this.NotesTexture = img.texture;
        this.Notes[0] = this.Notes[0].concat(data[0]);
        this.Notes[1] = this.Notes[1].concat(data[1]);
        this.Notes[2] = this.Notes[2].concat(data[2]);
        this.NotesIdx+= (data[0].length/3);
    }
};

PUMPER.GL.Drawer.prototype.Update      =   function() {
    this.Clear();
    if(PUMPER.Globals.Sentinel.OK())    {
        var timeDelta   =   Date.now() - this.lastDelta, 
            i           =   0, 
            len         =   this.LayerObjects.length;
        this.lastDelta = Date.now();
        if(PUMPER.Globals.AllLoaded)  {
            while(i<len)    {
                var j=0,jlen=this.LayerObjects[i].length;
                while(j<jlen)   {
                    this.LayerObjects[i][j].Update(timeDelta);
                    this.LayerObjects[i][j].GLUpdate();
                    ++j;
                }
                ++i;
            }
            this.DrawNotes();
        }
    }
};
    
PUMPER.GL.Drawer.prototype.RemoveObj   =   function(objname,layer)  {  this.SceneLayers[layer].RemoveObject(objname); };
PUMPER.GL.Drawer.prototype.DrawLayers  =   function()  {
    if(!PUMPER.Globals.AllLoaded)  {
        this.DrawLoading();
    }else{
        this.Renderer.Clear();
        var i           =   0, 
            len         =   this.LayerObjects.length;
        var data = [];
        
        while(i<len)    {
            if(i == 2)  {
                data =[
                    { 
                        texture     :   this.LongsTexture,
                        vertex      :   this.Longs[0],
                        texcoord    :   this.Longs[1],
                        index       :   this.Longs[2],
                        shdNum      :   0,
                        scale       :   {x:1,y:1,z:1},
                        opacity     :   1
                    }
                ];
                this.Renderer.Render(data);  
                data =[
                    { 
                        texture     :   this.NotesTexture,
                        vertex      :   this.Notes[0],
                        texcoord    :   this.Notes[1],
                        index       :   this.Notes[2],
                        shdNum      :   0,
                        scale       :   {x:1,y:1,z:1},
                        opacity     :   1
                    }
                ];
                this.Renderer.Render(data);  
                //TODO: ITEMS          
            }
            var j=0,jlen=this.LayerObjects[i].length;
            while(j<jlen)   {
                this.Renderer.RenderObject(this.LayerObjects[i][j]);
                ++j;
            }
            ++i;
        }

    }
};
PUMPER.GL.Drawer.prototype.DrawLoading =   function()   {
/*
    this.ctx.font = "bold 56px sans-serif";
    this.ctx.textAlign = 'center';
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillText("Loading", 320, 200);
    var percent = Math.round(100 * (PUMPER.Globals.LoadedData /  PUMPER.Globals.DataToLoad));
    this.ctx.fillText("Loaded: "+percent+"%", 320, 260);
    this.ctx.fillText("Files: "+PUMPER.Globals.LoadedData+"/"+PUMPER.Globals.DataToLoad, 320, 320);
*/
};

