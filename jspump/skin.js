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
PUMPER.F2Skin = function(parameters)  {
    var _skin = this;
    this.NoteSkins      =   {};
    this.ItemSkin       =   [];
    this.ItemSkinCoord  =   [];
    this.NoteSkinCoord  =   [];
    this.canvas         =   parameters.canvas;
    this.gl             =   parameters.gl;
    
    if(PUMPER.Globals.WebGL)
        this.DummyTexture = this.gl.createTexture();
        
    var c = PUMPER.Globals.WebGL?5:24;
    for(var i=0;i<c;i++)   
        this.ItemSkin.push({});

    this.ItemImage  =   [];
    var loader = new JPAK.jpakloader({"file":"datapack/ITEM.jpak"});
    loader.onload = function()  {
        for(var i=0;i<6;i++)    {
            _skin.ItemImage[i]  =   new Image();
            _skin.ItemImage[i].n = i;
            _skin.ItemImage[i].onload = function()  {
                if(!PUMPER.Globals.WebGL)   {
                    for(var z=0;z<24;z++)   
                        _skin.ItemSkin[z][this.n] = PUMPER.CropImage(this, 64*z,0,64,64);
                }else{
                    _skin.ItemSkin[this.n] = _skin.gl.createTexture();
                    _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, _skin.ItemSkin[this.n]);
                    _skin.gl.pixelStorei(_skin.gl.UNPACK_FLIP_Y_WEBGL, true);
                    _skin.gl.texImage2D(_skin.gl.TEXTURE_2D, 0, _skin.gl.RGBA, _skin.gl.RGBA, _skin.gl.UNSIGNED_BYTE, PUMPER.GL.ToPowerOfTwo(this));
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MAG_FILTER, _skin.gl.LINEAR);
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MIN_FILTER, _skin.gl.LINEAR_MIPMAP_NEAREST); 
                    _skin.gl.generateMipmap(_skin.gl.TEXTURE_2D);
                    _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, null);                 
                    _skin.ItemSkin[this.n].width = PUMPER.GL.nextHighestPowerOfTwo(this.width); 
                    _skin.ItemSkin[this.n].height = PUMPER.GL.nextHighestPowerOfTwo(this.height); 
                    _skin.ItemSkin[this.n].rwidth = this.width;
                    _skin.ItemSkin[this.n].rheight = this.height;
                }
                PUMPER.Globals.ObjectsLoaded += 1;
                PUMPER.Globals.CheckLoaded();
            };
            PUMPER.Globals.ObjectsToLoad += 1;
            _skin.ItemImage[i].src = this.GetHTMLDataURIFile("/"+i+".png","image/png"); 
        }    
    }
    loader.Load();
    
    this.LoadedNoteSkins = 0;
    this.CurrentFrameF = 0;
    this.CurrentFrame = 0;
    this.MusicTime = 0;
    
    for(var i=0;i<30;i++)   
       this.NoteSkins[i] = new PUMPER.NoteSkin({"path": "datapack/NS/" + PUMPER.PadInt(i,2) + ".jpak", "master": this, "number" : i});
       
    if(PUMPER.Globals.WebGL)    {
        for(var i=0;i<6;i++)  
            this.NoteSkinCoord.push({x:i,y:0});    
    }
    this.LastAbsTime = Date.now();
    this.CurrentAbsFrameF = 0;
    this.CurrentAbsFrame = 0;
    this.AnimSpeed = 18;            //  1 / T
};

PUMPER.F2Skin.prototype.LoadNoteSkin = function ( id )  {
    if(!this.NoteSkins[id].Loaded || !this.NoteSkins[id].StartLoaded)   {
        PUMPER.log("Loading noteskin ( "+id+" ) ");
        this.NoteSkins[id].Load();
        this.NoteSkins[id].StartLoaded = true;
    }
    return this.NoteSkins[id];
};

