<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<title>Pump Visualizer</title>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
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
	<script src="jspump/gldrawer.js"></script>
	<script src="jspump/sscparser.js"></script>
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
	<script src="jspump/shaders.js"></script>
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
			PUMPER.ScrollSpeed = (GameParameters.scrollSpeed!==undefined)?parseInt(GameParameters.scrollSpeed):4;
            PumpGame = new PUMPER.GameLoader({"loadtype" : PUMPER.TypeSSC, "loadargs" : {"sscname":"Mecha-Tribe Assault","sscfile":(GameParameters.SSC!==undefined)?"ssc/"+GameParameters.UCS+".ssc":"ssc/Mecha-Tribe Assault.ssc","chartnumber" :6}, "canvasname" : "gamescreen", "gamestats" : GameStats});
            PumpGame.Load();
		}
	</script>
	
	<style type="text/css">

	#gcontainer	{
		width: 640px;
		height: 480px;
	    position: relative;
	    margin: 0 auto;
	}
	#infohead	{
 		position: absolute;
    	margin: 0 auto;
    	z-index: 2;
    	top: 8px;
    	left: 10px;
    	width: 620px;
    	color: white;
    	text-align: center;
    	text-shadow: 2px 0 0 #000000, -2px 0 0 #000000, 0 2px 0 #000000, 0 -2px 0 #000000, 1px 1px #000000, -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000;
	}
	#gamescreen	{
		position: absolute; z-index: 1;
		left: 0px;
		-webkit-border-top-left-radius: 5px;
		-webkit-border-top-right-radius: 5px;
		-moz-border-radius-topleft: 5px;
		-moz-border-radius-topright: 5px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
</style>
	
</head>
<body onLoad="Init();">
<center>
<BR><BR>
<div id="gcontainer">
    <canvas width=720 height=480 id="gamescreen"></canvas>
	<div id="infohead">
		BPM: 000 BEAT: 000.000 TIME: 000.000 BLOCK: 000 SPEED: 3x
	</div>    
</div>
<input type="button" onClick="PUMPER.Globals.PumpGame.Play();" value="Play"><input type="button" onClick="PUMPER.Globals.PumpGame.Pause();" value="Pause">
<BR><BR><div id="time">0</div>
<BR><BR><div id="beat">0</div>
</center>
</body>
</html>
