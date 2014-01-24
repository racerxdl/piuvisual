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
/*  This is the data for NX20   */
PUMPER.NX20 = {};

/*  This is specific from NX20  */
PUMPER.NX20.NoteTypeNull        =   0x00;

PUMPER.NX20.NoteTypeEffect      =   0x41;   //  0b01000001
PUMPER.NX20.NoteTypeDivBrain    =   0x42;   //  0b01000010
PUMPER.NX20.NoteTypeFake        =   0x23;   //  0b00100011
PUMPER.NX20.NoteTypeTap         =   0x43;   //  0b01000011
PUMPER.NX20.NoteTypeHoldHeadFake=   0x37;   //  0b00110111
PUMPER.NX20.NoteTypeHoldHead    =   0x57;   //  0b01010111
PUMPER.NX20.NoteTypeHoldBodyFake=   0x3b;   //  0b00111011
PUMPER.NX20.NoteTypeHoldBody    =   0x5B;   //  0b01011011
PUMPER.NX20.NoteTypeHoldTailFake=   0x3f;   //  0b00111111
PUMPER.NX20.NoteTypeHoldTail    =   0x5F;   //  0b01011111
PUMPER.NX20.NoteTypeFakeItem    =   0x21;   //  0b00100001
PUMPER.NX20.NoteTypeItem        =   0x61;   //  0b01100001
PUMPER.NX20.NoteTypeRow         =   0x80;   //  0b10000000

  
/*  Effect Stuff    */
/*
                            [Type, Attr, Seed, Attr2]
    Explosion at screen:    [65,      0,   22,   192]
    Random Items at screen: [65,      3,   11,   192]
*/ 

/*  Metadata Stuff  */
PUMPER.NX20.MetaUnknownM                =   0;

PUMPER.NX20.MetaNonStep                 =   16;
PUMPER.NX20.MetaFreedom                 =   17;
PUMPER.NX20.MetaVanish                  =   22;
PUMPER.NX20.MetaAppear                  =   32;
PUMPER.NX20.MetaHighJudge               =   64;
PUMPER.NX20.UnknownMeta0                =   80;
PUMPER.NX20.UnknownMeta1                =   81;
PUMPER.NX20.UnknownMeta2                =   82;
PUMPER.NX20.MetaStandBreak              =   83;

PUMPER.NX20.MetaNoteSkinBank0           =   900;
PUMPER.NX20.MetaNoteSkinBank1           =   901;
PUMPER.NX20.MetaNoteSkinBank2           =   902;
PUMPER.NX20.MetaNoteSkinBank3           =   903;
PUMPER.NX20.MetaNoteSkinBank4           =   904;
PUMPER.NX20.MetaNoteSkinBank5           =   905;
PUMPER.NX20.MetaMissionLevel            =   1000;
PUMPER.NX20.MetaChartLevel              =   1001;
PUMPER.NX20.MetaNumberPlayers           =   1002; 

PUMPER.NX20.MetaFloor1Level             =   1101;
PUMPER.NX20.MetaFloor2Level             =   1201;
PUMPER.NX20.MetaFloor3Level             =   1301;
PUMPER.NX20.MetaFloor4Level             =   1401;

PUMPER.NX20.MetaFloor1UnkSpec0          =   1103;
PUMPER.NX20.MetaFloor2UnkSpec0          =   1203;
PUMPER.NX20.MetaFloor3UnkSpec0          =   1303;
PUMPER.NX20.MetaFloor4UnkSpec0          =   1403;

PUMPER.NX20.MetaFloor1UnkSpec1          =   1110;
PUMPER.NX20.MetaFloor2UnkSpec1          =   1210;
PUMPER.NX20.MetaFloor3UnkSpec1          =   1310;
PUMPER.NX20.MetaFloor4UnkSpec1          =   1410;

PUMPER.NX20.MetaFloor1UnkSpec2          =   1111;
PUMPER.NX20.MetaFloor2UnkSpec2          =   1211;
PUMPER.NX20.MetaFloor3UnkSpec2          =   1311;
PUMPER.NX20.MetaFloor4UnkSpec2          =   1411;

PUMPER.NX20.MetaFloor1Spec              =   1150;
PUMPER.NX20.MetaFloor2Spec              =   1250;
PUMPER.NX20.MetaFloor3Spec              =   1350;
PUMPER.NX20.MetaFloor4Spec              =   1450;