PUMPER.F2Skin.prototype.Update = function ( musicTime ) {
    var delta = musicTime - this.MusicTime,
        deltaAbs = (Date.now() - this.LastAbsTime)/1000;
    this.LastAbsTime = Date.now();
    this.MusicTime = musicTime;
    
    this.CurrentFrameF += (delta * PUMPER.Globals.CurrentBPM) / 15;
    this.CurrentAbsFrameF += (deltaAbs * this.AnimSpeed) ;
    if(this.CurrentFrameF > 5)  
        this.CurrentFrameF = 0;
    if(this.CurrentAbsFrameF > 6)  
        this.CurrentAbsFrameF = 0;
    
    this.CurrentFrame = this.CurrentFrameF >> 0;
    this.CurrentAbsFrame = this.CurrentAbsFrameF >> 0;
};
PUMPER.F2Skin.prototype.GetNoteImage = function ( ntype, notepos, seed, attr ) {
    seed = seed || 0;
    var orgseed = seed;

    if(ntype < 6 || ntype == PUMPER.NoteHoldHeadFake  || ntype == PUMPER.NoteHoldBodyFake || ntype == PUMPER.NoteHoldTailFake)   
        seed = PUMPER.Globals.NoteData.NoteSkinBank[seed];  
    if((this.NoteSkins[seed].Loaded && ntype != PUMPER.NoteItem) || ntype == PUMPER.NoteItem || ntype == PUMPER.NoteItemFake) {
        switch(ntype)   {
            case PUMPER.NoteNull        :   /* Dafuq? */ return new Image(); break;
            
            case PUMPER.NoteFake        :
            case PUMPER.NoteTap         :   return this.NoteSkins[seed].NoteFrames[notepos][this.CurrentAbsFrame]; break;
            
            case PUMPER.NoteHoldHeadFake:
            case PUMPER.NoteHoldHead    :   return this.NoteSkins[seed].NoteFrames[notepos][this.CurrentAbsFrame]; break;
            
            case PUMPER.NoteHoldBodyFake:
            case PUMPER.NoteHoldBody    :   return this.NoteSkins[seed].LongBodyFrames[notepos][this.CurrentAbsFrame]; break;
            
            case PUMPER.NoteHoldTailFake:
            case PUMPER.NoteHoldTail    :   return this.NoteSkins[seed].LongTailFrames[notepos][this.CurrentAbsFrame]; break;
            
            
            case PUMPER.NoteItemFake    :   
            case PUMPER.NoteItem        :   return this.ItemSkin[seed][this.CurrentAbsFrame]; break;
            default                     :   PUMPER.debug("Error: Note Type not know: "+ntype); return new Image();
        }
    }else{
        PUMPER.debug("Error: We have problems ("+orgseed+","+seed+","+notepos+","+attr+")");
        return new Image();
    }
};
PUMPER.F2Skin.prototype.NoteSkinWidth = PUMPER.GL.nextHighestPowerOfTwo(320);
PUMPER.F2Skin.prototype.NoteSkinHeight = PUMPER.GL.nextHighestPowerOfTwo(192);
PUMPER.F2Skin.prototype.NoteSkinXStep = 1.0 / PUMPER.F2Skin.prototype.NoteSkinWidth;  //  1 / above Width
PUMPER.F2Skin.prototype.NoteSkinYStep = 1.0 / PUMPER.F2Skin.prototype.NoteSkinHeight;  

PUMPER.F2Skin.prototype.ItemSkinWidth = PUMPER.GL.nextHighestPowerOfTwo(2048);
PUMPER.F2Skin.prototype.ItemSkinHeight = PUMPER.GL.nextHighestPowerOfTwo(128);
PUMPER.F2Skin.prototype.ItemSkinXStep = 1.0 / PUMPER.F2Skin.prototype.ItemSkinWidth;  //  1 / above Width
PUMPER.F2Skin.prototype.ItemSkinYStep = 1.0 / PUMPER.F2Skin.prototype.ItemSkinHeight;  

