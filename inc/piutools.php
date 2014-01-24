<?
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
function GetArrayLine($f)   {
    $data = fgetcsv($f);
    if($data !== FALSE) {
        /*
        foreach( $data as $key => $val ) {
            $data[$key] = trim( $data[$key] );
            $data[$key] = iconv('EUC-KR', 'UTF-8', $data[$key]."\0") ;
            $data[$key] = str_replace('""', '"', $data[$key]);
            $data[$key] = preg_replace("/^\"(.*)\"$/sim", "$1", $cols[$key]);
        }*/
        return $data;
    }else
        return false;
}

function BuildSongList($f)  {
    $head = GetArrayLine($f);
    $songs = array();
    while( ($data = GetArrayLine($f)) !== false)   {
        if($data[0] != "FFFFFFFF" && $data[1] != "NO_SONG")  {
            $song = array();
            foreach( $data as $key => $val )    {
                if(!empty($head[$key]))
                    $song[$head[$key]] = $val;
            }
            $song["charts"] = array();
            $songs[$song["ID"]] = $song;
         }
    }
    return $songs;
}

function BuildStepList($f)  {
    $head = GetArrayLine($f);
    $songs = array();
    while( ($data = GetArrayLine($f)) !== false)   {
        if($data[0] != "FFFFFFFF" && $data[1] != "NO_SONG")  {
            $song = array();
            foreach( $data as $key => $val )    {
                if(!empty($head[$key]))
                    $song[$head[$key]] = $val;
            }
            array_push($songs, $song);
         }
    }
    return $songs;
}
function sorter($num)
{
    for ($i=0;$i<=count($num)-1;$i++)
{
    if($num[$i]>$num[$i+1])
    {
        //echo $num[$i].':'.$num[$i+1].'<br>';
        $temp=$num[$i];
        $num[$i]=$num[$i+1];
        $num[$i+1]=$temp;
        $num=sorter($num);
    }
    
    }
    return $num;
}
function SortSongs($songlist)   {
    $sorted = array();
    
    foreach($songlist as $id => $song)  {
        $sorted[base_convert($id,16,10)] = $song;
    }
    ksort($sorted);
    return $sorted;
}

function FillStepList($songs,$steps) {
    foreach($steps as $step)    {
        if(array_key_exists($step["PreviewChartOffset"],$songs))
            array_push($songs[$step["PreviewChartOffset"]]["charts"], $step);
    }
    return $songs;
}

function BuildJSONList($songlist)   {
    $typemask = array(
        0x02 => array("double","single"),
        0x01 => array("performance","")
        //0x10 => array("another",""),
        //0x20 => array("newsong",""),
        //0x40 => array("hidden","")
    );
    $gamelist  = array(
        "0"  => "All Tunes",
        "1"  => "1st-3rd",      //  1st Dance Floor
        "2"  => "1st-3rd",      //  2nd Dance Floor
        "3"  => "1st-3rd",      //  3rd Dance Floor
        "4"  => "se-extra",     //  The O.B.G.
        "5"  => "se-extra",     //  Perfect Collection
        "6"  => "se-extra",     //  Extra
        "7"  => "rebirth-prex3",//  Rebirth
        "8"  => "rebirth-prex3",//  The Premiere 2
        "9"  => "rebirth-prex3",//  The Prex 2
        "10" => "rebirth-prex3",//  The Premiere 3
        "11" => "rebirth-prex3",//  Prex 3
        "12" => "exceed-zero",  //  Exceed 
        "13" => "exceed-zero",  //  Exceed 2
        "14" => "exceed-zero",  //  Zero
        "15" => "nxnx2",        //  NX
        "16" => "nxnx2",        //  NX2
        "17" => "NX Absolute",  //  NXA 
        "18" => "Fiesta",       //  Fiesta
        "19" => "Fiesta Ex",    //  Fiesta Ex
        "20" => "Fiesta 2",     //  Piu Pro/Pro2
        "21" => "Fiesta 2"      //  Fiesta 2
    );
    $mode = array(
        0   => "Censored",
        1   => "Shortcut",
        2   => "Normal",
        3   => "Remix",
        4   => "Full Song"
    );
    $json = array();
    //$songlist = SortSongs($songlist);
    //print '{"name" : "'.$id.'", "eye" : "img/F2M/EYE/'.$id.'.PNG", "levellist" : []}'."\n";
    foreach($songlist as $song) {
        // (Training Station => strpos($song["ID"],"EF") === false )
        // (Brain IQ => strpos($song["ID"],"BF") === false
        // (Mission => strpos($song["ID"],"E000") === false
        // (Random => strpos($song["ID"],"AFF") === false)
        if($song["ActiveMode"] != "0"  && strpos($song["ID"],"AFF") === false && strpos($song["ID"],"BF") === false )  {
            if(strpos($song["ID"],"BF") !== false || strpos($song["ID"],"E000") !== false || strpos($song["ID"],"EF") !== false)  {
                $eye = "img/F2M/EYE/{ID}.PNG";
                $preview = "videos/pi/{ID}.jpg";
            }else{
                $eye = "img/F2M/EYE/".$song["ID"].".PNG";
                $preview = "videos/pi/".$song["ID"].".jpg";
            }
            $jssong = array(  
                            "name" => $song["ID"],
                            "songid" => "", 
                            "songname" => $song["Name0"], 
                            "songartist" => $song["Artist0"], 
                            "bpm" => $song["BPM0"],
                            "eye" => $eye,
                            "previewimage" => $preview,
                            "mission" => strpos($song["ID"],"E000") !== false ,
                            "training" => strpos($song["ID"],"EF") !== false,
                            "game" => $gamelist[$song["GameVersion"]],
                            "mode" => $mode[$song["ActiveMode"]],
                            "levellist" => array()
                          );
            foreach($song["charts"] as $chart)  {
                if($chart["Level"]!="0" && $chart["StepchartType"] != "64")    {
                    $jssong["eye"] = str_ireplace("{ID}",$chart["SongIndexOffset"],$jssong["eye"]);
                    $jssong["previewimage"] = str_ireplace("{ID}",$chart["SongIndexOffset"],$jssong["previewimage"]);
                    $jssong["songid"] = $chart["SongIndexOffset"];
                    $type = "";
                    $ctype = (int)$chart["StepchartType"];
                    $level = ($chart["Level"]=="50")?"??":(int)$chart["Level"];
                    foreach($typemask as $mask => $ntype)   {
                        if($ctype & $mask)
                            $type .= $ntype[0];
                        else
                            $type .= $ntype[1];
                    }
                    array_push($jssong["levellist"], array("level" => $level, "type" => $type, "reallevel" => (int)$chart["Level"]));
                }
            }
            if(count($jssong["levellist"]) > 0)
                array_push($json, $jssong);
        }
    }
    return json_encode($json);
}
