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
 * 	This is the WebGL related Stuff.
 * 	Here we will define the basic drawing shaders and auxiliar functions to manage the WebGL stuff.
 */

PUMPER.GL = {};
PUMPER.GL.ScreenWidth = 2;		//	The ScreenWidth. Not the actually resolution, but the coordinates on GL Screen
PUMPER.GL.ScreenHeight = 2;		//	The ScreenHeight. Not the actually resolution, but the coordinates on GL Screen
PUMPER.GL.ZDepth = 1000;		//	The Z Depth Range
PUMPER.GL.Shaders = {};			//	The Shaders holder

/*
 * 	The Simple Vertex Shader to draw 2D Stuff on WebGL Context
 */
PUMPER.GL.Shaders.SimpleVertexShader = "attribute vec3 aVertexPosition;         \
        attribute vec2 aTextureCoord;           \
        uniform vec3 uScale;                                                    \
        varying vec2 vTextureCoord;                                             \
                                                                                \
                                                                                \
        void main(void) {                                                       \
            vec3 scaledPos = aVertexPosition * uScale;  \
            gl_Position = vec4(scaledPos, 1.0);    \
            vTextureCoord = aTextureCoord;\
        }\
        ";	
/*
 * 	The Simple Fragment Shader to draw 2D Stuff on WebGL Context
 */
PUMPER.GL.Shaders.SimpleFragmentShader = "\
    precision mediump float;\
\
    varying vec2 vTextureCoord;\
\
    uniform sampler2D uSampler;\
    uniform float uOpacity;  \
\
    void main(void) {\
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vec4(1.0,1.0,1.0,uOpacity);\
    }\
";

/*
 * 	The Blend Vertex Shader used to blend the 2D Stuff over something that is on WebGL Context
 */
PUMPER.GL.Shaders.BlendVertexShader = "attribute vec3 aVertexPosition;         \
        attribute vec2 aTextureCoord;           \
        uniform vec3 uScale;                                                    \
        varying vec2 vTextureCoord;                                             \
                                                                                \
                                                                                \
        void main(void) {                                                       \
            vec3 scaledPos = aVertexPosition * uScale;  \
            gl_Position = vec4(scaledPos, 1.0);    \
            vTextureCoord = aTextureCoord;\
        }\
        ";

/*
 * 	The Blend Fragment Shader used to blend the 2D Stuff over something that is on WebGL Context
 */
PUMPER.GL.Shaders.BlendFragmentShader = "\
    precision mediump float;\
\
    varying vec2 vTextureCoord;\
\
    uniform sampler2D uSampler0;\
    uniform sampler2D uSampler1;\
    uniform float uBlendMode; \
    uniform float uOpacity;  \
\
    void main(void) {\
        vec4 Sample0 = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\
        vec4 Sample1 = texture2D(uSampler1, vec2(vTextureCoord.s, vTextureCoord.t));\
        float alpha = max(Sample0.y,Sample0.z); \
        gl_FragColor = vec4(1.0,1.0,1.0,alpha-0.2);\
    }\
";

/*
 * 	This function checks if the value is power of 2
 */
PUMPER.GL.isPowerOfTwo = function (x) { return (x & (x - 1)) == 0; };

/*
 * 	This function gets the next highest power of two value for X
 */
PUMPER.GL.nextHighestPowerOfTwo = function (x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) 
        x = x | x >> i;
    return x + 1;
};  

/*
 * 	This function scales the Texture to a Power of two.
 * 	See: http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
 */
PUMPER.GL.ToPowerOfTwo = function(image)    {
    if (!PUMPER.GL.isPowerOfTwo(image.width) || !PUMPER.GL.isPowerOfTwo(image.height)) {
        // Scale up the texture to the next highest power of two dimensions.
        var canvas = document.createElement("canvas");
        canvas.width = PUMPER.GL.nextHighestPowerOfTwo(image.width);
        canvas.height = PUMPER.GL.nextHighestPowerOfTwo(image.height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        image = canvas;
    }
    return image;
};

/*
 * 	This function compiles a shader code using WebGL Context. 
 */
PUMPER.GL.compileShader = function (gl, shaderSource, shaderType) {
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation; get the error
        PUMPER.debug("PUMPER::ShaderCompile Error: "+gl.getShaderInfoLog(shader));
    }

    return shader;
};

/*
 * 	This function creates a shader program given a compiled vertexShader and fragmentShader codes.
 */
PUMPER.GL.createProgram = function (gl, vertexShader, fragmentShader) {
    // create a program.
    var program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        PUMPER.debug("PUMPER::ShaderCreateProgram Error: "+gl.getProgramInfoLog (program));
    }

    return program;
};

/*
 * 	This function generates a sprite coordinate given parameters.
 * 	The parameters is (in order):
 * 	ScreenX, ScreenY, OnScreenWidth, OnScreenHeight, TextureX, TextureY, TextureU, OnTextureV, Z, TextureStepX, TextureStepY
 * 
 * 	The texture coordinates are relative to 0 and 1
 */
