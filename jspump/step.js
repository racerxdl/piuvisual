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
PUMPER.SoundOffset = -100;   //  Draw offset within sound, in milesseconds.
//PUMPER.SoundOffset = 0; 
/************************* StepData **************************/
PUMPER.StepData = PUMPER.StepData || function(parameters) {   
    this.currentbpm   = parameters.bpm   || 0;
    
    this.CurrentTime = 0;            //  In milesseconds
    this.CurrentBeat = 0;
    this.LastMusic = 0;
    this.CurrentSplit = 0;
    this.CurrentMysteryBlock = 0;
    this.Splits = [];                //  PUMPER.StepSplit
    
    this.CachedDisplayedBeat = [];   //  Display Beat Cache  
    
    this.BPMChanges = [];            //  {  "BPM"       : BPM,          "Start" : StartInMS }    
    this.ScrollFactorChanges = [];   //  {  "SF"        : ScrolLFactor, "Start" : StartInMS }
    this.Stops = [];                 //  {  "StopTime"  : Freeze,       "Start" : StartInMS }
    this.Warps = [];                 //  {  "WarpBeat"  : WarpBeat,     "Start" : StartInMS }
    this.MysteryBlocks = [];         //  {  "Beat"    :beat,            "Ratio":mysteryblock, "BeatSplit" : beatsplit   }
    this.CurrentStop = 0;
    this.CurrentBPMChange = 0; 
    this.CurrentScrollFactorChange = 0;  
    this.CurrentWarp = 0;
      
    this.NoteSkinBank = { "0" : 0 };
    this.Modifiers  =   [];
    this.Stopped = false;
    this.StopUntil = 0;
}
PUMPER.StepData.OffsetY = 0; // Was -64
PUMPER.StepData.CutTime = 83.3; //  ms

PUMPER.StepData.prototype.AddSplit      = function(timesplit)   {   this.Splits.push(timesplit);        };
PUMPER.StepData.prototype.AddBPMChange  = function(bpmchange)   {   
    if(this.BPMChanges.length == 0 || (this.BPMChanges.length > 0 && this.BPMChanges[this.BPMChanges.length-1].BPM != bpmchange.BPM) )    
        this.BPMChanges.push(bpmchange);    
    else
        PUMPER.debug("Not adding BPM "+bpmchange.BPM+" because "+ ( (this.BPMChanges.length > 0)?(" the older is "+this.BPMChanges[this.BPMChanges.length-1].BPM):"Oh wait, we have a problem!"));
    
};
PUMPER.StepData.prototype.AddScrollFactorChanges  = function(sf)   {   
    if(this.ScrollFactorChanges.length == 0 || (this.ScrollFactorChanges.length > 0 && this.ScrollFactorChanges[this.ScrollFactorChanges.length-1].SF != sf.SF) )    
        this.ScrollFactorChanges.push(sf);    
    else
        PUMPER.debug("Not adding ScrollFactor "+sf.SF+" because "+ ( (this.ScrollFactorChanges.length > 0)?(" the older is "+this.ScrollFactorChanges[this.ScrollFactorChanges.length-1].SF):"Oh wait, we have a problem!"));
    
};
PUMPER.StepData.prototype.RemoveLastBPMChange = function()  {
    this.BPMChanges.splice(this.BPMChanges.length-1,1);
};
PUMPER.StepData.prototype.AddStop = function(stop)  {
    this.Stops.push(stop);
};
PUMPER.StepData.prototype.AddMysteryBlock = function(mb)  {
    this.MysteryBlocks.push(mb);
};

PUMPER.StepData.prototype.AddWarp = function(Warp)  {
    this.Warps.push(Warp);
};

