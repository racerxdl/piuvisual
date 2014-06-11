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

/*
 * 	This function basicly returns an Array from a CSV Line
 */
function GetArrayLine($f)   {
    $data = fgetcsv($f);
    if($data !== FALSE) {
        /*
         * In old times this was needed for converting KOREAN stuff to UTF-8.
         * I think its not needed anymore I will keep here for some time
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

/*
 * 	This function Builds a song list with the file handler of the LIST_SONGS.CSV
 * 	It strips out the songs titled NO_SONG and songs with ID FFFFFFFF
 * 	It fills one array with all songs, with each song containing the CSV fields plus a empty field
 * 	called "charts" that is an array that will contain the charts after merging lists.
 */
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

/*
 * 	This will basicly do the same that BuildSongList does, but for charts.
 */
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

/*
 * 	A sorter function to sort stuff
 */
function sorter($num)	{
    for ($i=0;$i<=count($num)-1;$i++)	{
	    if($num[$i]>$num[$i+1])	{
	        $temp=$num[$i];
	        $num[$i]=$num[$i+1];
	        $num[$i+1]=$temp;
	        $num=sorter($num);
	    }
    }
    return $num;
}

/*
 * 	This will sort songs on $songlist by their IDs
 */
function SortSongs($songlist)   {
    $sorted = array();
    
    foreach($songlist as $id => $song)  {
        $sorted[base_convert($id,16,10)] = $song;
    }
    ksort($sorted);
    return $sorted;
}

/*
 * 	This will merge the $songs list with $steps list using the parameter PreviewChartOffset
 * 	It will basicly return the $songs array with filled charts array
 */
function FillStepList($songs,$steps) {
    foreach($steps as $step)    {
        if(array_key_exists($step["PreviewChartOffset"],$songs))
            array_push($songs[$step["PreviewChartOffset"]]["charts"], $step);
    }
    return $songs;
}

/*
 * 	This function does the core of all stuff. Not only JSON.
 * 	It will interpret the data from F2 Song Lists
 * 	I'm skipping a few types of song (see below) for piuvisual,
 * 	if you want it to show, just remove the part of the song "if" you want.
 */
function BuildJSONList($songlist)   {
	/*
	 * This is the mask of song type. For piuvisual I just need Double/Single and Performance types.
	 * But I leave the other masks commented if interest to you.
	 */
    $typemask = array(
        0x02 => array("double","single"),
        0x01 => array("performance","")
        //0x10 => array("another",""),
        //0x20 => array("newsong",""),
        //0x40 => array("hidden","")
    );
    /*
     * 	This is the game number list. Not all is confirmed. 
     * 	I deduced most numbers less than 15.
     */
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
    /*
     * 	Song modes. Censored doesnt appear at all on F2 play.
     */
    $mode = array(
        0   => "Censored",
        1   => "Shortcut",
        2   => "Normal",
        3   => "Remix",
        4   => "Full Song"
    );
    $json = array();
    //$songlist = SortSongs($songlist);	//	Uncomment if you want sorted here.
    foreach($songlist as $song) {
        // (Training Station => strpos($song["ID"],"EF") === false )
        // (Brain IQ => strpos($song["ID"],"BF") === false
        // (Mission => strpos($song["ID"],"E000") === false
        // (Random => strpos($song["ID"],"AFF") === false)
        if($song["ActiveMode"] != "0"  && strpos($song["ID"],"AFF") === false && strpos($song["ID"],"BF") === false )  {			//	Here I filter linked songs. Take a look on list to see the BF and AFF songs.
            if(strpos($song["ID"],"BF") !== false || strpos($song["ID"],"E000") !== false || strpos($song["ID"],"EF") !== false)  {	//	So if its a mission or training station the SongID doesnt mean the real SongID. So we need to use the PreviewID to get the real SongID.
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
                if($chart["Level"]!="0" && $chart["StepchartType"] != "64")    {	//	Skip censored charts
                    $jssong["eye"] = str_ireplace("{ID}",$chart["SongIndexOffset"],$jssong["eye"]);
                    $jssong["previewimage"] = str_ireplace("{ID}",$chart["SongIndexOffset"],$jssong["previewimage"]);
                    $jssong["songid"] = $chart["SongIndexOffset"];
                    $type = "";
                    $ctype = (int)$chart["StepchartType"];
                    $level = ($chart["Level"]=="50")?"??":(int)$chart["Level"];	//	On F2, charts that is lvl 50 appear as ??
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
