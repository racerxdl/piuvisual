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
session_start();
include("inc/piutools.php");

$type   =   "application/json";
$output =   json_encode(array("e"=>"INVAL"));

if(isset($_POST["a"]))  {       //  Post Actions
    if(strcmp($_POST["a"], "gh") == 0)  {              //  Get Hash Action
        $sid = session_id();
        $seed = (int) $_POST["h"];
        for($i=0;$i<strlen($sid);$i++)    
            $sid[$i] =  chr(ord($sid[$i]) ^ ($seed & ($i * 13))); // ($seed & ($i));
        
        $type   =   "text/plain";
        $output =   $sid;
    }
}else if(isset($_GET["a"])) {   //  Get Actions
    if(strcmp($_GET["a"], "gs") == 0)   {             //  Get Session Action
        $k      =   rand(0,65535);
        $sid    =   session_id();
        $type   =   "application/json";
        $output =   json_encode(array("SID"=>$sid,"k"=>$k));

    }
}
header("Content-type: $type");
echo $output;
?>
