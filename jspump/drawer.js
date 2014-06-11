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
*/

/*
 * 	PUMPER Drawer Class
 * 
 * 	This class does the drawing of the Stuff on 2D Canvas Context
 */
PUMPER.Drawer = PUMPER.Drawer || function ( parameters )  {
    this.canvas             =   parameters.canvas;
    this.skin               =   parameters.skin;
    this.ctx                =   this.canvas.getContext("2d");

    this.SceneLayers        =   [ ];                          		// PUMPER.SceneLayer
    this.lastDelta          =   Date.now();
    this.NoteBlock          =   [];
    this.HoldBuffer         =   [[],[],[],[],[],[],[],[],[],[]];	//	This is for making buffer of hold notes start and end
    
    this.InitLayers(this.canvas.width, this.canvas.height);
};

/*
 * 	This creates the SceneLayers objects for drawing.
 * 	Used for Software Z-Buffer drawing
 */
PUMPER.Drawer.prototype.InitLayers  =   function(width,height)  {
    var i           =   0, 
        len         =   5;
    PUMPER.debug("Initializing "+len+" layers with size ("+width+","+height+")");
    while(i<len)    {
        var lay = new PUMPER.SceneLayer({"width":width,"height":height});
        lay.InitLayer();
        this.SceneLayers.push(lay);
        ++i;
    }
    this.SceneLayers[4].blendtype = "lighter";
};

/*
 * 	This adds a object to corresponding layer.
 * 	If layer parameter is undefined, it will add to default layer (2)
 */
PUMPER.Drawer.prototype.AddObj      =   function(obj,layer) {
    layer = layer !== undefined ? layer : 2; 
    PUMPER.debug("PUMPER::Drawer::Adding AnimObj "+obj.id+" in layer "+layer);
    obj.Drawer = this;
    this.SceneLayers[layer].AddObject(obj);
};

/*
 * 	Removes an object from a given layer.
 */
PUMPER.Drawer.prototype.RemoveObj   =   function(objname,layer)  {  this.SceneLayers[layer].RemoveObject(objname); };

/*
 * 	This does the note drawing.
 * 	The note layer is the default (2), all notes will be rendered on Layer 2
 * 	This will basicly iterate over the noteblock adding the notes on the layer
 */
PUMPER.Drawer.prototype.DrawNotes   =   function() {
    var i           =   0, 
        len         =   this.NoteBlock.length,
        ctx         =   this.SceneLayers[2].GetContext(),
        //holdcount   =   0,
        k           =   0,
        klen        =   0;  
    while(i<len)    {
        var row = this.NoteBlock[i],
            n = 0, nlen = row.notes.length;
            while(n < nlen) {
                var note = row.notes[n];
                if(note.type == PUMPER.NoteHoldHead || note.type == PUMPER.NoteHoldHeadFake)    { 	//	First we will process the holds. The holds have start, body and end.
                																					// 	So basicly we need to cache the start and see where it will end, so we can know how much we need to draw.
                    if(this.HoldBuffer[n].length == 0)     {										//	We first search if there is any hold already on buffer. If not, we add the current one to buffer. 
                    																				//	This is necessary for broken/bad made charts that doesnt have start/end for longs.
                        this.HoldBuffer[n].push({"beatfrom":row.rowbeat, "beatend" : note.beatend, "pos" : n, "opacity" : note.opacity, "y" : row.y, "seed" : note.seed, "attr" : note.attr});
                    }else{																			//	If it doesnt, it means we may have an delta to draw the hold.
                        var found = false;															//	Lets see if we can find a hold in the same column we already found.
                        klen=this.HoldBuffer[n].length;												//	If we find, we just update the Y 
                        k=0;
                        while(k<klen)   {
                            if(this.HoldBuffer[n][k].beatfrom == row.rowbeat)   {					
                                this.HoldBuffer[n][k].y = row.y;
                                found = true;
                                break;
                            }
                            ++k;
                        }
                        if(!found)																	//	If not, we need to add it to the buffer
                            this.HoldBuffer[n].push({"beatfrom":row.rowbeat, "beatend" : note.beatend, "pos" : n, "opacity" : note.opacity, "y" : row.y, "seed" : note.seed, "attr" : note.attr});
                    }
                }else if(note.type == PUMPER.NoteHoldBody)   {										//	If its an hold body, we just need to check if its on CutZone (a.k.a. receiver). If so, we trigger the Receiver Effect for that note
                    if(PUMPER.Globals.NoteData.BeatInCutZone(row.rowbeat, row))						//	In UCS and NX20 we draw the hold regardless if the body is defined or not. So we don't need to force it draw.
                        PUMPER.Globals.EffectBlock[n].Start(PUMPER.Globals.NoteData.CurrentBeat);
                }
                if(note.type == PUMPER.NoteEffect)													//	If its an Effect (NX20 stuff), we trigger process the Effect
                    this.ProcessEffect(ctx, note.opacity, n, row.y, note.rotation, note.seed, note.attr);
                else if(note.type != PUMPER.NoteHoldBody && note.type != PUMPER.NoteNull)  {    	//	If its not an Hold and not a Null Note, we just draw it.
                    if(PUMPER.Globals.NoteData.BeatInCutZone(row.rowbeat, row) && note.type != PUMPER.NoteItemFake && note.type != PUMPER.NoteFake)   {
                    	PUMPER.Globals.EffectBlock[n].Start(PUMPER.Globals.NoteData.CurrentBeat);
                    }else{
                        this.DrawNote(ctx, note.type, note.opacity, n, row.y, note.rotation, note.seed, note.attr);
                    }
                }
                ++n;
            }
        ++i;
    }
    i = 0;
    len = PUMPER.Globals.Double ? 10 : 5;	//	Just how many notes we will iterate.
    /*
     * 	This loop will iterate over the Hold Buffer and draw the holds.
     * 	Basicly will draw the start, body and end.
     */
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
            this.DrawHoldBody(ctx, Hold.opacity, Hold.pos, Hold.y, Hold.seed, Hold.attr, y-Hold.y); 
            if( Hold.y >= PUMPER.OffsetY)   {
                this.DrawNote(PUMPER.NoteTap, Hold.opacity, Hold.pos, Hold.y, 0, Hold.seed, Hold.attr);
            }else if( Hold.y <= PUMPER.OffsetY || ( Hold.y < PUMPER.OffsetY-3 && y > PUMPER.OffsetY-32) ) 
                this.DrawNote(PUMPER.NoteTap, Hold.opacity, Hold.pos, PUMPER.OffsetY, 0, Hold.seed, Hold.attr);
            
            ++k;
        }
        ++i;
    }
};