PUMPER.F2Skin.prototype.GLGetNoteImage = function ( ntype, notepos, seed, attr ) {
    seed = seed || 0;
    var orgseed = seed;
    if(ntype < 6 || ntype == PUMPER.NoteHoldHeadFake  || ntype == PUMPER.NoteHoldBodyFake || ntype == PUMPER.NoteHoldTailFake)   
        seed = PUMPER.Globals.NoteData.NoteSkinBank[seed];  
        
    var RetData = {texture:this.ItemSkin[0],x:0,y:0,u:this.ItemSkinXStep  *   64,v:this.ItemSkinYStep  *   64}; //  This is a blank space on item skin. TODO: Make this in the right way
    if(ntype == PUMPER.NoteNull)
        return RetData;
         
    if((this.NoteSkins[seed].Loaded && ntype != PUMPER.NoteItem) || ntype == PUMPER.NoteItem || ntype == PUMPER.NoteItemFake) {
        switch(ntype)   {
            case PUMPER.NoteNull        :   /* Dafuq? */ break;
            
            case PUMPER.NoteHoldHeadFake:
            case PUMPER.NoteHoldHead    :
            case PUMPER.NoteFake        :
            case PUMPER.NoteTap         :   RetData.texture = this.NoteSkins[seed].NoteFrames[this.CurrentAbsFrame];//this.CurrentAbsFrame]; 
                                            RetData.x = this.NoteSkinXStep  *   64  *   notepos;
                                            RetData.y = this.NoteSkinYStep  *   64  * 2;
                                            RetData.u = this.NoteSkinXStep  *   64  *   (notepos+1);
                                            RetData.v = this.NoteSkinYStep  *   64  * 3;
                                            break;
            case PUMPER.NoteHoldBodyFake:
            case PUMPER.NoteHoldBody    :   RetData.texture = this.NoteSkins[seed].NoteFrames[this.CurrentAbsFrame]; 
                                            RetData.x = this.NoteSkinXStep  *   64  *   notepos;
                                            RetData.y = this.NoteSkinYStep  *   64  * 4 - 2*this.NoteSkinYStep;
                                            RetData.u = this.NoteSkinXStep  *   64  *   (notepos+1);
                                            RetData.v = this.NoteSkinYStep  *   64  * 4 - this.NoteSkinYStep;
                                            break;
            case PUMPER.NoteHoldTailFake:
            case PUMPER.NoteHoldTail    :   RetData.texture = this.NoteSkins[seed].NoteFrames[this.CurrentAbsFrame]; 
                                            RetData.x = this.NoteSkinXStep  *   64  *   notepos;
                                            RetData.y = this.NoteSkinYStep  *   64  * 3;
                                            RetData.u = this.NoteSkinXStep  *   64  *   (notepos+1);
                                            RetData.v = this.NoteSkinYStep  *   64  * 4 - this.NoteSkinYStep;
                                            break;
            case PUMPER.NoteItemFake    :   
            case PUMPER.NoteItem        :   seed %= 24;
                                            RetData.texture = this.ItemSkin[this.CurrentAbsFrame]; 
                                            RetData.x = this.ItemSkinXStep  *   64  *   seed;
                                            RetData.y = this.ItemSkinYStep  *   64;
                                            RetData.u = this.ItemSkinXStep  *   64  *   (seed+1);
                                            RetData.v = this.ItemSkinYStep  *   128;
                                            break; 
            default                     :   PUMPER.debug("Error: Note Type not know: "+ntype);
        }
    }else
        PUMPER.debug("Error: We have problems ("+ntype+","+orgseed+","+seed+","+notepos+","+attr+")");
    return RetData;
};

PUMPER.NoteSkin = function(parameters)    {
    this.path           =   parameters.path;
    this.master         =   parameters.master;
    this.Base           =   new Image();
    this.BaseInactive   =   new Image();
    this.number         =   parameters.number;
    this.NoteFrames     =   {"0" : {}, "1" : {}, "2" : {}, "3" : {}, "4" : {}, "5" : {}};
    this.StompFrames    =   {"0" : {}, "1" : {}, "2" : {}, "3" : {}, "4" : {}, "5" : {}};
    this.LongBodyFrames =   {"0" : {}, "1" : {}, "2" : {}, "3" : {}, "4" : {}, "5" : {}};
    this.LongTailFrames =   {"0" : {}, "1" : {}, "2" : {}, "3" : {}, "4" : {}, "5" : {}}; 
    this.EffectFrames   =   {"0" : {}, "1" : {}, "2" : {}, "3" : {}, "4" : {}};
    this.LoadedImages   =   0;
    this.ImagesToLoad   =   1; // Just to not tell that is loaded
    this.Loaded         =   false;
    
    this.EffectFramesL  =   0;  //  Effect Frames Loaded
};

