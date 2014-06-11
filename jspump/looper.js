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
/************************* Looper **************************/
/*
 * This is the Looper Class.
 * It does the main loop of the game
 */
PUMPER.Looper = PUMPER.Looper || function ( parameters )  {
    this.Drawer     = parameters.drawer;
    this.NoteData   = parameters.notedata;
    this.Skin       = parameters.skin; 
};

/*
 * 	Main Loop Function. Draws the loading if the game is loading,
 * 	if not, runs the game Update, Updates the Sentinel, updates the current block
 * 	and updates the views.
 */
PUMPER.Looper.prototype.loop = function()  {
    PUMPER.Globals.Sentinel.Update();
    if(this.Drawer !== undefined)   { 
        this.Drawer.Update();
        if(PUMPER.Globals.DataToLoad > PUMPER.Globals.LoadedData || !PUMPER.Globals.LoadStarted) {
            PUMPER.Globals.Loaded = false;
            this.Drawer.DrawLoading();
        }else{
            if(PUMPER.Globals.Sentinel.OK())   {
                PUMPER.Globals.Loaded = true;
                this.NoteData.Update(PUMPER.Globals.Music.GetTime());
                this.Skin.Update(PUMPER.Globals.Music.GetTime());
                this.Drawer.NoteBlock = this.NoteData.GetBeatBlock(PUMPER.ScreenHeight);
                this.Drawer.DrawLayers();
                if($("#time") !== undefined)
                    $("#time").html(PUMPER.Globals.Music.GetTime());
                if($("#time") !== undefined)
                    $("#beat").html(PUMPER.Globals.NoteData.CurrentBeat);
            }
        }
    }
    PUMPER.UpdateInfoHead();
    if(PUMPER.Globals.FPSStats != undefined)
        PUMPER.Globals.FPSStats.update();
};