PUMPER.StepData.prototype.AddModifier        = function(mod) {
    this.Modifiers.push(mod);
};
PUMPER.StepData.prototype.GenerateCacheData =   function()  {
    PUMPER.log("StepData::Generating CacheData");
	var displayedBeat = 0;
	var lastRealBeat = 0;
	var lastRatio = 1;
	var lastBeatSplit = 1;
	this.CachedDisplayedBeat = [];
	for ( var i = 0; i < this.MysteryBlocks.length; i++ )
	{
		var seg = this.MysteryBlocks[i];
		displayedBeat += ( seg.Beat - lastRealBeat ) * lastRatio * lastBeatSplit;
		lastRealBeat = seg.Beat;
		lastRatio = seg.Ratio;
		lastBeatSplit = seg.BeatSplit;
		var c = {"Beat":seg.Beat, "DisplayedBeat": displayedBeat, "Ratio" : seg.Ratio, "BeatSplit" : seg.BeatSplit};
		this.CachedDisplayedBeat.push(c);
	}
	PUMPER.log("StepData::Finding Hold Ranges");
	var Holds = [{},{},{},{},{},{},{},{},{},{}];
	for (var s=0;s<this.Splits.length;s++)  {
        var rows = this.Splits[s].blocks[this.Splits[s].activeblock].rows;
        for( var r=0;r<rows.length;r++) {
            for ( var n=0;n<rows[r].notes.length;n++)   {
                var note = rows[r].notes[n];
                if(note.type == PUMPER.NoteHoldHead || note.type == PUMPER.NoteHoldHeadFake)     {   //  Get the hold start
                    if(Holds[n].beatend === undefined)  {
                        PUMPER.debug("StepData::Finding Hold Ranges () : Ops! Cannot find Hold end! :(");
                        Holds[n].beatend = rows[r].rowbeat;
                    }
                    Holds[n] = note;
                }else if(note.type == PUMPER.NoteHoldTail || note.type == PUMPER.NoteHoldTailFake || note.type == PUMPER.NoteHoldBody || note.tyoe == PUMPER.NoteHoldBodyFake)   //  Set the hold end
                    Holds[n].beatend = rows[r].rowbeat;
                
            }
        }
	}
};
PUMPER.StepData.prototype.GetDisplayBeat = function(beat)   {
        var data = this.CachedDisplayedBeat;
        var max = data.length -1 ;
        var l = 0, r = max, m;
        while( l <= r ) {
                m = (( l + r ) / 2) >> 0;
                if( ( m == 0 || data[m].Beat <= beat ) && ( m == max || beat < data[m + 1].Beat ) ) 
                        return data[m].DisplayedBeat + data[m].Ratio * (beat - data[m].Beat) * data[m].BeatSplit;
                else if( data[m].Beat <= beat )
                        l = m + 1;
                else
                        r = m - 1;
        }
        return beat;
};
PUMPER.StepData.prototype.GetCutDelta   = function()    {
    return (PUMPER.StepData.CutTime/1000) * this.currentbpm;    
};
PUMPER.StepData.prototype.GetCutDelta2   = function()    {
    return (PUMPER.StepData.CutTime/2000) * this.currentbpm;    
};
PUMPER.StepData.prototype.BeatInCutZone  = function(beat, row)    {
    var InCutZone = (this.CurrentBeat - this.GetCutDelta()) <= beat && (this.CurrentBeat) >= beat;     
    if(beat < (this.CurrentBeat - this.GetCutDelta()) && row !== undefined)
        row.passed = true;
    return InCutZone;
};
PUMPER.StepData.prototype.GetBeatY      = function(beat)        {
    var YOffset = 0;
    YOffset = PUMPER.Globals.NoteData.GetDisplayBeat(beat) - PUMPER.Globals.NoteData.GetDisplayBeat(this.CurrentBeat);
    //YOffset = (YOffset < 0)?0:YOffset;
    YOffset *= PUMPER.ScrollSpeed;
    YOffset *= PUMPER.Globals.CurrentScrollFactor;
    YOffset *= PUMPER.ArrowSize;
    YOffset += PUMPER.OffsetY + PUMPER.StepData.OffsetY+1;
    return YOffset;
};
PUMPER.StepData.prototype.Update        = function(MusicTime)   {
    var i=this.CurrentBPMChange, len=this.BPMChanges.length,
        delta = (MusicTime - this.LastMusic);
        
    this.CurrentTime  += delta;
    this.LastMusic  = MusicTime;
    
    if(!this.Stopped || ( this.Stopped && this.StopUntil < this.CurrentTime) )    {
        this.CurrentBeat += (delta * this.currentbpm) / 60;
        this.Stopped = false;
    }

    //  Changing BPM
    while(i<len)    {
        if(this.BPMChanges[i].Start > this.CurrentTime)
            break;  //  We dont have
        if(this.BPMChanges[i].Start <= this.CurrentTime)    {
            this.currentbpm = this.BPMChanges[i].BPM;
            this.CurrentBPMChange = i+1;
            PUMPER.Globals.CurrentBPM = this.BPMChanges[i].BPM;
            PUMPER.log("Changing BPM to "+this.currentbpm);
            break;
        }
        ++i;
    }
    
    //  Changing ScrollFactor
    i=this.CurrentScrollFactorChange; 
    len=this.ScrollFactorChanges.length;
    while(i<len)    {
        //if(this.ScrollFactorChanges[i].StartBeat > this.CurrentBeat)
        if(this.ScrollFactorChanges[i].Start > this.CurrentTime)
            break;  //  We dont have
        //if(this.ScrollFactorChanges[i].StartBeat <= this.CurrentBeat)    {
        if(this.ScrollFactorChanges[i].Start <= this.CurrentTime)    {
            this.currentscrollfactor = this.ScrollFactorChanges[i].SF;
            this.CurrentScrollFactorChange = i+1;
            if(!this.ScrollFactorChanges[i].Smooth) {
                PUMPER.Globals.CurrentScrollFactor = this.ScrollFactorChanges[i].SF;
                PUMPER.log("Changing CurrentScrollFactor to "+this.currentscrollfactor);
                PUMPER.Globals.SmoothScrollFactor = false;
            }else{
                if(this.ScrollFactorChanges[i].DeltaT > 0)  {
                    PUMPER.log("Smooth ScrollFactor Change from "+PUMPER.Globals.CurrentScrollFactor+" to "+this.currentscrollfactor+" in "+this.ScrollFactorChanges[i].DeltaT);
                    PUMPER.Globals.SmoothScrollFactor = true;
                    PUMPER.Globals.ScrollFactorFactor = (this.currentscrollfactor - PUMPER.Globals.CurrentScrollFactor) / this.ScrollFactorChanges[i].DeltaT; // Delta Factor / Delta Time
                    PUMPER.Globals.ScrollFactorMinus = this.currentscrollfactor < PUMPER.Globals.CurrentScrollFactor;
                    PUMPER.Globals.NextScrollFactor = this.currentscrollfactor;
                    PUMPER.Globals.BaseScrollFactor = PUMPER.Globals.CurrentScrollFactor;
                }else{
                    PUMPER.Globals.CurrentScrollFactor = this.currentscrollfactor;
                }
            }
            break;
        }
        ++i;
    }
    //  Smoothing Scrollfactor
    if(PUMPER.Globals.SmoothScrollFactor)   {
        //var x = PUMPER.Globals.CurrentScrollFactor;
        PUMPER.Globals.CurrentScrollFactor += PUMPER.Globals.ScrollFactorFactor * delta;
        if( (!PUMPER.Globals.ScrollFactorMinus && (PUMPER.Globals.CurrentScrollFactor > PUMPER.Globals.NextScrollFactor) ) || (PUMPER.Globals.ScrollFactorMinus && ( PUMPER.Globals.CurrentScrollFactor < PUMPER.Globals.NextScrollFactor ) ) )    {
            PUMPER.Globals.CurrentScrollFactor = PUMPER.Globals.NextScrollFactor;    
            PUMPER.Globals.SmoothScrollFactor = false;
        }
    }
    
    //  Doing stops
    i=this.CurrentStop; 
    len=this.Stops.length;
    while(i<len)    {
        if(this.Stops[i].Start > this.CurrentTime)
            break;    
        if(this.Stops[i].Start <= this.CurrentTime)    {
            this.Stopped = true;
            this.CurrentStop = i+1;
            this.StopUntil = this.Stops[i].StopUntil;  
            PUMPER.log("Stopping "+this.Stops[i].StopTime+" seconds. ("+this.CurrentTime+") ("+this.StopUntil+")");
        }     
        ++i;
    }
    
    //  Doing Warps
    i=this.CurrentWarp; 
    len=this.Warps.length;
    while(i<len)    {
        if(this.Warps[i].Start > this.CurrentTime +0.01)
            break;    
        if(this.Warps[i].Start <= this.CurrentTime +0.01)    {
            PUMPER.log("Warping from beat "+this.CurrentBeat+" to "+this.Warps[i].WarpBeat+" - Time: "+this.CurrentTime+" WarpTime: "+this.Warps[i].WarpTime);
            this.CurrentBeat = this.Warps[i].WarpBeat;
            this.CurrentWarp = i+1;
        }     
        ++i;
    }
};
PUMPER.StepData.prototype.GetBeatBlock = function(screenheight)    {
    var i=this.CurrentSplit, len=10,len=this.Splits.length,
    block = [],
    starty       = PUMPER.OffsetY-64,
    endy         = screenheight;
    var breakmaster = false; 
    while(i<len)    {                                               //  Iterate over splits
        var currblock = this.Splits[i].activeblock,
            n=0, nlen=this.Splits[i].blocks[currblock].rows.length;
            while(n<nlen)   {                                       //  Iterate over rows
                var row = this.Splits[i].blocks[currblock].rows[n];
                row.UpdateY(this.CurrentBeat);
                this.BeatInCutZone(row.rowbeat, row);
                if(row.y >= starty && row.y < screenheight && !row.passed && row.rowbeat > (this.CurrentBeat - this.GetCutDelta())) 
                    block.push(row);
                else if(row.y > screenheight)   {
                    breakmaster = true;
                    break;
                }
                ++n;
            }
        if(breakmaster)
            break;
        ++i;
    }
    return block;
};
/*
PUMPER.StepData.prototype.GetBeatBounds = function(screenheight)    {
    var starty = 0, endy = screenheight,
    beatstart = this.CurrentBeat + ( ( starty - PUMPER.OffsetY) / ( PUMPER.ArrowSize * PUMPER.ScrollSpeed * PUMPER.Globals.CurrentScrollFactor) ),
    beatend   = this.CurrentBeat + ( ( endy   - PUMPER.OffsetY) / ( PUMPER.ArrowSize * PUMPER.ScrollSpeed * PUMPER.Globals.CurrentScrollFactor) );
    return { "beatstart" : beatstart, "beatend" : beatend };
};*/

