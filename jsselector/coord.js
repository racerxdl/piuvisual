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
PUMP_SELECTOR.CoordSlicer = function( parameters ) {
    var image = parameters.image;
    var coord = parameters.coord;
    var name  = parameters.name;
    var obj = {};
    
    if( image === undefined)    {
        PUMPER.debug("PUMPER::CoordSlicer() - Cannot slice image, image missing.");
        return undefined;
    }else if (coord === undefined) {
        PUMPER.debug("PUMPER::CoordSlicer() - Warn: No coordinate data given. Returning image.");
        return obj[name] = obj;
    }else{
        var coords = coord.split("\n");
        coords.clean("");
        for(var i=0;i<coords.length;i++) {
            var coordinate = coords[i].split(" ");
            obj[coordinate[0]] = PUMP_SELECTOR.CropImage(image,coordinate[1],coordinate[2],coordinate[3],coordinate[4]);
        }
        return obj;
    }
}