PUMPER.NX20.MetaFloor1MissionSpec0      =   66639;
PUMPER.NX20.MetaFloor2MissionSpec0      =   66739;
PUMPER.NX20.MetaFloor3MissionSpec0      =   66839;
PUMPER.NX20.MetaFloor4MissionSpec0      =   66939;

PUMPER.NX20.MetaFloor1MissionSpec1      =   132175;
PUMPER.NX20.MetaFloor2MissionSpec1      =   132275;
PUMPER.NX20.MetaFloor3MissionSpec1      =   132375;
PUMPER.NX20.MetaFloor4MissionSpec1      =   132475;

PUMPER.NX20.MetaFloor1MissionSpec2      =   197711;
PUMPER.NX20.MetaFloor2MissionSpec2      =   197811;
PUMPER.NX20.MetaFloor3MissionSpec2      =   197911;
PUMPER.NX20.MetaFloor4MissionSpec2      =   198011;

PUMPER.NX20.MetaFloor1MissionSpec3      =   263247;
PUMPER.NX20.MetaFloor2MissionSpec3      =   263347;
PUMPER.NX20.MetaFloor3MissionSpec3      =   263447;
PUMPER.NX20.MetaFloor4MissionSpec3      =   263547;

/*  Mod2String  */
PUMPER.NX20.ModToString         =   function(mod)   {
    switch(mod) {
        case PUMPER.NX20.MetaNonStep        :   return  "NonStep";
        case PUMPER.NX20.MetaFreedom        :   return  "Freedom";
        case PUMPER.NX20.MetaVanish         :   return  "Vanish";
        case PUMPER.NX20.MetaAppear         :   return  "Appear";
        case PUMPER.NX20.MetaHighJudge      :   return  "High Judge";
        case PUMPER.NX20.MetaStandBreak     :   return  "Stand Break On";
        default                             :   return  "Unknown";
    }
}

/*  Map NX20->Pumper    */
PUMPER.NX20.ToPumper = {};

PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeNull]          =   PUMPER.NoteNull;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeTap]           =   PUMPER.NoteTap;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldHead]      =   PUMPER.NoteHoldHead;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldBody]      =   PUMPER.NoteHoldBody;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldTail]      =   PUMPER.NoteHoldTail;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeFake]          =   PUMPER.NoteFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeItem]          =   PUMPER.NoteItem;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeEffect]        =   PUMPER.NoteEffect;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeFakeItem]      =   PUMPER.NoteItemFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldHeadFake]  =   PUMPER.NoteHoldHeadFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldBodyFake]  =   PUMPER.NoteHoldBodyFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldTailFake]  =   PUMPER.NoteHoldTailFake;


/*  Deduced ATTRs */
PUMPER.NX20.NoteAttrRandomSkin      =   0x3;
PUMPER.NX20.NoteAttrSnake           =   0x10;

/*  This is from NX20, but also used on PUMPER, so we only map it   */
PUMPER.NX20.NoteSeedAction          =   PUMPER.NoteSeedAction;
PUMPER.NX20.NoteSeedShield          =   PUMPER.NoteSeedShield;
PUMPER.NX20.NoteSeedChange          =   PUMPER.NoteSeedChange; 
PUMPER.NX20.NoteSeedAcceleration    =   PUMPER.NoteSeedAcceleration;
PUMPER.NX20.NoteSeedFlash           =   PUMPER.NoteSeedFlash;
PUMPER.NX20.NoteSeedMineTap         =   PUMPER.NoteSeedMineTap;
PUMPER.NX20.NoteSeedMineHold        =   PUMPER.NoteSeedMineHold; 
PUMPER.NX20.NoteSeedAttack          =   PUMPER.NoteSeedAttack;
PUMPER.NX20.NoteSeedDrain           =   PUMPER.NoteSeedDrain;
PUMPER.NX20.NoteSeedHeart           =   PUMPER.NoteSeedHeart;
PUMPER.NX20.NoteSeedSpeed2          =   PUMPER.NoteSeedSpeed2;
PUMPER.NX20.NoteSeedRandom          =   PUMPER.NoteSeedRandom;
PUMPER.NX20.NoteSeedSpeed3          =   PUMPER.NoteSeedSpeed3;
PUMPER.NX20.NoteSeedSpeed4          =   PUMPER.NoteSeedSpeed4;
PUMPER.NX20.NoteSeedSpeed8          =   PUMPER.NoteSeedSpeed8;
PUMPER.NX20.NoteSeedSpeed1          =   PUMPER.NoteSeedSpeed1;
PUMPER.NX20.NoteSeedPotion          =   PUMPER.NoteSeedPotion; 
PUMPER.NX20.NoteSeedRotate0         =   PUMPER.NoteSeedRotate0;
PUMPER.NX20.NoteSeedRotate90        =   PUMPER.NoteSeedRotate90; 
PUMPER.NX20.NoteSeedRotate180       =   PUMPER.NoteSeedRotate180;
PUMPER.NX20.NoteSeedRotate270       =   PUMPER.NoteSeedRotate270; 
PUMPER.NX20.NoteSeedSpeed_          =   PUMPER.NoteSeedSpeed_;
PUMPER.NX20.NoteSeedBomb            =   PUMPER.NoteSeedBomb; 
PUMPER.NX20.NoteSeedHyperPotion     =   PUMPER.NoteSeedHyperPotion;

