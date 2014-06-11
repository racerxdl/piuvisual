
/************************* SSCParser **************************/
PUMPER.SSCData = {
   "0" : PUMPER.NoteNull,
   "1" : PUMPER.NoteTap,
   "2" : PUMPER.NoteHoldHead,
   //"H" : PUMPER.NoteHoldBody,
   "3" : PUMPER.NoteHoldTail, 
   "M" : PUMPER.NoteNull,
   "^" : PUMPER.NoteFake,           //  Convert from 1*F to ^
   "%" : PUMPER.NoteHoldHeadFake,   //  Convert from 2*F to %
   "$" : PUMPER.NoteHoldTailFake,   //  Convert from 3*F to $
};

/*
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeFake]          =   PUMPER.NoteFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeItem]          =   PUMPER.NoteItem;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeEffect]        =   PUMPER.NoteEffect;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeFakeItem]      =   PUMPER.NoteItemFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldHeadFake]  =   PUMPER.NoteHoldHeadFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldBodyFake]  =   PUMPER.NoteHoldBodyFake;
PUMPER.NX20.ToPumper[PUMPER.NX20.NoteTypeHoldTailFake]  =   PUMPER.NoteHoldTailFake;

*/
PUMPER.SSC = {};
PUMPER.SSC.BEATS_PER_MEASURE = 4;
PUMPER.SSC.UNIT_BEATS = 0;
PUMPER.SSC.UNIT_SECONDS = 1;
PUMPER.SSC.VERSION_SPLIT_TIMING = 0.7;

PUMPER.SSCTools = {};
PUMPER.SSCTools.CleanLines = function(data)       {
    if(data instanceof Array)   {
        for(var n in data)
            if(data.hasOwnProperty(n))
                data[n] = data[n].trim();
        return data.filter(function(n){ return n != '' });
    }else
        return data.trim();
}

PUMPER.SSCTools.LineObject = function(data)  {
    if(data instanceof Array)   {
        for(var n in data)  {
            if(data.hasOwnProperty(n))
                data[n] = PUMPER.SSCTools.LineObject(data[n]);
        }
        return data.filter(function(n){ return n != '' });
    }else
        return PUMPER.SSCTools.CleanLines(data.split("\n"));
}

PUMPER.SSCTools.ParseSSCLines = function(data)    {
    var reg = /\#([\s\S]*?)\;/g;
    var songdata = {
        "charts" : []
    };
    data = data.replace(/1\*F/g,"^").replace(/2\*F/g,"%").replace(/3\*F/g,"$");
    var chart = -1;
    var match;
    while (match = reg.exec(data))  {
        var variable    =   match[1].split(":",1)[0];
        var content     =   match[1].replace(variable+":","");
        variable        =   variable.trim();
        if(variable == "NOTEDATA")  {
            chart += 1;
            songdata["charts"][chart] = {};
        }else{
            if(chart > -1)  {   //  Looking for chart data
                switch(variable)    {
                    case        "NOTES"             :  songdata["charts"][chart][variable]     =   PUMPER.SSCTools.LineObject(content.split(",")); break;
                    case        "BPMS"              :   
                    case        "STOPS"             :
                    case        "DELAYS"            :
                    case        "WARPS"             :
                    case        "TIMESIGNATURES"    :
                    case        "TICKCOUNTS"        :
                    case        "COMBOS"            :
                    case        "SPEEDS"            :
                    case        "LABELS"            :
                    case        "SCROLLS"           :   songdata["charts"][chart][variable]     =   PUMPER.SSCTools.CleanLines(content.split(",")); break;
                    default                         :   songdata["charts"][chart][variable]     =   PUMPER.SSCTools.CleanLines(content); 
                }
            }else{              //  Looking for song data
                switch(variable)    {
                    case        "VERSION"           :   PUMPER.log("Chart Version:  "+parseFloat(content)); songdata[variable] = parseFloat(content); break;
                    case        "BPMS"              :
                    case        "STOPS"             :
                    case        "DELAYS"            :
                    case        "WARPS"             :
                    case        "TIMESIGNATURES"    :
                    case        "TICKCOUNTS"        :
                    case        "COMBOS"            :
                    case        "SPEEDS"            :
                    case        "LABELS"            :
                    case        "BGCHANGES"         :   
                    case        "SCROLLS"           :   songdata[variable]      =   PUMPER.SSCTools.CleanLines(content.split(",")); break;
                    default                         :   songdata[variable]      =   PUMPER.SSCTools.CleanLines(content);
                }
                
            }
        }
    }
    return songdata;
}