/*
 * 	This function draws a Hold body given the paremeters.
 * 	It also trims the float to int in height and y parameters if PUMPER.Globals.SubPixelRender is disabled.
 */

PUMPER.Drawer.prototype.DrawHoldBody    =   function(ctx, nopacity, notepos, y, seed, attr, height)   { 
    if(nopacity != 0 && height-PUMPER.ArrowSize/2 > 0 && height > 0 && y > -200)  {
        if(!PUMPER.Globals.SubPixelRender)  {
            y = y >> 0;
            height = height >> 0;
            height = (y<0)?height+y:height;
            y = (y<0)?0:y;
        }
        var oldAlpha    =   ctx.globalAlpha,
            img         =   this.skin.GetNoteImage(PUMPER.NoteHoldBody, notepos%5, seed, attr),
            oldComp     =   ctx.globalCompositeOperation,
            pos         =   PUMPER.Globals.Double ? PUMPER.doublenotesx[notepos] : PUMPER.singlenotesx[notepos];
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.globalAlpha = nopacity;
        ctx.drawImage(img,pos , y+ PUMPER.ArrowSize/2, PUMPER.ArrowSize, height+11);
        ctx.globalAlpha = oldAlpha;
        ctx.globalCompositeOperation = oldComp;
        ctx.restore();
    }
};

/*
 * 	This is for processing the effects. Usually this will be only for NX20 stuff.
 * 	Maybe in the future we would need this for Stepmania Effects too.
 */
PUMPER.Drawer.prototype.ProcessEffect   =   function(ctx, nopacity, notepos, y, noterotation, seed, attr, time)   {
    if(attr == 0 && seed == 22 && y <= PUMPER.OffsetY/2 )   {    //  Bomb Effect
        if(PUMPER.Globals.NoteData.CurrentBeat >> 0 != PUMPER.Globals.Bomb.LastBeatPlay)   {
            PUMPER.Globals.Bomb.Play();  
            PUMPER.Globals.Bomb.LastBeatPlay = PUMPER.Globals.NoteData.CurrentBeat >> 0;
        }
        PUMPER.Globals.EffectBank.FlashEffect.Start(PUMPER.Globals.NoteData.CurrentBeat);
    }else if(attr == 0 && seed == 17 && y <= PUMPER.OffsetY)  {   // Flash Effect
        PUMPER.Globals.EffectBank.FlashEffect.Start(PUMPER.Globals.NoteData.CurrentBeat);
        /*
         if(PUMPER.Globals.NoteData.CurrentBeat >> 0 != .LastBeatPlay)   {
            PUMPER.Globals.Bomb.Play();  
            PUMPER.Globals.Bomb.LastBeatPlay = PUMPER.Globals.NoteData.CurrentBeat >> 0;
        } */      
    }else{
    
    }
	/*
		//	Few effects to add some time
	Effect 1 0 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 1 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 2 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 3 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 4 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 5 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 6 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 7 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 8 3.8826666666666663 0 17 0 undefined drawer.js:160
	Effect 1 9 3.8826666666666663 0 17 0 undefined drawer.js:160
	*/
    //console.log("Effect", nopacity, notepos, y, noterotation, seed, attr, time);
};

