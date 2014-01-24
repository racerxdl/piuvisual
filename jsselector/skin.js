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
PUMP_SELECTOR.Skin = PUMP_SELECTOR.Skin || function (parameters)  {

    var _this           =   this;
    this.BASE           =   { "Objs":{} };
    this.ITEM           =   {};
    this.EYE            =   {};
    this.LEVELBAR       =   {};
    this.PREVIEW        =   {};
    
    var BASELoader      =   new JPAK.jpakloader({"file":"datapack/BASE.jpak"});
    var ITEMLoader      =   new JPAK.jpakloader({"file":"datapack/ITEM.jpak"});
    var EYELoader       =   new JPAK.jpakloader({"file":"datapack/EYE.jpak"});
    var LEVELBARLoader  =   new JPAK.jpakloader({"file":"datapack/LEVELBAR.jpak"});
    var PREVIEWLoader   =   new JPAK.jpakloader({"file":"datapack/PREVIEW.jpak"});
    
    BASELoader.onload = function() {
        var content = this.ls("/");
        for(var file in content.files)    {
            var f = content.files[file];
            if(f.name.indexOf(".coord") > -1) {
                var tmp = new Image();
                tmp.f = f;
                tmp.coord = u8as(new Uint8Array(this.GetFileArrayBuffer(f.path, "text/plain")));
                tmp.onload = function() {
                    var f = this.f;
                    var data = PUMP_SELECTOR.CoordSlicer({"image":this, "coord":this.coord, "name" : f.name.replace(".coord","")});
                    if(f.name.indexOf("speed") > -1)  {
                        // Speed Meters
                        for(var d in data)  {
                            if(data.hasOwnProperty(d))  {  
                                var speedname = d;
                                _this.BASE.Objs[speedname] = new PUMP_SELECTOR.AnimatedObject({
                                    x: 5   , 
                                    y: 86  ,
                                    layer: 3, 
                                    opacity: 0,
                                    image: data[d], 
                                    update: function(timeDelta)   { 
                                        if(this.visible)    {
                                            if(this.dir)    {   //  It is big than size, we reduce it.
                                                this.scale.x -= timeDelta * this.timeconst * 4;
                                                this.scale.y -= timeDelta * this.timeconst * 4;
                                                if(this.scale.x < 0.6)  {
                                                    this.scale.x = 0.6;
                                                    this.scale.y = 0.6;
                                                    this.dir = false;
                                                }
                                                _this.BASE.Explosion.StartAnim();
                                                _this.BASE.BlockBright.StartAnim();
                                            }else{
                                                if(this.scale.x < 1)   {
                                                    this.scale.x += timeDelta * this.timeconst;
                                                    this.scale.y += timeDelta * this.timeconst;
                                                }else{
                                                    this.scale.x = 1;
                                                    this.scale.y = 1;
                                                }
                                                if(this.opacity < 1)
                                                    this.opacity += timeDelta * this.timeconst;
                                                else
                                                    this.opacity = 1;
                                            }
                                        }
                                    }
                                });   
                                _this.BASE.Objs[speedname].StartAnim = function() {
                                    this.scale.x = this.scale.y = 2;
                                    this.scale.opacity = 1;
                                    this.dir = true;
                                    this.visible= true;
                                };
                                _this.BASE.Objs[speedname].timeconst = 0.0025;
                                _this.BASE.Objs[speedname].visible = false;
                                PUMP_SELECTOR.Globals.Drawer.AddAnimObj(_this.BASE.Objs[speedname]);     
                            }            
                        }
                        _this.BASE.Objs["SPEED"+PUMP_SELECTOR.Globals.Looper.Speed].visible = true;
                    }else if(f.name.indexOf("noteeffect") > -1)   {   
                        // Note Effects
                        _this.BASE.Explosion = new PUMP_SELECTOR.AnimatedObject({
                                x: 5  -39, 
                                y: 86 -29,
                                layer: 4, 
                                opacity: 0,
                                image: data["EXPLOSION"], 
                                update: function(timeDelta)   { 
                                    if(this.visible)    {
                                        if(this.scale.x < 1)   {
                                            this.scale.x += timeDelta * this.timeconst;
                                            this.scale.y += timeDelta * this.timeconst;
                                        }else{
                                            this.scale.x = 1;
                                            this.scale.y = 1;
                                        if(this.scale.x == 1)
                                            this.visible = false;
                                        }
                                     }
                                }
                            });
                        _this.BASE.Explosion.timeconst = 0.0025;
                        _this.BASE.Explosion.visible = false;
                        _this.BASE.Explosion.StartAnim = function()  {
                            this.scale.x = 0.6;
                            this.scale.y = 0.6;
                            this.visible = true;
                        };
                        _this.BASE.BlockBright = new PUMP_SELECTOR.AnimatedObject({
                                x: 5  -39, 
                                y: 86 -29,
                                layer: 2, 
                                opacity: 0,
                                image: data["BRIGHTBLOCK"], 
                                update: function(timeDelta)   { 
                                    if(this.visible)    {
                                        if(this.scale.x < 1)   {
                                            this.scale.x += timeDelta * this.timeconst;
                                            this.scale.y += timeDelta * this.timeconst;
                                        }else{
                                            this.scale.x = 1;
                                            this.scale.y = 1;
                                        }
                                        if(this.opacity > 0.5)
                                            this.opacity -= timeDelta * this.timeconst;
                                        else
                                            this.opacity = 0.5;
                                        if(this.scale.x == 1)
                                            this.visible = false;
                                     }
                                }
                         });
                        _this.BASE.BlockBright.StartAnim = function()  {
                            this.scale.x = 0.6;
                            this.scale.y = 0.6;
                            this.visible = true;
                        };
                        _this.BASE.BlockBright.timeconst = _this.BASE.Explosion.timeconst;
                        _this.BASE.BlockBright.visible = false;
                        PUMP_SELECTOR.Globals.Drawer.AddAnimObj(_this.BASE.Explosion);
                        PUMP_SELECTOR.Globals.Drawer.AddAnimObj(_this.BASE.BlockBright);   
                    }else if(f.name.indexOf("levelselector") > -1 || f.name.indexOf("selectorballs") > -1)  {
                        for(var d in data) 
                            if(data.hasOwnProperty(d))
                                _this.BASE[d] = data[d];        
                    }else if(f.name.indexOf("selector") > -1) {
                        //  Selector Stuff
                        var lightbarleft = new PUMP_SELECTOR.AnimatedObject({
                            x: 111, 
                            y: 68, 
                            image: data["LIGHTBAR"], 
                            update: function(timeDelta)   {
                                    if(!this.dir)
                                        this.opacity += timeDelta * 0.0005;
                                    else
                                        this.opacity -= timeDelta * 0.0005;
                                    
                                    if(this.opacity >= 1)   {
                                        this.dir = true; 
                                        this.opacity = 1;
                                    }else if(lightbarleft.opacity <= 0.8)    {
                                        this.dir = false;
                                        this.opacity = 0.8;
                                    }
                            }
                        });
                        var lightbarright = new PUMP_SELECTOR.AnimatedObject({
                            x: 112 + 394, 
                            y: 68,
                            image: data["LIGHTBAR"], 
                            update: function(timeDelta)   {
                                    if(!this.dir)
                                        this.opacity += timeDelta * 0.0005;
                                    else
                                        this.opacity -= timeDelta * 0.0005;
                                     
                                    if(this.opacity >= 1)   {
                                        this.dir = true; 
                                        this.opacity = 1;
                                    }else if(lightbarright.opacity <= 0.8)    {
                                        this.dir = false;
                                        this.opacity = 0.8;
                                    }
                            }
                        });
                        _this.BASE.SelectorFrame = new PUMP_SELECTOR.AnimatedObject({
                            x: 240,
                            y: 303,
                            image: data["SELECTORFRAME"], 
                            update: function(timeDelta)   {
                                 
                                    if(!this.dir)
                                        this.scale.x = this.scale.y += timeDelta * 0.0005;
                                    else
                                        this.scale.x = this.scale.y -= timeDelta * 0.0005;
                                     
                                    if(this.scale.x >= 1.2)   {
                                        this.dir = true; 
                                        this.scale.x = this.scale.y = 1.2;
                                    }else if(this.scale.x <= 1.0){
                                        this.dir = false; 
                                        this.scale.x = this.scale.y = 1.0;
                                    }
                                    var deltaX = _this.targetx - _this.x,
                                        deltaY = _this.targety - _this.y;
                                    if(Math.round(deltaX) == 0) 
                                        _this.x = _this.targetx;
                                    else    
                                        _this.x += timeDelta * deltaX * _this.movespeed;
                                    if(Math.round(deltaY) == 0)
                                        _this.y = _this.targety;
                                    else
                                        _this.y += timeDelta * deltaY * _this.movespeed;
                                    
                            }
                        });
                        _this.BASE.SelectorFrame.targetx = 240;
                        _this.BASE.SelectorFrame.targety = 303;
                        _this.BASE.SelectorFrame.movespeed = 0.01;
                        _this.BASE.SelectorFrame.MoveTo = function(x,y) {
                            this.targetx = x;
                            this.targety = y;
                        }
                        _this.BASE.SelectorFrame.Move = function(x,y)   {
                            this.targetx = x;
                            this.targety = y;
                            this.x = x;
                            this.y = y;
                        }
                        _this.BASE.SelectorFrame.dir = false;
                        PUMP_SELECTOR.Globals.Drawer.Wheel.selector = _this.BASE.SelectorFrame;
                        PUMP_SELECTOR.Globals.Drawer.AddAnimObj(lightbarleft);
                        PUMP_SELECTOR.Globals.Drawer.AddAnimObj(lightbarright);          
                        for(var d in data) 
                            if(data.hasOwnProperty(d))      
                                _this.BASE[d] = data[d];
                                        
                    }else{
                        for(var d in data) 
                            if(data.hasOwnProperty(d))      
                                _this.BASE[d] = data[d];
                            
                    
                    }
                };
                tmp.src   = this.GetHTMLDataURIFile(f.path.replace(".coord",".png"),"image/png");
            }
        } 
        PUMP_SELECTOR.Globals.LoadedData += 1;
    };
    ITEMLoader.onload = function() {
        var content = this.ls("/");
        for(var file in content.files)    {
            var f = content.files[file];
            if(content.files.hasOwnProperty(file))  {
                var tmp = new Image();
                tmp.f = f;
                tmp.onload = function() {
                    _this.ITEM[this.f.name.replace(".PNG","").replace(".png", "")] = this;
                };
                tmp.src   = this.GetHTMLDataURIFile(f.path,"image/png");
            }
        }     
    };
    EYELoader.onload = function() {
        var content = this.ls("/");
        PUMP_SELECTOR.Globals.EYEToLoad = 0;
        PUMP_SELECTOR.Globals.EYELoaded = 0;
        for(var file in content.files)    {
            var f = content.files[file];
            if(content.files.hasOwnProperty(file))  {
                var tmp = new Image();
                tmp.f = f;
                PUMP_SELECTOR.Globals.EYEToLoad += 1;
                tmp.onload = function() {
                    var fname = this.f.name.split(".")[0];
                    _this.EYE[fname] = PUMP_SELECTOR.CropImage(this,0,0,160,120);
                    _this.EYE[fname] = PUMP_SELECTOR.ResizeImage(_this.EYE[fname], 140,110);
                    PUMP_SELECTOR.Globals.EYELoaded += 1;
                    if(PUMP_SELECTOR.Globals.EYELoaded == PUMP_SELECTOR.Globals.EYEToLoad)
                        PUMP_SELECTOR.Globals.Wheel.LoadAllItems();
                };
                tmp.src   = this.GetHTMLDataURIFile(f.path,"image/png");
            }
        }         
    };
    PREVIEWLoader.onload = function() {
        var content = this.ls("/");
        for(var file in content.files)    {
            var f = content.files[file];
            if(content.files.hasOwnProperty(file))  {
                var tmp = new Image();
                tmp.f = f;
                tmp.onload = function() {
                    _this.PREVIEW[this.f.name.split(".")[0]] = this;
                };
                tmp.src   = this.GetHTMLDataURIFile(f.path,"image/png");
            }
        }     
    };    
    LEVELBARLoader.onload = function() {
        var content = this.ls("/");
        for(var file in content.files)    {
            var f = content.files[file];
            if(content.files.hasOwnProperty(file))  {
                var tmp = new Image();
                tmp.f = f;
                tmp.onload = function() {
                    _this.LEVELBAR[this.f.name.split(".")[0]] = this;
                };
                tmp.src   = this.GetHTMLDataURIFile(f.path,"image/png");
            }
        }         
    };
    
    //  The progress is the same for all. Just increment the Global LoadedData with Delta Loaded
    BASELoader.onprogress = ITEMLoader.onprogress = EYELoader.onprogress = LEVELBARLoader.onprogress = PREVIEWLoader.onprogress = function(progress)    {
        if(!this.AddedTotal)    {
            this.AddedTotal = true;
            this.LastLoaded = progress.loaded;
            PUMP_SELECTOR.Globals.LoadedData += this.LastLoaded;
            PUMP_SELECTOR.Globals.DataToLoad += progress.total;  
        }else{
            PUMP_SELECTOR.Globals.LoadedData += progress.loaded - this.LastLoaded;
            this.LastLoaded = progress.loaded;  
        }
    };
    
    BASELoader.Load();
    ITEMLoader.Load();
    EYELoader.Load();
    LEVELBARLoader.Load();
    PREVIEWLoader.Load();
    //  Properties
    this.MusicSelector = {};
    this.MusicSelector.HashMap = {
        "All Tunes"             : "ALLTUNES",
        "K-POP"                 : "KPOP",
        "Full Song"             : "FULLSONGS",
        
        "Remix"                 : "REMIX",
        "Shortcut"              : "SHORTCUT",
        "Skill Up Zone"         : "SKILLUPZONE",
        "Mission Zone"          : "MISSIONZONE",
        
        "Coop Zone"             : "COOPZONE",
        "1st-3rd"               : "1ST3RD",
        "se-extra"              : "SEEXTRA",
        "rebirth-prex3"         : "REBIRTHPREX3",
        "exceed-zero"           : "EXCEEDZERO",
        "nxnx2"                 : "NXNX2",
        
        "NX Absolute"           : "NXABSOLUTE",
        "Fiesta"                : "FIESTA",
        "Fiesta Ex"             : "FIESTAEX",
        "Fiesta 2"              : "FIESTA2"    
    }; 
    
    //  Skin Drawing function
    this.DrawP1Selector = function(ctx,x,y, scale) {
        scale = scale || 1;
        ctx.drawImage(_this.BASE.P1SELECTOR, x, y, 60*scale, 60*scale);
    }
    this.DrawChannelName = function(ctx,x,y,channel)   {
        var Map = _this.MusicSelector.HashMap[channel];
        ctx.drawImage(_this.BASE[Map], x, y);
    }
    this.DrawNumber = function(ctx,x,y,number,pad) {
        number = number || 0;
        pad = pad || 3;
        number = PUMP_SELECTOR.PadInt(number, pad);
        for(var i=0;i<number.length;i++)    {
            var v = parseInt(number[i]);
            ctx.drawImage(_this.BASE["MINI"+i],x+i*8,y  ,8,10);
        }
    }

    this.DrawBigNumber = function(ctx, x, y, number, size, pad,type) {
        number = number || 0;
        pad = pad || (number.toString().length);
        size = size || 39;
        type = type || "WHITE";
        if (number != "??" && number != "!!")
            number = PUMP_SELECTOR.PadInt(number, pad);
        for(var i=0;i<number.length;i++)    
            ctx.drawImage(_this.BASE["BIG"+type+number[i].replace("?","I").replace("!","E")] ,x+i*size,y  ,size+1,size);
        
    } 
};