PUMPER.NoteSkin.ReceptorCoord = [32,0,290,64];
PUMPER.NoteSkin.ReceptorCoordInactive = [32,64,290,128];

PUMPER.NoteSkin.prototype.Load = function () {
    var BaseImage = new Image();
    var _this = this;
    var _skin = this.master;
    PUMPER.Globals.ObjectsToLoad += 1;
    PUMPER.Globals.ObjectsToLoad += 1;
    PUMPER.Globals.ObjectsToLoad += 1;
    var loader = new JPAK.jpakloader({"file":this.path});
    loader.onload = function()  {
        BaseImage.onload = function() { 
            var Receptor, ReceptorA, Receptor2, ReceptorA2;
            if(!PUMPER.Globals.WebGL)   {
                _this.Base           =   PUMPER.CropImage(BaseImage,32,64,256,64); 
                _this.BaseInactive   =   PUMPER.CropImage(BaseImage,32,0,256,64); 
            }else{
                _this.Base = _skin.gl.createTexture();
                _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, _this.Base);
                _skin.gl.pixelStorei(_skin.gl.UNPACK_FLIP_Y_WEBGL, true);
                _skin.gl.texImage2D(_skin.gl.TEXTURE_2D, 0, _skin.gl.RGBA, _skin.gl.RGBA, _skin.gl.UNSIGNED_BYTE, PUMPER.GL.ToPowerOfTwo(this));
                _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MAG_FILTER, _skin.gl.LINEAR);
                _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MIN_FILTER, _skin.gl.LINEAR_MIPMAP_NEAREST); 
                _skin.gl.generateMipmap(_skin.gl.TEXTURE_2D);
                _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, null);  
                _this.Base.width = PUMPER.GL.nextHighestPowerOfTwo(this.width); 
                _this.Base.height = PUMPER.GL.nextHighestPowerOfTwo(this.height); 
                _this.Base.rwidth = this.width;
                _this.Base.rheight = this.height;
                _this.BaseInactive = _this.Base;  
            }
            if(!PUMPER.Globals.Double)   {
                Receptor = new PUMPER.AnimatedObject({
                    "image"     :   _this.BaseInactive,
                    "x"         :   PUMPER.singlereceptor.x,
                    "y"         :   PUMPER.singlereceptor.y,
                    "opacity"   :   1,
                    "gl"        :   _skin.gl,
                    "coord"     :   PUMPER.NoteSkin.ReceptorCoordInactive
                });
                ReceptorA = new PUMPER.AnimatedObject({
                    "image"     :   _this.Base, 
                    "opacity"   :   0,
                    "x"         :   PUMPER.singlereceptor.x,
                    "y"         :   PUMPER.singlereceptor.y,
                    "coord"     :   PUMPER.NoteSkin.ReceptorCoord,
                    "Update"    :   function(timeDelta) {
                        var delta = 0;
                        if(this.MusicTime != undefined) 
                            delta = PUMPER.Globals.Music.GetTime() - this.MusicTime;
                        this.MusicTime = PUMPER.Globals.Music.GetTime();
                        this.opacity -= (delta * PUMPER.Globals.CurrentBPM) / 60;
                        if(this.opacity < 0)
                            this.opacity = 1;
                        this.NeedsRedraw = true;
                    },
                    "gl"        :   _skin.gl
                });
                if(PUMPER.Globals.DefaultNoteSkin == _this.number)  {
                    PUMPER.Globals.Drawer.AddObj(Receptor, 1);
                    PUMPER.Globals.Drawer.AddObj(ReceptorA, 1);
                }
            }else{
                 Receptor = new PUMPER.AnimatedObject({
                    "image"     :   _this.BaseInactive,
                    "x"         :   PUMPER.doublereceptor.x,
                    "y"         :   PUMPER.doublereceptor.y,
                    "gl"        :   _skin.gl,
                    "coord"     :   PUMPER.NoteSkin.ReceptorCoordInactive
                });
                ReceptorA = new PUMPER.AnimatedObject({
                    "image"     :   _this.Base, 
                    "opacity"   :   0,
                    "x"         :   PUMPER.doublereceptor.x,
                    "y"         :   PUMPER.doublereceptor.y,
                    "coord"     :   PUMPER.NoteSkin.ReceptorCoord,
                    "Update"    :   function(timeDelta) {
                        var delta = 0;
                        if(this.MusicTime != undefined) 
                            delta = PUMPER.Globals.Music.GetTime() - this.MusicTime;
                        this.MusicTime = PUMPER.Globals.Music.GetTime();
                        this.opacity -= (delta * PUMPER.Globals.CurrentBPM) / 60;
                        if(this.opacity < 0)
                            this.opacity = 1;
                        this.NeedsRedraw = true;
                    },
                    "gl"        :   _skin.gl
                });
                Receptor2 = Receptor.Clone();
                ReceptorA2 = ReceptorA.Clone();
                Receptor2.SetX(PUMPER.doublereceptor.x + 256);
                ReceptorA2.SetX(PUMPER.doublereceptor.x + 256);
                if(PUMPER.Globals.DefaultNoteSkin == _this.number)  {
                    PUMPER.Globals.Drawer.AddObj(Receptor, 1);
                    PUMPER.Globals.Drawer.AddObj(ReceptorA, 1);   
                    PUMPER.Globals.Drawer.AddObj(Receptor2, 1);
                    PUMPER.Globals.Drawer.AddObj(ReceptorA2, 1); 
                }      
            }    
            _this.LoadedImages++; 
            _this.UpdateLoaded();
            PUMPER.Globals.ObjectsLoaded += 1;
            PUMPER.Globals.CheckLoaded();
        };
        //BaseImage.src = this.path+"BASE.PNG";
        BaseImage.src = this.GetHTMLDataURIFile("/BASE.PNG","image/png");
        //50x1
        for(var i=0;i<6;i++)    {
            var Frame = new Image();
            Frame.n = i;
            Frame.onload = function()   {
                if(!PUMPER.Globals.WebGL)   {
                    for(var z=0;z<5;z++)    {
                        _this.LongBodyFrames[z][this.n]     =   PUMPER.CropImage(this,z*64,0*64,64,1);
                        //_this.LongTailFrames[z][this.n]     = PUMPER.CropImage(this,z*64,0*64,64,64);
                        _this.LongTailFrames[z][this.n]     =   PUMPER.CropImageTarget(this,z*64,8,64,56,0,8,64,64);//targetx,targety,targetw,targeth
                        _this.NoteFrames[z][this.n]         =   PUMPER.CropImage(this,z*64,1*64,64,64);
                        _this.StompFrames[z][this.n]        =   PUMPER.CropImage(this,z*64,2*64,64,64);
                    }
                }else{
                    _this.NoteFrames[this.n] = _skin.gl.createTexture();
                    _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, _this.NoteFrames[this.n]);
                    _skin.gl.pixelStorei(_skin.gl.UNPACK_FLIP_Y_WEBGL, true);
                    _skin.gl.texImage2D(_skin.gl.TEXTURE_2D, 0, _skin.gl.RGBA, _skin.gl.RGBA, _skin.gl.UNSIGNED_BYTE, PUMPER.GL.ToPowerOfTwo(this));
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MAG_FILTER, _skin.gl.LINEAR);
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MIN_FILTER, _skin.gl.LINEAR_MIPMAP_NEAREST); 
                    _skin.gl.generateMipmap(_skin.gl.TEXTURE_2D);
                    _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, null); 
                    _this.NoteFrames[this.n].width = PUMPER.GL.nextHighestPowerOfTwo(this.width); 
                    _this.NoteFrames[this.n].height = PUMPER.GL.nextHighestPowerOfTwo(this.height); 
                    _this.NoteFrames[this.n].rwidth = this.width;
                    _this.NoteFrames[this.n].rheight = this.height;              
                }
                _this.LoadedImages++; 
                _this.UpdateLoaded();
                PUMPER.Globals.ObjectsLoaded += 1;
                PUMPER.Globals.CheckLoaded();
            };
            //Frame.src = this.path+i+".PNG";
            Frame.src = this.GetHTMLDataURIFile("/"+i+".PNG","image/png");
        }
        
        for(var i=0;i<5;i++)    {
            var Frame = new Image();
            Frame.n = i;
            Frame.onload = function()   {
                _this.EffectFramesL++;
                if(!PUMPER.Globals.WebGL)
                    _this.EffectFrames[this.n] = PUMPER.ResizeImage(this,192,192);
                else{
                    var tmpimg = PUMPER.ResizeImage(this,192,192);
                    _this.EffectFrames[this.n] = _skin.gl.createTexture();
                    _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, _this.EffectFrames[this.n]);
                    _skin.gl.pixelStorei(_skin.gl.UNPACK_FLIP_Y_WEBGL, true);
                    _skin.gl.texImage2D(_skin.gl.TEXTURE_2D, 0, _skin.gl.RGBA, _skin.gl.RGBA, _skin.gl.UNSIGNED_BYTE, tmpimg);
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MAG_FILTER, _skin.gl.LINEAR);
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_MIN_FILTER, _skin.gl.LINEAR); 
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_WRAP_S, _skin.gl.CLAMP_TO_EDGE);
                    _skin.gl.texParameteri(_skin.gl.TEXTURE_2D, _skin.gl.TEXTURE_WRAP_T, _skin.gl.CLAMP_TO_EDGE);
                    _skin.gl.bindTexture(_skin.gl.TEXTURE_2D, null);  
                    _this.EffectFrames[this.n].width = tmpimg.width;  
                    _this.EffectFrames[this.n].height = tmpimg.height;  
                    _this.EffectFrames[this.n].rwidth = 192;
                    _this.EffectFrames[this.n].rheight = 192;               
                }
                this.width = 192;
                this.height = 192;
                if(_this.EffectFramesL == 5)    {
                    // Time to load effect object
                    var i=0, len=(PUMPER.Globals.Double)?10:5;
                    while(i<len)    {
                        var x = ((PUMPER.Globals.Double)?PUMPER.doublenotesx[i]:PUMPER.singlenotesx[i]) - this.width / 2 + PUMPER.ShowWidth / 2  +6;
                        var y = ((PUMPER.Globals.Double)?PUMPER.doublereceptor.y:PUMPER.singlereceptor.y) - this.height / 2 + PUMPER.ArrowSize / 2 ;
                        
                        var Frames    = [ _this.EffectFrames[0],_this.EffectFrames[1],_this.EffectFrames[2],_this.EffectFrames[3],_this.EffectFrames[4] ];
                        var EffectPOS = new PUMPER.FrameObject({
                            "frames"    :   Frames, 
                            "frametime" :   20,
                            "blendtype" :   "lighter",
                            "runonce"   :   true,
                            "visible"   :   false,
                            "x"         :   x,
                            "y"         :   y,
                            "gl"        :   _skin.gl
                        });
                        if(PUMPER.Globals.DefaultNoteSkin == _this.number)  {
                            PUMPER.Globals.Drawer.AddObj(EffectPOS, 4);   
                            PUMPER.Globals.EffectBlock.push(EffectPOS);
                        }
                        ++i;   
                    }
                }
                _this.LoadedImages++; 
                _this.UpdateLoaded();
                PUMPER.Globals.ObjectsLoaded += 1;
                PUMPER.Globals.CheckLoaded();
            };
            Frame.src = this.GetHTMLDataURIFile("/STEPFX"+PUMPER.PadInt(_this.number,2)+"_"+i+".PNG","image/png");
            //Frame.src = this.path+"STEPFX"+PUMPER.PadInt(this.number,2)+"_"+i+".PNG";
            _this.EffectFrames[i] = Frame;
        }    
    };
    loader.onprogress = function(progress)  {
        if(!_this.BaseAdded)    {
            _this.ImagesToLoad = progress.total;
            _this.LoadedImages = progress.loaded;
        }else
            _this.LoadedImages += progress.loaded - _this.LoadedImages;
        if(_this.LoadedImages == _this.ImagesToLoad)
            _this.Loaded = true;
    };
    loader.Load();
};

PUMPER.NoteSkin.prototype.UpdateLoaded = function() {
    PUMPER.Globals.DataToLoad = this.ImagesToLoad;
    PUMPER.Globals.LoadedData = this.LoadedImages;
    
    if(this.ImagesToLoad == this.LoadedImages)  {
        this.master.LoadedNoteSkins++
        this.Loaded = true;
     }
};
