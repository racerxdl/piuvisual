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
?>
<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<title>Pump Visualizer</title>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="viewport" content="width=640, target-densitydpi=device-dpi, initial-scale=0, maximum-scale=1">
	<style>
			body {
				background:#000000;
				padding:0;
				margin:0;
				font-weight: bold;
				overflow:hidden;
			}
	</style>
	<script src="js/jquery-1.10.1.min.js"></script>
	<script src="js/jquery-migrate-1.2.1.min.js"></script>
	<script src="js/stats.js"></script>
	<script src="js/struct.js"></script>
	<script src="js/jpak.js"></script>
	<script src="jspump/pump.js"></script>
	<script src="jspump/gl.js"></script>
	<script src="jspump/shaders.js"></script>
	<script src="jspump/gldrawer.js"></script>
	<script src="jspump/ucsparser.js"></script>
	<script src="jspump/nxparser.js"></script>
	<script src="jspump/sentinel.js"></script>
	<script src="jspump/step.js"></script>
	<script src="jspump/sound.js"></script>
	<script src="jspump/video.js"></script>
	<script src="jspump/objects.js"></script>
	<script src="jspump/scene.js"></script>
	<script src="jspump/drawer.js"></script>
	<script src="jspump/looper.js"></script>
	<script src="jspump/skin.js"></script>
	<script src="jspump/loader.js"></script>
	<script src="jspump/effectbank.js"></script>
	<script src="jspump/game.js"></script>
	<script>
		var PumpGame, GameStats, _UCS;
		var requestAnimFrameA = (function(){
		  return  function( callback ){
				    window.setTimeout(callback, 1000 / 240);
				  };
		})();
		window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                  };
        })();
		window.performance = window.performance || {};
		performance.now = (function() {
		  return performance.now       ||
				 performance.mozNow    ||
				 performance.msNow     ||
				 performance.oNow      ||
				 performance.webkitNow ||
				 function() { return new Date().getTime(); };
		})();
		function Init()	{
			GameStats = new Stats();
			GameStats.domElement.style.position = 'absolute';
			GameStats.domElement.style.left = '0px';
			GameStats.domElement.style.top = '0px';
			document.body.appendChild( GameStats.domElement );
			var GameParameters = PUMPER.parseHashes();
			PUMPER.ScrollSpeed = (GameParameters.scrollSpeed!==undefined)?GameParameters.scrollSpeed:3;
			PUMPER.JPAKFile    = "nx20/"+GameParameters.SongID + ".jpak";
			PUMPER.JMode       = GameParameters.Mode;
			PUMPER.Level       = GameParameters.Level;
			PUMPER.Location    = GameParameters.Location || "ARCADE";
            PumpGame = new PUMPER.GameLoader({"loadtype" : PUMPER.TypeJPAKNX, "loadargs" : {"jpak":PUMPER.JPAKFile,"mode" : PUMPER.JMode, "level" : PUMPER.Level, "location" : PUMPER.Location}, "canvasname" : "gamescreen", "gamestats" : GameStats}); PumpGame.Load();
		}
	</script>
</head>
<body onLoad="Init();">
<a href="https://github.com/racerxdl/piuvisual"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png" alt="Fork me on GitHub"></a>
<center>
<BR><BR>
<canvas width=640 height=480 id="gamescreen"></canvas><BR><input type="button" onClick="PUMPER.Globals.PumpGame.Play();" value="Play"><input type="button" onClick="PUMPER.Globals.PumpGame.Pause();" value="Pause">
<font color=white>
<BR>Time: <div id="time">0</div>
<BR>Beat: <div id="beat">0</div>
</font>
</center>
</body>
</html>