/*
 * 	This function draws a note with given parameters. 
 * 	It also trims the y parameter if PUMPER.Globals.SubPixelRender is false.
 * 	It also has a Debug Parameter (PUMPER.Globals.DrawAnchors) for drawing a red dot in the middle of note.
 */
PUMPER.Drawer.prototype.DrawNote    =   function(ctx, ntype, nopacity, notepos, y, noterotation, seed, attr)  {
    if(nopacity != 0 && ntype != PUMPER.NoteNull && (y > PUMPER.OffsetY-2 || ntype == PUMPER.NoteFake || ntype == PUMPER.NoteItemFake) )  {
        if(!PUMPER.Globals.SubPixelRender)  {
            y = y >> 0;
        }
        //seed = (seed==0)?PUMPER.Globals.DefaultNoteSkin:seed;
        var oldAlpha    =   ctx.globalAlpha;
        var img = this.skin.GetNoteImage(ntype, notepos%5, seed, attr);
        var pos = PUMPER.Globals.Double ? PUMPER.doublenotesx[notepos] : PUMPER.singlenotesx[notepos];
        ctx.save();
        ctx.globalAlpha = nopacity;
        //ctx.globalCompositeOperation = "destination-over";
        ctx.globalCompositeOperation = "source-over";
        ctx.translate(pos+PUMPER.ArrowSize/2 , y+PUMPER.ArrowSize/2);
        ctx.rotate(noterotation);
        ctx.drawImage(img,-PUMPER.ArrowSize/2,-PUMPER.ArrowSize/2, PUMPER.ArrowSize, PUMPER.ArrowSize);
        ctx.globalAlpha = oldAlpha;
        ctx.restore();
        if(PUMPER.Globals.DrawAnchors)   {
            ctx.save();
            ctx.beginPath();
            ctx.arc(pos+PUMPER.ArrowSize/2,y+PUMPER.ArrowSize/2, 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
            ctx.restore();
        }
    }
};

/*
 * 	This updates the layers (and sentinel if enabled).
 * 	In the layer updates usually it updates the Animations with the timeDelta since last update.
 * 	It also clears the note layer that needs to be update every frame.
 */
PUMPER.Drawer.prototype.Update      =   function() {
    if(PUMPER.Globals.Sentinel.OK())    {
        var timeDelta   =   Date.now() - this.lastDelta, 
            i           =   0, 
            len         =   this.SceneLayers.length;
        this.lastDelta = Date.now();
        if(PUMPER.Globals.AllLoaded)  {
            while(i<len)    {
                this.SceneLayers[i].Update(timeDelta);
                ++i;
            }
            this.SceneLayers[2].ClearCanvas();
            this.DrawNotes();
        }
    }
};

/*
 * 	This function gets all the layers and draw on the main canvas given the layer order.
 * 	It will use layer.blendtype parameter to blend the layer over the canvas.
 */
PUMPER.Drawer.prototype.DrawLayers  =   function()  {
    if(!PUMPER.Globals.AllLoaded)  {
        this.DrawLoading();
    }else{
        var i=0, len=this.SceneLayers.length-1;
        var orgblend = this.ctx.globalCompositeOperation;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        while(i<len)    {
            this.SceneLayers[i].UpdateCanvas();
            this.ctx.globalCompositeOperation = this.SceneLayers[i].blendtype;
            this.ctx.drawImage(this.SceneLayers[i].GetCanvas(),0,0);
            ++i;
        }
        this.ctx.globalCompositeOperation = orgblend;
        // Draw Effects
        this.SceneLayers[4].UpdateCanvas();
        i=0;
        len = this.SceneLayers[4].Objects.length;
        while(i<len)    {
            this.SceneLayers[4].Objects[i].Draw(this.ctx);
            ++i;       
        }
    }
};

/*
 * 	This function draws the Loading screen.
 */
PUMPER.Drawer.prototype.DrawLoading =   function()   {
    this.ctx.font = "bold 56px sans-serif";
    this.ctx.textAlign = 'center';
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillText("Loading", 320, 200);
    var percent = Math.round(100 * (PUMPER.Globals.LoadedData /  PUMPER.Globals.DataToLoad));
    this.ctx.fillText("Loaded: "+percent+"%", 320, 260);
    this.ctx.fillText("Files: "+PUMPER.Globals.LoadedData+"/"+PUMPER.Globals.DataToLoad, 320, 320);
};