/************************* StepSplit **************************/
PUMPER.StepSplit  = function (parameters)   {
    this.blocks         =   parameters.blocks       ||  [new PUMPER.StepBlock({})];
    this.activeblock    =   parameters.activeblock  ||  0;
    this.beatsplit      =   parameters.beatsplit    ||  0;
    this.mysteryblock   =   (parameters.mysteryblock!==undefined)? parameters.mysteryblock : 1;
    
    this.StartTime      =   parameters.starttime    ||  0;
    this.StartBeat      =   parameters.startbeat    ||  0;
    this.BPM            =   parameters.bpm          ||  0;
    this.BPS            =   parameters.bpm / 60;
    this.Delay          =   parameters.delay        ||  0;
    this.EndTime        =   9999999999;
    this.LastBeat       =   9999999999;
    this.MBStart        =   0;
};
PUMPER.StepSplit.prototype.ComputeSplitSize = function()    {
    this.TimeDuration = this.EndTime - this.StartTime;
    this.BeatDuration = this.LastBeat - this.StartBeat;
};
PUMPER.StepSplit.prototype.AddBlock = function(block)       {   this.blocks.push(block);          };
PUMPER.StepSplit.prototype.AddRow  = function(block,row)    {   
    row.mysteryblock    =   this.mysteryblock;
    row.beatsplit       =   this.beatsplit;
    row.mbstart         =   this.mbstart;
    row.splitstart      =   this.StartBeat;
    row.currsplit       =   this;
    row.lastsplit       =   this.LastSplit;
    this.blocks[block].AddRow(row);   
}; 

