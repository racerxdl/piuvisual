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
 * 	This script generates a JSON List of the songs/steps listed on LIST_STEPS.csv and LIST_SONGS.csv
 * 	Those CSV files was extracted from Pump It Up Fiesta 2
 */

include("inc/piutools.php");						//	Include PIU Tools

header('Content-Type: text/json; charset=utf-8');	//	Set the header to text/json, not strict necessary
$f = fopen("LIST_STEPS.csv","r");					//	Read the steps csv
$steps = BuildStepList($f);							//	Build the steplist with contents
fclose($f);											//	Close the steplist
$f = fopen("LIST_SONGS.csv", "r");					//	Do the same with songs
$songs = BuildSongList($f);
fclose($f);
$songs = FillStepList($songs,$steps);				//	This action will cross songs -> steps to one array
$json = BuildJSONList($songs);						//	Build the JSON data for returning
echo $json;
