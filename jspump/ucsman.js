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
function handleFileSelect(e)    {
    e.preventDefault();
    e.stopPropagation();
    
    var files = e.originalEvent.dataTransfer.files; // FileList object.
    if(files.length > 0)    {
        PUMPER.log("Reading file "+files[0].name);
        var reader = new FileReader();
        reader.onload = (function(theFile) { return function(e) {
            $("#gamePoint").html("");
            var data = e.target.result;
            var UCS = theFile.name.slice(0,5);
			var GameStats = new Stats();
			var newCanvas =    $('<canvas/>').attr({'id':'gamescreen', 'width': 820, 'height': 480});
			newCanvas.width(820);
			newCanvas.height(480);
			newCanvas.css({
                position: 'absolute',
                zIndex: 5000,
                top: "138px",
                left: "0px"
            });
            //  POS: 468x485
            newCanvas.centerw();
			$("#gamePoint").append(newCanvas);
			$("#gamePoint").append('<BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><input type="button" onClick="PUMPER.Globals.PumpGame.Play();" value="Play"><input type="button" onClick="PUMPER.Globals.PumpGame.Pause();" value="Pause"><input type="button" onClick="PUMPER.ScrollSpeed=PUMPER.ScrollSpeed+ 1;" value="Speed+"><input type="button" onClick="PUMPER.ScrollSpeed=PUMPER.ScrollSpeed-1" value="Speed-">');
			GameStats["domElement"].style.position = 'absolute';
			GameStats["domElement"].style.left = '0px';
			GameStats["domElement"].style.top = '0px';
			document.body.appendChild( GameStats["domElement"] );
			var GameParameters = PUMPER.parseHashes();
			PUMPER.ScrollSpeed = (GameParameters.scrollSpeed!==undefined)?parseInt(GameParameters.scrollSpeed):4;
            var PumpGame = new PUMPER.GameLoader({"loadtype" : PUMPER.TypeTextUCS, "loadargs" : {"ucsdata":data,"songid" : UCS}, "canvasname" : "gamescreen", "gamestats" : GameStats});
            PumpGame.Load();
                       
        };})(files[0]);
        reader.readAsText(files[0]);   
        $("#gamePoint").on('dragover', function(e){});
        $("#gamePoint").on('drop', function(e){});
    }else
        PUMPER.log("No files, uh?");
    
};
$(window).resize(function(){
    $("#gamescreen").centerw();
});
$( document ).ready(function() {
    $("#gamePoint").html("<BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR>Thrown your UCS File here.");
    $("#gamePoint").on('dragover', handleDragOver);
    $("#gamePoint").on('drop', handleFileSelect);
});