PUMPER.GL.GenSprite = function(sx,sy,sw,sh,tx,ty,tu,tv,z,offidx)    {
    var RetData = [ [], [], [] ];   //  VertexData, TextureData, IndexData
    var SXS = 2 / PUMPER.GL.ScreenWidth,
        SYS = 2 / PUMPER.GL.ScreenHeight;
    
    sy = PUMPER.GL.ScreenHeight - sy;   //  GL Coordinates are inverted
    
    offidx = (offidx===undefined)?0:offidx;
        
    z = z / PUMPER.GL.ZDepth;
    RetData[0].push( 
        -1.0 + SXS * sx         ,   -1.0 + SYS * (sy-sh)     ,   z,
        -1.0 + SXS * (sx+sw)    ,   -1.0 + SYS * (sy-sh)     ,   z,
        -1.0 + SXS * (sx+sw)    ,   -1.0 + SYS * (sy)        ,   z,
        -1.0 + SXS * sx         ,   -1.0 + SYS * (sy)        ,   z
    );
        
    RetData[1].push(
        tx, ty,
        tu, ty,
        tu, tv,
        tx, tv  
    );
    
    RetData[2].push(
        offidx+0, offidx+1, offidx+2,
        offidx+0, offidx+2, offidx+3    
    );
    return RetData;  
};

/*
 * 	This creates a Canvas Context given an WebGL Texture.
 * 	Used for getting texture images converted to Canvas images.
 */
PUMPER.GL.createCanvasFromTexture = function (gl, texture, width, height) {
    // Create a framebuffer backed by the texture
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Read the contents of the framebuffer
    var data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.deleteFramebuffer(framebuffer);

    // Create a 2D canvas to store the result 
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    // Copy the pixels to a 2D canvas
    var imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);

    return canvas;
};

/*
 * 	The WebGL Renderer Class
 * 	This is used to render WebGL Objects to the screen.
 */
PUMPER.GL.Renderer  =   function( parameters )  {
    var canvas  =   parameters.canvas,
        gl      =   parameters.gl;
    if(gl !== undefined)    {
        this.gl = gl;
        this.canvas = canvas;
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        PUMPER.GL.ScreenWidth = canvas.width;
        PUMPER.GL.ScreenHeight = canvas.height;
        this.Shaders = [];
        
        if (!this.gl) 
            alert("Could not initialise WebGL.");
            
        this.InitShaders();								//	Initialize the Basic Shaders
        
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);			//	Sets the clear color

        this.VertexBuffer       = gl.createBuffer();	//	Initialize Vertex Buffers
        this.TextureCoordBuffer = gl.createBuffer();	//	Initialize TextureCoordBuffer
        this.VertexIndexBuffer  = gl.createBuffer();	//	Initialize VertexIndexBuffer
        this.TempTexture        = gl.createTexture();	//	Initialize Temporary Texture

    }    
};

/*
 * 	This function Initialize the Basic Shaders (Simple and Blend)
 * 	It compiles the codes and creates the programs.
 */
PUMPER.GL.Renderer.prototype.InitShaders    =   function()  {
	//	Compile the Shader Codes
    this.vertexShader           = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.SimpleVertexShader, this.gl.VERTEX_SHADER);
    this.blendVertexShader      = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.BlendVertexShader, this.gl.VERTEX_SHADER);
    this.fragmentShader         = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.SimpleFragmentShader, this.gl.FRAGMENT_SHADER);
    this.blendFragmentShader    = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.BlendFragmentShader, this.gl.FRAGMENT_SHADER);
    
    //	Create the programs
    this.Shaders.push(PUMPER.GL.createProgram(this.gl, this.vertexShader, this.fragmentShader));
    this.Shaders.push(PUMPER.GL.createProgram(this.gl, this.blendVertexShader, this.blendFragmentShader));
    
    //	Sets the Shader Attributes / Uniforms
    //  -	Simple Shader
    this.gl.useProgram(this.Shaders[0]);

    this.Shaders[0].vertexPositionAttribute = this.gl.getAttribLocation(this.Shaders[0], "aVertexPosition");
    this.gl.enableVertexAttribArray(this.Shaders[0].vertexPositionAttribute);


    this.Shaders[0].textureCoordAttribute = this.gl.getAttribLocation(this.Shaders[0], "aTextureCoord");
    this.gl.enableVertexAttribArray(this.Shaders[0].textureCoordAttribute);

    this.Shaders[0].samplerUniform = this.gl.getUniformLocation(this.Shaders[0], "uSampler");
    this.Shaders[0].opacityUniform = this.gl.getUniformLocation(this.Shaders[0], "uOpacity");
    this.Shaders[0].scaleUniform = this.gl.getUniformLocation(this.Shaders[0], "uScale");
    
    //  -	Blend Shader
        
    this.gl.useProgram(this.Shaders[1]);

    this.Shaders[1].vertexPositionAttribute = this.gl.getAttribLocation(this.Shaders[1], "aVertexPosition");
    this.gl.enableVertexAttribArray(this.Shaders[1].vertexPositionAttribute);


    this.Shaders[1].textureCoordAttribute = this.gl.getAttribLocation(this.Shaders[1], "aTextureCoord");
    this.gl.enableVertexAttribArray(this.Shaders[1].textureCoordAttribute);

    this.Shaders[1].sampler0Uniform = this.gl.getUniformLocation(this.Shaders[1], "uSampler0");
    this.Shaders[1].sampler1Uniform = this.gl.getUniformLocation(this.Shaders[1], "uSampler1");
    this.Shaders[1].opacityUniform = this.gl.getUniformLocation(this.Shaders[1], "uOpacity");
    this.Shaders[1].blendModeUniform = this.gl.getUniformLocation(this.Shaders[1], "uBlendMode");
    this.Shaders[1].scaleUniform = this.gl.getUniformLocation(this.Shaders[1], "uScale");
    
};

