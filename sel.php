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
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<style>
			body {
				background:#000000;
				padding:0;
				margin:0;
				font-weight: bold;
			}
	</style>
	<script src="js/jquery-1.10.1.min.js"></script>
	<script src="js/jquery-migrate-1.2.1.min.js"></script>
	<script src="js/stats.js"></script>
	<script src="js/jpak.js"></script>
	<script src="js/Base64.js"></script>
	<script src="jsselector/selector.js"></script>
	<script src="jsselector/looper.js"></script>
	<script src="jsselector/game.js"></script>
	<script src="jsselector/coord.js"></script>
	<script src="jsselector/levelbar.js"></script>
	<script src="jsselector/levelselector.js"></script>
	<script src="jsselector/objects.js"></script>
	<script src="jsselector/onetimeevent.js"></script>
	<script src="jsselector/skin.js"></script>
	<script src="jsselector/soundplayer.js"></script>
	<script src="jsselector/soundmanager.js"></script>
	<script src="jsselector/videoplayer.js"></script>
	<script src="jsselector/wheelitem.js"></script>
	<script src="jsselector/wheel.js"></script>
	<script src="jsselector/drawer.js"></script>
	<script>
		var PumpSelector, GameStats, vplay, gameCanvas, gameCtx;
		var requestAnimFrameA = (function(){
		  return  function( callback ){
				    window.setTimeout(callback, 1000 / 240);
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
		    gameCanvas = document.getElementById("gamescreen");
		    gameCtx = gameCanvas.getContext("2d");

			PumpSelector = new PUMP_SELECTOR.Game({canvas: gameCanvas});
			GameStats = new Stats();
			GameStats.domElement.style.position = 'absolute';
			GameStats.domElement.style.left = '0px';
			GameStats.domElement.style.top = '0px';
			document.body.appendChild( GameStats.domElement );
			/*var GameParameters = PUMPER.parseHashes();
			var 
			setInterval(PumpGame.ShowStatistics, 5000);*/
			Animate();
		}

		function Animate()	{
		    //requestAnimFrameA( Animate );     // 240 FPS
    		requestAnimationFrame( Animate );   // 60 FPS
			PumpSelector.Looper.loop();
			GameStats.update();
		}
	</script>
</head>
<body onLoad="Init();">
<center>
<div id="videoHolder"></div>
<BR><BR>
<canvas width=640 height=480 id="gamescreen"></canvas>
<BR><BR>
<span style="color: white">
For this demo the song opener is disabled because I didnt share all the assets.<BR>
Depending on your internet connection the preview songs and videos can take a while to load. I didnt preloaded them.<BR>
Have fun! <BR>
Keys: <BR>
Z => Move Left <BR>
C => Move Right <BR>
S => Center (Enter) <BR>
Q => Back Left <BR>
E => Back Right <BR>

Codes: 
-   Speed UP: Q E Q E Q E S <BR>
-   Speed Down: E Q E Q E Q S <BR>
CTRL + P - Enable/Disable Preview Video<BR>
CTRL + S - Enable/Disable Sound
</span>
<BR><BR>
</center>
</body>
</html>