PUMPER.NXParser = PUMPER.NXParser || function ( nxdata ) {
    var head = struct.unpack("cccc", nxdata.slice(0,4)).join("");
    switch(head){
        case "NX10":    return PUMPER.NX10Parser(nxdata); break;
        case "NX20":    return PUMPER.NX20Parser(nxdata); break;
        default:        PUMPER.debug("Invalid Data Magic: "+head);
    }
};


PUMPER.NX10Parser = PUMPER.NX20Parser || function ( data ) {
    PUMPER.debug("Not implemented.");
};
PUMPER.NX20StepParse = function ( stepdata ) {
    if(!(stepdata[0] in PUMPER.NX20.ToPumper))
        PUMPER.debug("NX20StepParse: Unknown type: "+stepdata[0]+" from ("+stepdata+")");
    if(stepdata[0] == PUMPER.NX20.NoteTypeEffect || stepdata[0] == PUMPER.NX20.NoteTypeFakeItem)   {
        if(stepdata[1] == 3 && stepdata[2] == 11) //  Random Item Effect
            return new PUMPER.StepNote({"type" : PUMPER.NoteItemFake, "attr" : 0, "seed" : (Math.random()*24) >>> 0, "attr2" : 0});
        else
            return new PUMPER.StepNote({"type" : PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeEffect], "attr" : stepdata[1], "seed" : stepdata[2], "attr2" : stepdata[3]});
    }else
        return new PUMPER.StepNote({"type" : PUMPER.NX20.ToPumper[stepdata[0]], "attr" : stepdata[1], "seed" : stepdata[2], "attr2" : stepdata[3]});
        
};
PUMPER.NX20Parser = PUMPER.NX20Parser || function ( data ) {
    PUMPER.debug("Yuuupi! NX20! Size: "+data.byteLength);
    
    /*  Step data */
    var time = 0;
    var beat = 0;                   //  Offset added later
    var beatOffsetAdded = false;    //  Prevent double adding to offset    
    var mbbeat = 0;
    var lastoffset = 0;
    var lastmb = 1;
    var NX20Data = new PUMPER.StepData({});
    var CurSplit;
    var row;
    
    function SetOffset(BPS)    {
        if(!beatOffsetAdded)    {
            console.log("Adding offset: "+PUMPER.SoundOffset+" beat: "+(PUMPER.SoundOffset * BPS / 1000));
            beat += PUMPER.SoundOffset * BPS / 1000;
            time += PUMPER.SoundOffset / 1000;
            beatOffsetAdded = true;
        }
    }
    
    /*  Parser Data */
    var offset = 0;
    var starting_column     =   struct.unpack("I", data.slice(4,8))[0];
    var numcolumns          =   struct.unpack("I", data.slice(8,12))[0];
    var lightmap            =   struct.unpack("I", data.slice(12,16))[0];
    var metadatablocks      =   struct.unpack("I", data.slice(16,20))[0];
    
    NX20Data.StartColumn    =   starting_column;
    NX20Data.NumColumns     =   numcolumns;
    NX20Data.Mode           =   (numcolumns==10)?"Double":"Single";
    NX20Data.Lightmap       =   lightmap;
    
    PUMPER.debug("NX20(Head) \n-   Starting Column: "+starting_column+"\n-   Number of Columns: "+numcolumns+"\n-   Mode: "+NX20Data.Mode+"\n-   Lightmap: "+lightmap+"\n-   Metadata Blocks: "+metadatablocks);
    offset = 20;
    
    /*  Parse metadata blocks   */
    var metadata = [];
    var floors   = [];
    var currentfloor;
    
    var idx, value;
    for(var i=0;i<metadatablocks;i++)   {
        idx = struct.unpack("I", data.slice(offset,offset+4))[0]
        value = struct.unpack("I", data.slice(offset+4,offset+8))[0]
        //   ID - 1001 for level
        metadata.push({"id":idx,"value":value});
        offset += 8;
        
        switch(idx)  {
            case PUMPER.NX20.MetaUnknownM           :   NX20Data.MetaUnknownM   =   value;  PUMPER.debug("NX20(Metadata) Setting MetaUnknownM to "+value); break;
            /*  Noteskin Banks  */
            case PUMPER.NX20.MetaNoteSkinBank0      :   
            case PUMPER.NX20.MetaNoteSkinBank1      :   
            case PUMPER.NX20.MetaNoteSkinBank2      :   
            case PUMPER.NX20.MetaNoteSkinBank3      :   
            case PUMPER.NX20.MetaNoteSkinBank4      :   
            case PUMPER.NX20.MetaNoteSkinBank5      :   
                NX20Data.NoteSkinBank   [idx-900]   =   (value==254)?0:value;  PUMPER.debug("NX20(Metadata) Setting Noteskin Bank "+(idx-900)+" to "+value); break;
            /*  Modifiers   */
            case PUMPER.NX20.MetaNonStep            :
            case PUMPER.NX20.MetaFreedom            :
            case PUMPER.NX20.MetaVanish             :
            case PUMPER.NX20.MetaAppear             :
            case PUMPER.NX20.MetaHighJudge          :
            case PUMPER.NX20.MetaStandBreak         :   
                if(value==1)    { 
                    NX20Data.AddModifier(idx);
                    PUMPER.debug("NX20(Metadata) Adding modifier "+PUMPER.NX20.ModToString(idx));
                }
            break;
            case PUMPER.NX20.UnknownMeta0           :   NX20Data.UnkMeta0   =   value;  PUMPER.debug("NX20(Metadata) Setting unknown meta 0 to " + value); break; 
            case PUMPER.NX20.UnknownMeta1           :   NX20Data.UnkMeta1   =   value;  PUMPER.debug("NX20(Metadata) Setting unknown meta 1 to " + value); break; 
            case PUMPER.NX20.UnknownMeta2           :   NX20Data.UnkMeta2   =   value;  PUMPER.debug("NX20(Metadata) Setting unknown meta 2 to " + value); break;   
            /*  Floor Data  */
            case PUMPER.NX20.MetaFloor1Level        :   currentfloor    =   { "id" : 1, "level" : value };   floors.push(currentfloor); PUMPER.debug("NX20(Metadata) Adding floor "+currentfloor.id+" level "+value); break;   
            case PUMPER.NX20.MetaFloor2Level        :   currentfloor    =   { "id" : 2, "level" : value };   floors.push(currentfloor); PUMPER.debug("NX20(Metadata) Adding floor "+currentfloor.id+" level "+value); break;  
            case PUMPER.NX20.MetaFloor3Level        :   currentfloor    =   { "id" : 3, "level" : value };   floors.push(currentfloor); PUMPER.debug("NX20(Metadata) Adding floor "+currentfloor.id+" level "+value); break;  
            case PUMPER.NX20.MetaFloor4Level        :   currentfloor    =   { "id" : 4, "level" : value };   floors.push(currentfloor); PUMPER.debug("NX20(Metadata) Adding floor "+currentfloor.id+" level "+value); break;  
            case PUMPER.NX20.MetaFloor1Spec         :   
            case PUMPER.NX20.MetaFloor2Spec         :
            case PUMPER.NX20.MetaFloor3Spec         :
            case PUMPER.NX20.MetaFloor4Spec         :   currentfloor.spec   =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" spec to "+value);break;

            case PUMPER.NX20.MetaFloor1MissionSpec0 :
            case PUMPER.NX20.MetaFloor2MissionSpec0 :
            case PUMPER.NX20.MetaFloor3MissionSpec0 :
            case PUMPER.NX20.MetaFloor4MissionSpec0 :   currentfloor.mspec0 =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" mission spec 0 to "+value); break;

            case PUMPER.NX20.MetaFloor1MissionSpec1 :
            case PUMPER.NX20.MetaFloor2MissionSpec1 :
            case PUMPER.NX20.MetaFloor3MissionSpec1 :
            case PUMPER.NX20.MetaFloor4MissionSpec1 :   currentfloor.mspec1 =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" mission spec 1 to "+value); break;

            case PUMPER.NX20.MetaFloor1MissionSpec2 :
            case PUMPER.NX20.MetaFloor2MissionSpec2 :
            case PUMPER.NX20.MetaFloor3MissionSpec2 :
            case PUMPER.NX20.MetaFloor4MissionSpec2 :   currentfloor.mspec2 =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" mission spec 2 to "+value); break;

            case PUMPER.NX20.MetaFloor1MissionSpec3 :
            case PUMPER.NX20.MetaFloor2MissionSpec3 :
            case PUMPER.NX20.MetaFloor3MissionSpec3 :
            case PUMPER.NX20.MetaFloor4MissionSpec3 :   currentfloor.mspec3 =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" mission spec 3 to "+value); break;
            
            case PUMPER.NX20.MetaFloor1UnkSpec0     :   
            case PUMPER.NX20.MetaFloor2UnkSpec0     :
            case PUMPER.NX20.MetaFloor3UnkSpec0     :
            case PUMPER.NX20.MetaFloor4UnkSpec0     :   currentfloor.unkspec0   =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" unknown spec 0 to "+value); break;

            case PUMPER.NX20.MetaFloor1UnkSpec1     :
            case PUMPER.NX20.MetaFloor2UnkSpec1     :
            case PUMPER.NX20.MetaFloor3UnkSpec1     :
            case PUMPER.NX20.MetaFloor4UnkSpec1     :   currentfloor.unkspec1   =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" unknown spec 1 to "+value); break;

            case PUMPER.NX20.MetaFloor1UnkSpec2     :
            case PUMPER.NX20.MetaFloor2UnkSpec2     :
            case PUMPER.NX20.MetaFloor3UnkSpec2     :
            case PUMPER.NX20.MetaFloor4UnkSpec2     :   currentfloor.unkspec2   =   value;  PUMPER.debug("NX20(Metadata) Setting Floor "+currentfloor.id+" unknown spec 2 to "+value); break;

            /*  Chart Data  */
            case PUMPER.NX20.MetaChartLevel     :   NX20Data.Level          =   value;  PUMPER.debug("NX20(Metadata) Setting chart level to "+value);break;
            case PUMPER.NX20.MetaMissionLevel   :   NX20Data.MissionLevel   =   value;  PUMPER.debug("NX20(Metadata) Setting chart mission level to "+value);break;
            case PUMPER.NX20.MetaNumberPlayers  :   NX20Data.NumberPlayers  =   value;  PUMPER.debug("NX20(Metadata) Setting number of players to "+value); break;
            default:
                PUMPER.debug("NX20(Metadata) Metadata Block("+idx+") = "+value);
        }
    }
    NX20Data.MetaData = metadata;
    var numsplits = struct.unpack("I", data.slice(offset,offset+4))[0];
    offset += 4;
    PUMPER.debug("NX20() Number of splits: "+numsplits);
    /*  Parse Splits    */
    var systemselected, metadatablocks, numblocks, steptime, bpm, mysterblock, delay, speed, beatsplit, beatmeasure, freeze, smoothspeed, unknownflag, divisionconds;
    var LastScrollFactor;
    var DivConditions;
    var Warp = false;
    for(var i=0;i<numsplits;i++)    {
	    /*  Split Head */
	    systemselected  =   struct.unpack("I", data.slice(offset,offset+4))[0];
	    metadatablocks  =   struct.unpack("I", data.slice(offset+4,offset+8))[0];
	    splitmetadata   =   [];
	    offset += 8;
	    for(var m=0;m<metadatablocks;m++)   {
            idx = struct.unpack("I", data.slice(offset,offset+4))[0]
            value = struct.unpack("I", data.slice(offset+4,offset+8))[0]
            //   ID - 1001 for level
            splitmetadata.push({"id":idx,"value":value});
            offset += 8;	        
	    }
	    
	    numblocks       =   struct.unpack("I", data.slice(offset,offset+4))[0];
	    offset          +=  4;
	    PUMPER.debug(   "NX20(Split) Split("+i+")"+
                        "\n-    System Selected: "+systemselected+
                        "\n-    Metadata Blocks: "+metadatablocks+
                        "\n-    Number of Blocks: "+numblocks);
        // Current, I dont know how the System Selected works, so I will just throw as it was random.
        //  When System Selected = 0, The real machine always return the first block.
        
        var SelectedBlock = (systemselected==0)?0:(Math.random()*numblocks) >> 0;
                  
	    /*  Block Process   */
	    for(var blk=0;blk<numblocks;blk++)  {
	        steptime        =   struct.unpack("f", data.slice(offset+0,offset+4))[0];
	        bpm             =   struct.unpack("f", data.slice(offset+4,offset+8))[0];
	        mysteryblock    =   struct.unpack("f", data.slice(offset+8,offset+12))[0];
	        delay           =   struct.unpack("f", data.slice(offset+12,offset+16))[0];
	        speed           =   struct.unpack("f", data.slice(offset+16,offset+20))[0];
	        beatsplit       =   struct.unpack("B", data.slice(offset+20,offset+21))[0];
            beatmeasure     =   struct.unpack("B", data.slice(offset+21,offset+22))[0];
	        smoothspeed     =   struct.unpack("B", data.slice(offset+22,offset+23))[0];
	        unknownflag     =   struct.unpack("B", data.slice(offset+23,offset+24))[0];
	        divisionconds   =   struct.unpack("I", data.slice(offset+24,offset+28))[0];
	        freeze          =   (speed<0);
	        offset          +=  28;
            DivConditions   =   [];
            for(var div=0;div<divisionconds;div++)  {
                idx = struct.unpack("I", data.slice(offset,offset+4))[0];
                p1 = struct.unpack("h", data.slice(offset+4,offset+6))[0];
                p2 = struct.unpack("h", data.slice(offset+6,offset+8))[0];
                //   ID - 1001 for level
                DivConditions.push({"id":idx,"p1":p1,"p2":p2}); 
                PUMPER.debug("NX20(Contition) ID: "+idx+" ("+p1+","+p2+")");               
                offset += 8;
            }
            SetOffset(bpm/60); // Add offset if needed 
	        numrows         =   struct.unpack("I", data.slice(offset,offset+4))[0]
	        offset += 4;
	        if(SelectedBlock != blk)   {
	            PUMPER.debug("NX20(Block) Block("+blk+") Block skipped by random.");
	            for(var n=0; n<numrows;n++) {
	                var rowt =  struct.unpack("BBBB", data.slice(offset,offset+4));
	                offset  +=  4;
	                if(rowt[0] == PUMPER.NX20.NoteTypeRow) {
	                    /*  Empty Line  */
	                }else{
	                    for(var k=0;k<(numcolumns-1);k++)   {
	                        rowt =  struct.unpack("BBBB", data.slice(offset,offset+4));
	                        offset += 4;
                        }
	                }
                }	            
	        }else{
                speed = Math.abs(speed);
                PUMPER.debug(   "NX20(Block) Block("+blk+")"+
                                "\n-    StepTime: "+steptime+
                                "\n-    BPM: "+bpm+
                                "\n-    Mystery Block: "+mysteryblock+
                                "\n-    Delay: "+delay+
                                "\n-    Freeze: "+freeze+
                                "\n-    Speed: "+speed+
                                "\n-    Beat Split: "+beatsplit+
                                "\n-    Beat Measure: "+beatmeasure+
                                "\n-    Smooth Speed:   "+smoothspeed+
                                "\n-    Unknown Flag:   "+unknownflag+
                                "\n-    Division Conditions:    "+divisionconds+
                                "\n-    Number of Rows: "+numrows);  
	            
	            var lastsplit = CurSplit;
                if(CurSplit !== undefined)   {
                    CurSplit.LastBeat = beat ;
                    CurSplit.LastBeatMB = ( beat - CurSplit.StartBeat) * CurSplit.mysteryblock + CurSplit.StartBeat;
                    CurSplit.EndTime = time;
                    CurSplit.ComputeSplitSize();
                }
                CurSplit = new PUMPER.StepSplit( {} );
                CurSplit.StartTime      =   time;
                CurSplit.StartBeat      =   beat;
                CurSplit.BPM            =   bpm;
                CurSplit.BPS            =   bpm / 60;
                CurSplit.Delay          =   delay/1000;
                CurSplit.beatsplit      =   beatsplit;
                CurSplit.mysteryblock   =   mysteryblock;
                CurSplit.LastSplit      =   lastsplit;
                CurSplit.DivConditions  =   divisionconds;
                //NX20Data.AddBPMChange({ "BPM" : bpm, "Start" : time });
                NX20Data.AddBPMChange({ "BPM" : bpm, "Start": steptime/1000});
                
                
                //var sf = { "SF": speed, "Start": time, "Smooth" : (smoothspeed>0), "StartBeat": beat};
                var sf = { "SF": speed, "Start": (steptime/1000) + PUMPER.SoundOffset / 1000, "Smooth" : (smoothspeed>0), "StartBeat": beat};
                if(LastScrollFactor !== undefined)  
                    LastScrollFactor["DeltaT"] = (steptime/1000) - LastScrollFactor.Start + PUMPER.SoundOffset / 1000;
                
                LastScrollFactor = sf;
                //PUMPER.log("NX20(Block) Block("+blk+"): Adding Scroll Factor Change"
                NX20Data.AddScrollFactorChanges(sf);
                NX20Data.AddSplit(CurSplit);
                

                if(NX20Data.currentbpm == 0) {
                    NX20Data.currentbpm = CurSplit.BPM;
                    PUMPER.Globals.CurrentBPM = CurSplit.BPM;
                }
                //console.log("NX20(Block) Block("+blk+"): MysteryBlock of "+mysteryblock+" at "+beat);
                NX20Data.AddMysteryBlock({"Beat":beat , "Ratio":mysteryblock, "BeatSplit" : beatsplit});
                if(steptime >= 0)   {                    
                    if(freeze)
                        NX20Data.AddStop({"StopUntil" : time + CurSplit.Delay , "StopTime": CurSplit.Delay, "Start" : time });
                    else{
                        beat += CurSplit.Delay * CurSplit.BPS 
                    }   
                }else
                    beat += CurSplit.Delay * CurSplit.BPS 
                time += CurSplit.Delay;
                // Detect Warp
                if(Math.round(steptime*1000 + PUMPER.SoundOffset*1000) != Math.round(time*1000*1000))    {
                    // Lets do an warp!
                    var WarpBeat = ((steptime/1000) - time ) * CurSplit.BPS + beat;
                    PUMPER.log("NX20(Block) Block("+blk+"): Time Warp from "+(steptime)+" ms to "+time*1000+" ms from beat "+WarpBeat+" to beat "+beat);
                    NX20Data.AddWarp({ "WarpBeat" : beat /*+ 1.0 / CurSplit.beatsplit*/,  "Start" : (steptime/1000), "WarpTime" : time, "WarpDelta" : time - (steptime/1000) });
                }                    
	            /*  Parse Notes */
	            for(var n=0; n<numrows;n++) {
	                var rowt =  struct.unpack("BBBB", data.slice(offset,offset+4));
	                offset  +=  4;
	                if(rowt[0] == PUMPER.NX20.NoteTypeRow) {
	                    /*  Empty Line  */
	                }else{
	                    row = new PUMPER.StepRow({"rowbeat" : beat, "rowtime" : time, "mbbeat" : mbbeat, "mysteryblock" : CurSplit.mysteryblock});
	                    row.AddNote(PUMPER.NX20StepParse(rowt));
	                    
	                    for(var k=0;k<(numcolumns-1);k++)   {
	                        rowt =  struct.unpack("BBBB", data.slice(offset,offset+4));
	                        offset += 4;
	                        row.AddNote(PUMPER.NX20StepParse(rowt)); 
	                    }
	                    CurSplit.AddRow(0, row);
	                }
	                mbbeat += mysteryblock * beatsplit;
	                beat +=  1.0 / CurSplit.beatsplit;
			        time +=  1.0 / (CurSplit.beatsplit * CurSplit.BPS);
	            }
            }
	   }
    }
    //PUMPER.debug("NX20() Noteskins used by this chart: "+NX20Data.NoteSkins);
    NX20Data.GenerateCacheData();
    return NX20Data;
};