/*
 * 	This is to clear the drawing screen.
 */
PUMPER.GL.Renderer.prototype.Clear  =   function()      {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.blendEquation( this.gl.FUNC_ADD );
    this.gl.blendFunc( this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA );
    this.gl.enable( this.gl.BLEND );
};

/*
 * 	This is for render the following data.
 * 	The data parameter is an array of elements that has following structure:
 * 		-	texture		=>	The object texture
 * 		-	vertex		=>	The vertex array
 * 		-	texcoord	=>	The texture coordinates array
 * 		-	index		=>	The vertex indexes
 * 		-	shdNum		=>	The shader program number to use
 * 		-	scale		=>	The scale to render
 * 		-	opacity		=>	The opacity of the object
 */
PUMPER.GL.Renderer.prototype.Render =   function(data)  {
    
    var i=0,len=data.length;
    while(i<len)    {
        var d = data[i],
            texture     =   d.texture,
            vertex      =   d.vertex,
            texcoord    =   d.texcoord,
            indexes     =   d.index,
            shdNum      =   d.shdNum,
            scale       =   d.scale,
            opacity     =   d.opacity,
            shader      =   this.Shaders[shdNum];
          
        //	Enables the program - TODO: Make a cache of last shader number loaded, so we dont need to reload if its the same.
        this.gl.useProgram(shader);
        
        //	Bind the Vertex Buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertex) , this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        //	Bind the Texture Coordinate Buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TextureCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoord) , this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(shader.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

        //	Bind the Texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D,  texture);
        this.gl.uniform1i(shader.samplerUniform, 0);

        //	Bind the opacity and scale values
        this.gl.uniform1f(shader.opacityUniform, opacity);
        this.gl.uniform3f(shader.scaleUniform, scale.x, scale.y, scale.z);
        
        //	Bind the Vertex Index Buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), this.gl.STATIC_DRAW);
        
        //	Draw
        this.gl.drawElements(this.gl.TRIANGLES, indexes.length, this.gl.UNSIGNED_SHORT, 0);  
              
        ++i;
    };

};

/*
 * 	The RenderObject Class
 * 	This is a Renderable object class.
 */
PUMPER.GL.Renderer.prototype.RenderObject =   function(data)  {
    var shader = this.Shaders[0];
    if(data.opacity > 0 && data.visible)    {
        var blend = 0 ;
        var textureToUse = data.image;
        switch(data.blendtype)  {
            case "lighter": blend = 1; break;
            default: blend = 0; break;
        }
        if(blend == 0)  {
            this.gl.useProgram(shader);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,  textureToUse);
            this.gl.uniform1i(shader.samplerUniform, 0);
        }else{
            shader = this.Shaders[1];
            this.gl.useProgram(this.Shaders[1]);
            //  First the real texture
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,  textureToUse);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
            this.gl.uniform1i(shader.sampler0Uniform, 0);  
                      
            //  Now the cutted framebuffer
            /*
            var tmpdata = new Uint8Array(data.image.width*data.image.height*4);
            this.gl.readPixels(data.x,  this.gl.viewportHeight-data.y-data.image.height, data.image.width, data.image.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, tmpdata);
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D,  this.TempTexture);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, data.image.width, data.image.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, tmpdata);
            
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.uniform1i(shader.sampler1Uniform, 1);
            */
            this.gl.uniform1i(shader.blendModeUniform, blend);
        }   
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, data.VertexBuffer);
        this.gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, data.TextureCoordBuffer);
        this.gl.vertexAttribPointer(shader.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform1f(shader.opacityUniform, data.opacity);
        this.gl.uniform3f(shader.scaleUniform, data.scale.x, data.scale.y, 1);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, data.VertexIndexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, data.VertexIndexArray.length, this.gl.UNSIGNED_SHORT, 0);
    }  
};