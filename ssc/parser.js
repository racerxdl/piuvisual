var fs = require('fs');

function StripComments(data)    {
    return data.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s])+\/\/(?:.*)$)/gm, '$1');
}

function CleanLines(data)       {
    if(data instanceof Array)   {
        for(var n in data)
            data[n] = data[n].trim();
        return data.filter(function(n){ return n != '' });
    }else
        return data.trim();
}

function LineObject(data)       {
    if(data instanceof Array)   {
        for(var n in data)  {
            data[n] = LineObject(data[n]);
        }
        return data.filter(function(n){ return n != '' });
    }else
        return CleanLines(data.split("\n"));
}

function ParseSSCLines(data)    {
    var reg = /\#([\s\S]*?)\;/g;
    var songdata = {
        "charts" : []
    };
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
                    case        "NOTES"             :   songdata["charts"][chart][variable]     =   LineObject(content.split(",")); break;
                    case        "BPMS"              :
                    case        "STOPS"             :
                    case        "DELAYS"            :
                    case        "WARPS"             :
                    case        "TIMESIGNATURES"    :
                    case        "TICKCOUNTS"        :
                    case        "COMBOS"            :
                    case        "SPEEDS"            :
                    case        "LABELS"            :
                    case        "SCROLLS"           :   songdata["charts"][chart][variable]     =   CleanLines(content.split(",")); break;
                    default                         :   songdata["charts"][chart][variable]     =   CleanLines(content); 
                }
            }else{              //  Looking for song data
                switch(variable)    {
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
                    case        "SCROLLS"           :   songdata[variable]      =   CleanLines(content.split(",")); break;
                    default                         :   songdata[variable]      =   CleanLines(content);
                }
                
            }
        }
    }
    return songdata;
}

fs.readFile('000.ssc', function (err, data) {
  if (err) throw err;
  data = data.toString();
  data = StripComments(data);
  var song = ParseSSCLines(data);
  console.log(song);
});