PUMPER.SSCParser = PUMPER.SSCParser || function ( SSCText ) {
    var songdata = PUMPER.SSCTools.ParseSSCLines(SSCText);
    var curchart = songdata.charts[6];
    console.log(songdata);
    
    var SSCData     =   new PUMPER.StepData({});
    var CurSplit    =   new PUMPER.StepSplit( {} );
    
    SSCData.Mode    =   curchart.STEPSTYPE.replace("pump-","");
    
    var BPM, BPS;
    var time = 0;
    var beat = 0;
    
    var bpmblocks = [];
    var basebeat = 0;
    function FindBeatTime(beat) {
        var n=0,nmax=bpmblocks.length;
        while(n<nmax) {
            if(beat >= bpmblocks[n].start && beat < bpmblocks[n].end)  
                return bpmblocks[n].starttime + (beat - bpmblocks[n].start)/ ( bpmblocks[n].bpm / (60.0) );
            ++n;
        }
        return 999999;
    }
    
    function GetBPM(beat)   {
        var n=0,nmax=bpmblocks.length;
        while(n<nmax) {
            if(beat >= bpmblocks[n].start && beat < bpmblocks[n].end)  
                return bpmblocks[n].bpm;
            ++n;
        }
        PUMPER.log("Cannot find beat on bpmblocks: "+beat);
        return 0;       // Error   
    }
    
    function FormatSeconds(sec) {
        return Math.floor(sec/60)+":"+Math.floor(sec-Math.floor(sec/60)*60);
    }
    
    if(curchart.BPMS == undefined)
        curchart.BPMS = songdata.BPMS;
    if(curchart.SCROLLS == undefined)
        curchart.SCROLLS = songdata.SCROLLS;
    if(curchart.SPEEDS == undefined)
        curchart.SPEEDS = songdata.SPEEDS;
    if(curchart.OFFSET == undefined)
        curchart.OFFSET = songdata.OFFSET;
    if(curchart.WARPS == undefined)
        curchart.WARPS = songdata.WARPS;
        
    for(var i=0;i<curchart.BPMS.length;i++) {
        var d = curchart.BPMS[i].split("=");
        BPM = parseFloat(d[1]);
        BPM_BEAT = parseFloat(d[0]);
        BPS = BPM/60.0;
        data = {"bpm":BPM,"start":BPM_BEAT,"BPS":BPS,"end":999999,"starttime":0,"endtime":9999999};
        if(i-1 >= 0) {
            bpmblocks[i-1].end = BPM_BEAT;
            bpmblocks[i-1].endtime = bpmblocks[i-1].starttime + (bpmblocks[i-1].end - bpmblocks[i-1].start) / bpmblocks[i-1].BPS ;
            data.starttime = bpmblocks[i-1].endtime;
        }
        bpmblocks.push(data);
    }
    
    for(var i=0;i<bpmblocks.length;i++) {
        SSCData.AddBPMChange({ "BPM" : bpmblocks[i].bpm, "Start" : bpmblocks[i].starttime });
        PUMPER.log("Added BPM Change to "+bpmblocks[i].bpm+" at "+FormatSeconds(bpmblocks[i].starttime));
    }
    for(var i=0;i<curchart.WARPS.length;i++)   {
        var d = curchart.WARPS[i].split("=");
        var beat = parseFloat(d[0]);
        var NewBeat = parseFloat(d[1]);
        if(songdata.VERSION < PUMPER.SSC.VERSION_SPLIT_TIMING && NewBeat > beat)  {
            PUMPER.log("Absolute Time Warp from "+(FindBeatTime(beat))+" ms to "+FindBeatTime(NewBeat)+" ms from beat "+beat+" to beat "+NewBeat);
            SSCData.AddWarp({ "WarpBeat" : NewBeat,  "Start" : FindBeatTime(beat), "WarpTime" : FindBeatTime(NewBeat), "WarpDelta" : 0  });
        }else if( NewBeat > 0 ) {
            PUMPER.log("Relative Time Warp from "+(FindBeatTime(beat))+" ms to "+FindBeatTime(beat+NewBeat)+" ms from beat "+beat+" to beat "+(beat+NewBeat));
            SSCData.AddWarp({ "WarpBeat" : beat+NewBeat,  "Start" : FindBeatTime(beat), "WarpTime" : FindBeatTime(beat+NewBeat), "WarpDelta" : 0  });        
        }else{
            PUMPER.log("Invalid WARP at "+beat+": "+NewBeat);
        }
    }
    
    var currbblock = {"tstart":0,"start":0,"end":-1,"bpm":0,"bs":4};
    
    BPM = parseFloat(curchart.BPMS[0].split("=")[1]);
    BPS = BPM/60.0;
    
    var CBPM    =   BPM;
    var CBPS    =   CBPM/60.0;
    
    //  Negative because its music offset not beat offset
    time        -=  parseFloat(curchart.OFFSET);
    beat        -=  parseFloat(curchart.OFFSET) * CBPS
    basebeat    =   beat;
    currbblock.bpm      =   BPM;

    var lastsize = 0;
    var row;
    for(var i=0;i<curchart.NOTES.length;i++)    {
        var cnote = curchart.NOTES[i];
        if(cnote.length != lastsize)    {
            if(i>0)     {
                SSCData.AddSplit(CurSplit);
            }
            CurSplit = new PUMPER.StepSplit( {} );
            CurSplit.BPM = GetBPM(beat);
            CurSplit.BPS = GetBPM(beat) / 60;
            CurSplit.beatsplit = cnote.length / PUMPER.SSC.BEATS_PER_MEASURE;
            CurSplit.mysteryblock = PUMPER.SSC.BEATS_PER_MEASURE / cnote.length;
            lastsize = cnote.length;
        }
        
        for(var r=0;r<cnote.length;r++) {
            var note = cnote[r];
            var lnote = note.length;
            var n=0;
            var addrow = false;
            row = new PUMPER.StepRow({"rowbeat" : beat, "rowtime" : time});  
            while(n<lnote)    {
                addrow |= (note[n]!="0");
                if(note[n] in PUMPER.SSCData)
                    row.AddNote(new PUMPER.StepNote({"type" : PUMPER.SSCData[note[n]]}));
                else{
                    PUMPER.log("Note type not know: "+note[n]+" code  "+note[n].charCodeAt(0));
                    row.AddNote(new PUMPER.StepNote({"type" : PUMPER.SSCData["0"]}));
                }
                ++n;
            }
            beat +=  1.0 / CurSplit.beatsplit;
			time +=  1.0 / (CurSplit.beatsplit * CurSplit.BPS);
            if(addrow)
                CurSplit.AddRow(0, row); 
        }  
    }
    for(var i=0;i<curchart.SPEEDS.length;i++)   {
        var d = curchart.SPEEDS[i].split("=");
        var beat = parseFloat(d[0]);
        var ratio = parseFloat(d[1]);  
        var delay = parseFloat(d[2]);
        var unit = PUMPER.SSC.UNIT_BEATS;
        if(d.length > 3)      
            unit = d[3]=="0"?PUMPER.SSC.UNIT_BEATS:PUMPER.SSC.UNIT_SECONDS;
        if(unit == PUMPER.SSC.UNIT_BEATS)   {
            SSCData.AddScrollFactorChanges({ "SF": ratio, "Start": FindBeatTime(beat), "Smooth" : true, "StartBeat": beat, "DeltaT" : FindBeatTime(beat+delay)-FindBeatTime(beat)});
            PUMPER.log("Adding Scroll Factor Change to "+ratio+" at beat "+beat+" ("+FindBeatTime(beat)+")");
        }else
            PUMPER.log("UNIT_SECONDS not supported at SPEEDS. Ignoring");
    }
    for(var i=0;i<curchart.SCROLLS.length;i++)  {
    //{ "SF": speed, "Start": (steptime/1000) + PUMPER.SoundOffset / 1000, "Smooth" : (smoothspeed>0), "StartBeat": beat}
        var d = curchart.SCROLLS[i].split("=");
        var beat = parseFloat(d[0]);
        var speed = parseFloat(d[1]);
        SSCData.AddMysteryBlock({"Beat":beat , "Ratio":speed/PUMPER.SSC.BEATS_PER_MEASURE, "BeatSplit" : PUMPER.SSC.BEATS_PER_MEASURE});
        //console.log("Adding SF: ",{ "SF": speed, "Start": FindBeatTime(beat) + PUMPER.SoundOffset / 1000, "Smooth" : true, "StartBeat": beat});
    }   
    
    SSCData.GenerateCacheData();
	return SSCData;
};