/************************* StepBlock **************************/
PUMPER.StepBlock = function (parameters)    {
    this.rows = parameters.rows || [];      //  PUMPER.StepRow
};
PUMPER.StepBlock.prototype.AddRow = function (row)  {   this.rows.push(row); };

/************************* StepRow **************************/
PUMPER.StepRow  = function (parameters) {
    this.rowbeat        =   parameters.rowbeat || 0;
    this.rowtime        =   parameters.rowtime || 0;
    this.notes          =   parameters.notes   || [];    //  PUMPER.StepNote
    this.mbbeat         =   parameters.mbbeat  || 0;
    this.mysteryblock   =   (parameters.mysteryblock!==undefined)? parameters.mysteryblock : 1; 
    this.lastmboffset   =   0;
    this.beatsplit      =   4; 
    this.passwd         =   false;
};
PUMPER.StepRow.prototype.RowOnBeatOrLess = function(beat)   {
    return this.rowbeat <= beat- (1/this.beatsplit) ;
};
PUMPER.StepRow.prototype.AddNote = function(note)     { this.notes.push(note); };
PUMPER.StepRow.prototype.UpdateY = function(gamebeat) {
    //this.relativebeat = PUMPER.Globals.NoteData.GetDisplayBeat(this.rowbeat);
    this.y = PUMPER.Globals.NoteData.GetBeatY(this.rowbeat);
};
/************************* StepNote **************************/
PUMPER.StepNote = function (parameters) {
    this.type       = parameters.type     || 0;
    this.attr       = parameters.attr     || 0;
    this.seed       = parameters.seed     || 0;
    this.attr2      = parameters.attr2    || 0;
    this.opacity    = (parameters.opacity!==undefined)?parameters.opacity: 1;
    this.rotation   = parameters.rotation || 0;
};
