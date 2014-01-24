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
PUMPER.GL.Shaders.NullVertexShader = "\
attribute vec3 position;\
\
void main() {\
	gl_Position = vec4( position, 1.0 );\
}";
PUMPER.GL.Shaders.TestFragment = "\
precision mediump float;\
uniform float time;\
uniform vec2 resolution;\
void main(void) {\
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);\
}";

PUMPER.GL.Shaders.PIUBGAOffFragment = [
"precision mediump float;",
"uniform float time;",
"uniform vec2 resolution;",
"uniform sampler2D uSampler;          ",
"",
"const float tau = 6.28318530717958647692;",
"",
"// Gamma correction",
"#define GAMMA (2.2)",
"",
"vec3 ToLinear( in vec3 col )",
"{",
"	// simulate a monitor, converting colour values into light values",
"	return pow( col, vec3(GAMMA) );",
"}",
"",
"vec3 ToGamma( in vec3 col )",
"{",
"	// convert back into colour values, so the correct light will come out of the monitor",
"	return pow( col, vec3(1.0/GAMMA) );",
"}",
"",
"vec4 Noise( in ivec2 x )",
"{",
"	return texture2D( uSampler, (vec2(x)+0.5)/256.0, -100.0 );",
"}",
"",
"vec4 Rand( in int x )",
"{",
"	vec2 uv;",
"	uv.x = (float(x)+0.5)/256.0;",
"	uv.y = (floor(uv.x)+0.5)/256.0;",
"	return texture2D( uSampler, uv, -100.0 );",
"}",
"",
"void main(void)",
"{",
"	vec3 ray;",
"	ray.xy = 2.0*(gl_FragCoord.xy-resolution.xy*.5)/resolution.x;",
"	ray.z = 1.0;",
"",
"	//float offset = time*.5;",
"	float offset = time*.3;	",
"	float speed2 = (cos(15.0)+1.0)*2.0;",
"	float speed = speed2+.1;",
"	//offset += sin(offset)*.96;",
"	//offset *= 2.0;",
"	vec3 col = vec3(0);",
"	vec3 stp = ray/max(abs(ray.x),abs(ray.y));",
"	vec3 pos = 2.0*stp+.5;",
"	for ( int i=0; i < 20; i++ )",
"	{",
"		float z = Noise(ivec2(pos.xy)).x;",
"		z = fract(z-offset);",
"		float d = 50.0*z-pos.z;",
"		float w = pow(max(0.0,1.0-12.0*length(fract(pos.xy)-.5)),3.0);",
"		vec3 c = max(vec3(0),vec3(1.0-abs(d+speed2*.5)/speed,1.0-abs(d)/speed,1.0-abs(d-speed2*.5)/speed));",
"		col += 1.5*(1.0-z)*c*w;",
"		pos += stp;",
"	}",
"	gl_FragColor = vec4(ToGamma(col),1.0);",
"}"
].join("\n");

PUMPER.GL.Shaders.CrystalGlassFragment = [
"#ifdef GL_ES",
"precision mediump float;",
"#endif",
"",
"uniform float time;",
"uniform vec2 mouse;",
"uniform vec2 resolution;",
"",
"//Glass Field by Kali",
"",
"#define lightcol1 vec3(1.,.95,.85)",
"#define lightcol2 vec3(.85,.95,1.)",
"",
"",
"",
"",
"//Rotation matrix by Syntopia",
"mat3 rotmat(vec3 v, float angle)",
"{",
"	float c = cos(angle);",
"	float s = sin(angle);",
"	",
"	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,",
"		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,",
"		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z",
"		);",
"}",
"",
"//Smooth min by IQ",
"float smin( float a, float b )",
"{",
"    float k = 0.5;",
"	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );",
"	return mix( b, a, h ) - k*h*(1.0-h);",
"}",
"",
"",
"//Distance Field",
"float de(vec3 pos) {",
"	vec3 A=vec3(5.);",
"	vec3 p = abs(A-mod(pos,2.0*A)); //tiling fold by Syntopia",
"	float sph=length(p)-2.5;",
"	float cyl=length(p.xy)-.4;",
"	cyl=min(cyl,length(p.xz))-.4;",
"	cyl=min(cyl,length(p.yz))-.4;",
"    return smin(cyl,sph);",
"}",
"",
"// finite difference normal",
"vec3 normal(vec3 pos) {",
"	vec3 e = vec3(0.0,0.001,0.0);",
"	",
"	return normalize(vec3(",
"			de(pos+e.yxx)-de(pos-e.yxx),",
"			de(pos+e.xyx)-de(pos-e.xyx),",
"			de(pos+e.xxy)-de(pos-e.xxy)",
"			)",
"		);	",
"}",
"",
"",
"void main(void)",
"{",
"	float time = time*.6; ",
"",
"	//camera",
"	mat3 rotview=rotmat(normalize(vec3(1.)),sin(time*.6));",
"	vec2 coord = gl_FragCoord.xy / resolution.xy *2. - vec2(1.);",
"	coord.y *= resolution.y / resolution.x;",
"	float fov=min((time*.2+.05),0.8); //animate fov at start",
"	vec3 from = vec3(cos(time)*2.,sin(time*.5)*10.,time*5.);",
"",
"	//raymarch",
"	float totdist=0.;",
"	float distfade=1.;",
"	float glassfade=1.;",
"	float intens=1.;",
"	float maxdist=80.;",
"	float vol=0.;",
"	vec3 spec=vec3(0.);",
"	vec3 dir=normalize(vec3(coord.xy*fov,1.))*rotview; ",
"	float ref=0.;",
"	vec3 light1=normalize(vec3(cos(time),sin(time*3.)*.5,sin(time)));",
"	vec3 light2=normalize(vec3(cos(time),sin(time*3.)*.5,-sin(time)));",
"	for (int r=0; r<80; r++) {",
"		vec3 p=from+totdist*dir;",
"		float d=de(p);",
"		float distfade=exp(-1.5*pow(totdist/maxdist,1.5));",
"		intens=min(distfade,glassfade);",
"",
"		// refraction",
"		if (d>0.0 && ref>.5) {",
"			ref=0.;",
"			vec3 n=normal(p);",
"			if (dot(dir,n)<-.5) dir=normalize(refract(dir,n,1./.87));",
"			vec3 refl=reflect(dir,n);",
"			spec+=lightcol1*pow(max(dot(refl,light1),0.0),40.)*intens*.7;",
"			spec+=lightcol2*pow(max(dot(refl,light2),0.0),40.)*intens*.7;",
"",
"		}",
"		if (d<0.0 && ref<.05) {",
"			ref=1.;",
"			vec3 n=normal(p);",
"			if (dot(dir,n)<-.05) dir=normalize(refract(dir,n,.87));",
"			vec3 refl=reflect(dir,n);",
"			glassfade*=.75;",
"			spec+=lightcol1*pow(max(dot(refl,light1),0.0),40.)*intens;",
"			spec+=lightcol2*pow(max(dot(refl,light2),0.0),40.)*intens;",
"		}",
"		",
"		totdist+=max(0.005,abs(d)); //advance ray ",
"		if (totdist>maxdist) break; ",
"",
"		vol+=intens; //accumulate current intensity",
"	}",
"	",
"	vol=pow(vol,1.5)*.0005;",
"	vec3 col=vec3(vol)+vec3(spec)*.4+vec3(.05);",
"",
"	//lights",
"	col+=1.5*lightcol1*pow(max(0.,max(0.,dot(dir,light1))),10.)*glassfade; ",
"	col+=1.5*lightcol2*pow(max(0.,max(0.,dot(dir,light2))),10.)*glassfade; ",
"	//col+=vec3(sin(time*10.)+1.,0.,0.)*.8*pow(max(0.,max(0.,dot(dir,vec3(0.,0.,1.)))),5.)*glassfade; ",
"",
"	",
"	col*=min(1.,time); //fade in",
"",
"	gl_FragColor = vec4(col,1.0);	",
"}"
].join("\n");
PUMPER.GL.Shaders.HashFragment = [
"#ifdef GL_ES",
"precision mediump float;",
"#endif",
"",
"uniform float time;",
"uniform vec2 mouse;",
"uniform vec2 resolution;",
"",
"float hash( float n )	{",
"	for(float i = 0.0; i < 5.0; i++){",
"		n = fract(n * 1234.5678);",
"	}",
"	return fract( n );",
"}",
"",
"void main( void ) ",
"{",
"	vec2 p = ( gl_FragCoord.xy / resolution.xy );",
"	float color = fract(hash(p.x * p.y * time));",
"	gl_FragColor = vec4( vec3( color, color , color  ), 1.0 );",
"",
"}"
].join("\n");

PUMPER.GL.Shaders.TunnelFragment = [
"#ifdef GL_ES",
"precision mediump float;",
"#endif",
"",
"uniform float time;",
"uniform vec2 mouse;",
"uniform vec2 resolution;",
"// srtuss, 2013",
"// raymarching a scifi tech tunnel textured with voronoi noise",
"",
"// added blend effect",
"",
"#define PI 3.14159265358979323",
"",
"vec2 rotate(vec2 p, float a)",
"{",
"	return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));",
"}",
"",
"// iq's fast 3d noise",
"float noise3d(in vec3 x)",
"{",
"    vec3 p = floor(x);",
"    vec3 f = fract(x);",
"	f = f * f * (3.0 - 2.0 * f);",
"	vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;",
"	vec2 rg = vec2(0.3,0.6); //texture2D(iChannel0, (uv + 0.5) / 256.0, -100.0).yx;",
"	return mix(rg.x, rg.y, f.z);",
"}",
"",
"// 3d fbm",
"float fbm3(vec3 p)",
"{",
"	return noise3d(p) * 0.5 + noise3d(p * 2.02) * 0.25 + noise3d(p * 4.01) * 0.125;",
"}",
"",
"// i'm currently trying something here:",
"float hash(float x)",
"{",
"	return fract(484.982 * sin(x)) * 2.0 - 1.0;",
"}",
"float noise(float x)",
"{",
"	float fl = floor(x);",
"	return mix(hash(fl), hash(fl + 1.0), smoothstep(0.0, 1.0, fract(x)));",
"}",
"float fbm(float x)",
"{",
"	return noise(x) * 0.5 + noise(x * 2.2) * 0.1 + noise(x * 4.1) * 0.005;",
"}",
"float stepnoise(float x)",
"{",
"	float fl = floor(x);",
"	return mix(hash(fl), hash(fl + 1.0), pow(fract(x), 0.3));",
"}",
"float mechnoise(float x)",
"{",
"	float fl = floor(x);",
"	return mix(hash(fl), hash(fl + 1.0), clamp(fract(x) * 2.0, 0.0, 1.0));",
"}",
"",
"float vTime;",
"",
"",
"// animated 3d fbm",
"float fbm3a(vec3 p)",
"{",
"	vec2 t = vec2(vTime * 0.4, 0.0);",
"	return noise3d(p + t.xyy) * 0.5 + noise3d(p * 2.02 - t.xyy) * 0.25 + noise3d(p * 4.01 + t.yxy) * 0.125;",
"}",
"",
"// more animated 3d fbm",
"float fbm3a_(vec3 p)",
"{",
"	vec2 t = vec2(vTime * 0.4, 0.0);",
"	return noise3d(p + t.xyy) * 0.5 + noise3d(p * 2.02 - t.xyy) * 0.25 + noise3d(p * 4.01 + t.yxy) * 0.125 + noise3d(p * 8.03 + t.yxy) * 0.0625;",
"}",
"",
"",
"vec2 rand2(in vec2 p)",
"{",
"	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));",
"}",
"",
"// voronoi distance noise, based on iq's articles",
"float voronoi(in vec2 x)",
"{",
"	vec2 p = floor(x);",
"	vec2 f = fract(x);",
"	",
"	vec2 res = vec2(8.0);",
"	for(int j = -1; j <= 1; j ++)",
"	{",
"		for(int i = -1; i <= 1; i ++)",
"		{",
"			vec2 b = vec2(i, j);",
"			vec2 r = vec2(b) - f + rand2(p + b);",
"			",
"			// chebyshev distance, one of many ways to do this",
"			float d = max(abs(r.x), abs(r.y));",
"			",
"			if(d < res.x)",
"			{",
"				res.y = res.x;",
"				res.x = d;",
"			}",
"			else if(d < res.y)",
"			{",
"				res.y = d;",
"			}",
"		}",
"	}",
"	return res.y - res.x;",
"}",
"",
"// describes the tunnel path",
"vec2 path(float z)",
"{",
"	return vec2(sin(z * 0.1333) * 2.0, cos(z * 0.2) * 2.0);",
"}",
"",
"// this creates cool rectangular detail on a given distance field",
"void technify(vec3 p, inout float d1)",
"{",
"	d1 *= 0.3;",
"	p *= 0.3;",
"",
"	vec4 h = vec4(0.0);",
"	",
"	float p1 = 0.06;",
"	float p2 = 0.0;",
"	",
"	// inspired from cdak source code",
"	for(float i = 0.0; i < 4.0; i ++)",
"	{",
"		vec3 pp = p;",
"		vec3 q = 1.0 + i * i * 0.18 * (1.0 + 4.0 * (1.0 + 0.3 * p2) * sin(vec3(5.7, 6.4, 7.3) * i * 1.145 + 0.3 * sin(h.w * 0.015) * (3.0 + i)));",
"		vec3 g = (fract(pp * q) - 0.5) / q;",
"		",
"		d1 = min(d1 + 0.03 + p1, max(d1, max(abs(g.x), max(abs(g.y), abs(g.z))) - 0.148));",
"	}",
"	",
"	d1 = d1 / 0.28;",
"}",
"",
"float scene(vec3 p)",
"{",
"	float t = vTime * 1.0;",
"	",
"	float v, w;",
"	",
"	p.xy += path(p.z);",
"	p.xy = rotate(p.xy, t * 1.0);",
"	",
"	float s = sin(p.z * 0.4 + time * 0.0) * 0.5;",
"	",
"	float l = length(p.xy) + s;",
"	",
"	v = max(3.0 - l, l - 5.0);",
"	",
"	technify(p, v);",
"	",
"	return v;",
"}",
"",
"vec3 normal(vec3 p)",
"{",
"	float c = scene(p);",
"	vec2 h = vec2(0.01, 0.0);",
"	vec3 nml;",
"	nml.x = scene(p + h.xyy) - c;",
"	nml.y = scene(p + h.yxy) - c;",
"	nml.z = scene(p + h.yyx) - c;",
"	return normalize(nml);",
"}",
"",
"// background",
"vec3 sky(vec3 p)",
"{",
"	vec3 col;",
"	float v = 1.0 - abs(fbm3a(p * 4.0) * 2.0 - 1.0);",
"	float n = fbm3a_(p * 7.0 - 104.042);",
"	v = mix(v, pow(n, 0.3), 0.5);",
"	",
"	col = vec3(pow(vec3(v), vec3(13.0, 7.0, 6.0))) * 0.8;",
"	return col;",
"}",
"",
"vec3 shade(vec3 p, vec3 dir, vec3 nml, vec3 ref, float dist)",
"{",
"	vec3 col;",
"	",
"	// cheap diffuse and specular light",
"	vec3 sun = normalize(vec3(0.2, 1.0, 0.3));",
"	float diff = dot(nml, sun) * 0.5 + 0.5;",
"	float spec = max(dot(ref, sun), 0.0);",
"	spec = pow(spec, 32.0);",
"	col = vec3(0.25, 0.4, 0.5) * diff + spec;",
"	",
"	// a little more detail using voronoi noise as a radial texture",
"	vec3 q = p;",
"	q.xy += path(p.z);",
"	float a = atan(q.x, q.y) - vTime;",
"	float l = q.z * 1.0 + 0.0 * length(q.xy);",
"	",
"	float li = smoothstep(0.4, 1.0, sin(p.z * 0.2 + vTime * 5.0));",
"	float vo = smoothstep(0.90, 1.0, 1.0 - voronoi(1.5 * vec2(a * 3.0, l)));",
"	",
"	col = mix(mix(col, vec3(0.5, 0.8, 1.0) * 0.2, vo), col + vec3(vo) * 0.6, li);",
"	",
"	// sky reflections",
"	col = mix(col, sky(ref), 0.3);",
"	",
"	return col;",
"}",
"",
"void main(void)",
"{",
"	vTime = time * 1.0 + 1.0;",
"	// playing with vTime",
"	float seg = 10.0;",
"	float tfl = floor(vTime / seg) * seg;",
"	float tfr = mod(vTime, seg);",
"	vTime = tfl + tfr - pow(clamp(tfr - 8.0, 0.0, 1.0), 4.0) * (tfr - 9.0) * 0.99 + sin(vTime * 20.0) * pow(2.0 * clamp(tfr - 9.5, 0.0, 1.0), 2.0);",
"	",
"	vec2 uv = gl_FragCoord.xy / resolution.xy;",
"	uv = uv * 2.0 - 1.0;",
"	uv.x *= resolution.x / resolution.y;",
"	",
"	float t = vTime;",
"	",
"	vec3 eye = vec3(0.0, 0.0, t * 15.0);",
"	vec3 dir = normalize(vec3(uv, 1.1));",
"	",
"	",
"	// 3 different camera setups",
"	",
"	float ct = mod(t * 0.2, 3.0);",
"	float blend = smoothstep(0.98, 1.0, cos(PI * 2.0 * t * 0.2));",
"	if(ct > 2.0)",
"	{",
"		eye.y += 20.0;",
"		dir.yz = rotate(dir.yz, sin(t) * 0.2 + PI * 0.5);",
"		dir.xz = rotate(dir.xz, cos(t) * 0.5);",
"	}",
"	else if(ct > 1.0)",
"	{",
"		eye.xy -= path(eye.z);",
"		eye.y += 0.0;",
"		dir.yz = rotate(dir.yz, sin(t) * 0.5 + 0.5);",
"		dir.xz = rotate(dir.xz, cos(t) * 0.5);",
"	}",
"	else",
"	{",
"		eye.xy -= path(eye.z);",
"		eye.y += 8.0;",
"		dir.yz = rotate(dir.yz, sin(t * 1.77) * 0.2);",
"		dir.xz = rotate(dir.xz, cos(t * 1.77) * 0.2);",
"	}",
"	",
"	",
"	vec3 col = sky(dir);",
"	",
"	// raymarch",
"	float d = 0.0;",
"	vec3 ray = eye;",
"	for(int i = 0; i < 100; i ++)",
"	{",
"		d += scene(eye + dir * d) * 0.7;",
"	}",
"	ray = eye + dir * d;",
"	",
"	// without these two lines there is a bug that i don't know how to fix",
"	d = distance(eye, ray);",
"	d = clamp(d, 0.0, 100.0);",
"	",
"	if(d < 100.0)",
"	{",
"		vec3 nml = normal(ray);",
"		col = shade(ray, dir, nml, reflect(dir, nml), d);",
"	}",
"	",
"	// dramatize colors",
"	col = pow(col, vec3(1.5)) * 2.0;",
"	",
"	// vignetting",
"	vec2 q = gl_FragCoord.xy / resolution.xy;",
"	col *= 0.2 + 0.8 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.1);",
"",
"	// blend",
"	col = mix(col, vec3(1.0), blend);",
"	",
"	gl_FragColor = vec4(col, 1.0);",
"}"
].join("\n");

PUMPER.GL.Shaders.JuliaFragment = [
"#ifdef GL_ES",
"precision mediump float;",
"#endif",
"",
"uniform float time;",
"uniform vec2 mouse;",
"uniform vec2 resolution;",
"",
"//orbit traps from julia version of fractal formula z=(z+1/z+c)*-scale;",
"",
"#define zoom 12.",
"#define offset vec2(0.3,0.2)",
"",
"#define iterations 15",
"#define scale -.4",
"#define julia vec2(2.2,0.75)",
"",
"#define orbittraps vec3(.8,.5,-.01)",
"#define trapswidths vec3(.2,.2,.3)",
"",
"#define trap1color vec3(1.00,0.30,0.10)",
"#define trap2color vec3(1.00,0.50,0.10)",
"#define trap3color vec3(0.10,0.20,1.00)",
"",
"#define trapsbright vec3(1.,.8,.7)",
"#define trapscontrast vec3(5.,10.,5.)",
"",
"#define trapsfreq vec3(5.,8.,20.)",
"#define trapsamp vec3(.03,.03,.01)",
"#define trapspeeds vec3(20.,20.,40.)",
"",
"#define saturation .8",
"#define brightness .9",
"#define contrast 1.35",
"#define minbright .5",
"",
"#define antialias 2. //max 4",
"",
"",
"vec2 rotate(vec2 p, float angle) {",
"return p*mat2(cos(angle),sin(angle),-sin(angle),cos(angle));",
"}",
"",
"void main(void)",
"{",
"	vec3 aacolor=vec3(0.);",
"	vec2 uv=gl_FragCoord.xy / resolution.xy - 0.5;",
"	float aspect=resolution.x/resolution.y;",
"	vec2 pos=uv;",
"	pos.x*=aspect;",
"	float t=time*.07;",
"	float zoo=.005+pow(abs(sin(t*.5+1.4)),5.)*zoom;",
"	pos=rotate(pos,t*1.2365);",
"	pos+=offset;",
"	pos*=zoo; ",
"	vec2 pixsize=1./resolution.xy*zoo;",
"	pixsize.x*=aspect;",
"	float av=0.;",
"	vec3 its=vec3(0.);",
"	for (float aa=0.; aa<16.; aa++) {",
"		vec3 otrap=vec3(1000.);",
"		if (aa<antialias*antialias) {",
"			vec2 aacoord=floor(vec2(aa/antialias,mod(aa,antialias)));",
"			vec2 z=pos+aacoord*pixsize/antialias;",
"			for (int i=0; i<iterations; i++) {",
"				vec2 cz=vec2(z.x,-z.y);",
"				z=z+cz/dot(z,z)+julia;",
"				z=z*scale;",
"				float l=length(z);",
"				vec3 ot=abs(vec3(l)-orbittraps+",
"					(sin(pos.x*trapsfreq/zoo+t*trapspeeds)+",
"					 sin(pos.y*trapsfreq/zoo+trapspeeds))*trapsamp);",
"				if (ot.x<otrap.x) {",
"					otrap.x=ot.x;",
"					its.x=float(iterations-i);	",
"				}",
"				if (ot.y<otrap.y) {",
"					otrap.y=ot.y;",
"					its.y=float(iterations-i);	",
"				}",
"				if (ot.z<otrap.z) {",
"					otrap.z=ot.z;",
"					its.z=float(iterations-i);	",
"				}",
"			}",
"		}",
"		otrap=pow(max(vec3(0.),trapswidths-otrap)/trapswidths,trapscontrast);",
"		its=its/float(iterations);",
"		vec3 otcol1=otrap.x*pow(trap1color,3.5-vec3(its.x*3.))*max(minbright,its.x)*trapsbright.x;",
"		vec3 otcol2=otrap.y*pow(trap2color,3.5-vec3(its.y*3.))*max(minbright,its.y)*trapsbright.y;",
"		vec3 otcol3=otrap.z*pow(trap3color,3.5-vec3(its.z*3.))*max(minbright,its.z)*trapsbright.z;",
"		aacolor+=(otcol1+otcol2+otcol3);",
"	}",
"	aacolor=aacolor/(antialias*antialias)+.15;",
"	vec3 color=mix(vec3(length(aacolor)),aacolor,saturation)*brightness;",
"	color=pow(color,vec3(contrast));		",
"	gl_FragColor = vec4(color,1.0);",
"}"
].join("\n");
PUMPER.GL.Shaders.LaserBubblesFragment = [
"#ifdef GL_ES",
"precision mediump float;",
"#endif",
"uniform float time;",
"uniform vec2 resolution;",
"",
"",
"//Lasers & Bubbles by Kali",
"// copied in from https://www.shadertoy.com/view/XssGDn ... please preserve credits",
"//comment next line to disable DOF",
"#define DOF ",
"",
"//Rotation function by Syntopia",
"mat3 rotmat(vec3 v, float angle)",
"{",
"	float c = cos(angle);",
"	float s = sin(angle);",
"	",
"	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,",
"		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,",
"		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z",
"		);",
"}",
"",
"//Distance Field",
"vec4 de(vec3 pos) {",
"	vec3 A=vec3(4.);",
"	vec3 p = abs(A-mod(pos,2.0*A)); //tiling fold by Syntopia",
"	float sph=length(p)-.6;",
"	float cyl=length(p.xy)-.012;",
"	cyl=min(cyl,length(p.xz))-.012;",
"	cyl=min(cyl,length(p.yz))-.012;",
"	p=p*rotmat(normalize(vec3(0,0,1.)),radians(45.));",
"	if (max(abs(pos.x),abs(pos.y))>A.x) {",
"	cyl=min(cyl,length(p.xy))-.012;",
"	cyl=min(cyl,length(p.xz))-.012;",
"	cyl=min(cyl,length(p.yz))-.012;",
"	}",
"   float d=min(cyl,sph);",
"	vec3 col=vec3(0.);",
"	if (sph<(cyl) && d<.1) col=vec3(.5,.85,.7); else col=vec3(1.2,0.2,0.1);",
"	return vec4(col,d);	",
"	",
"}",
"",
"",
"void main(void)",
"{",
"	//float time = iGlobalTime; //just because it's more handy :)",
"",
"	float focus=.13;	",
"	float viewangle=0.;	",
"	",
"	//camera",
"	mat3 rotview=rotmat(vec3(0.,1.,0.),radians(viewangle));",
"	vec2 coord = gl_FragCoord.xy / resolution.xy *2.2 - vec2(1.);",
"	coord.y *= resolution.y / resolution.x;",
"	float fov=min((time*.2+.2),0.9); //animate fov at start",
"	vec3 from = vec3(0.,sin(time*.5)*2.,time*5.);",
"	",
"	vec3 p;",
"	float totdist=-1.5;",
"	float intens=1.;",
"	float maxdist=90.;",
"	vec3 col=vec3(0.);",
"	vec3 dir;",
"	for (int r=0; r<150; r++) {",
"		dir=normalize(vec3(coord.xy*fov,1.))*rotview ",
"			*rotmat(normalize(vec3(0.05,0.05,1.)),time*.3+totdist*.015); //rotate ray",
"		vec4 d=de(p); //get de and color",
"		float distfactor=totdist/maxdist;",
"		float fade=exp(-.06*distfactor*distfactor); //distance fade",
"		float dof=min(.15,1.-exp(-2.*pow(abs(distfactor-focus),2.))); //focus",
"		float dd=abs(d.w); ",
"		#ifdef DOF",
"			totdist+=max(0.007+dof,dd); //bigger steps = out of focus",
"		#else",
"			totdist+=max(0.007,dd);",
"		#endif",
"		if (totdist>maxdist) break; ",
"		p=from+totdist*dir;",
"		intens*=fade; //lower bright with distance",
"		col+=d.xyz*intens; //accumulate color",
"	}",
"	",
"	col=col/maxdist; //average colors (kind of)",
"	col*=pow(length(col),1.3)*.5; //contrast & brightness",
"	",
"	//light",
"	col+=vec3(1.1,.95,.85)*pow(max(0.,dot(dir,vec3(0.,0.,1.))),12.)*.8; ",
"	col+=vec3(.2,.17,.12)*pow(max(0.,dot(dir,vec3(0.,0.,1.))),200.);",
"	",
"	col*=min(1.,time); //fade in",
"",
"	gl_FragColor = vec4(col,1.0);	",
"}"
].join("\n");

PUMPER.GL.GenerateNoiseTexture = function(gl, width, height)    {
    var DataBuff = new Uint8Array(width*height*4);
    var i=0, len=width*height*4;
    while(i<len)    {
        DataBuff[i+0] = Math.random()*256;
        DataBuff[i+1] = Math.random()*256;
        DataBuff[i+2] = Math.random()*256;
        DataBuff[i+3] = 255;
        i+=4;
    }
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, DataBuff);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return texture;
};

PUMPER.GL.PIUBGAOFF = function(gl, width, height)   {
    this.gl = gl;
    
    this.vertexShader               = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.NullVertexShader, this.gl.VERTEX_SHADER);
    this.fragmentShader             = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.PIUBGAOffFragment /*LaserBubblesFragment*/, this.gl.FRAGMENT_SHADER);
    this.programShader              = PUMPER.GL.createProgram(this.gl, this.vertexShader, this.fragmentShader);
    
    this.gl.useProgram(this.programShader);
    
    this.programShader.time         = this.gl.getUniformLocation( this.programShader, "time" );
    this.programShader.resolution   = this.gl.getUniformLocation( this.programShader, "resolution" );
    this.programShader.uSampler     = this.gl.getUniformLocation( this.programShader, "uSampler");
    this.programShader.position     = this.gl.getAttribLocation ( this.programShader, "position" );
    this.gl.enableVertexAttribArray(this.programShader.position);
    
    this.NoiseTexture = PUMPER.GL.GenerateNoiseTexture(this.gl, 256,256);
    
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
     
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
    this.texture.width = width; 
    this.texture.height = height; 
    this.texture.rwidth = width;
    this.texture.rheight = height;  
    
    this.RenderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(gl.RENDERBUFFER, this.RenderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    this.FrameBuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.FrameBuffer);
    this.FrameBuffer.width = width;
    this.FrameBuffer.height = height;    
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.RenderBuffer);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    
    this.resolution = 2;
    this.startTime = Date.now();
    this.time = 0;
    
    this.VertexBuffer           = this.gl.createBuffer();
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array( new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ) ) , this.gl.STATIC_DRAW);
    
};
PUMPER.GL.PIUBGAOFF.prototype.Render = function() {
    this.time = Date.now() - this.startTime;
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.FrameBuffer);
    
    this.gl.viewport(0,0, this.FrameBuffer.width, this.FrameBuffer.height);
    
    this.gl.useProgram(this.programShader);
    this.gl.uniform1f(this.programShader.time, this.time / 1000);
    this.gl.uniform2f(this.programShader.resolution, this.FrameBuffer.width, this.FrameBuffer.height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexBuffer);
    this.gl.vertexAttribPointer(this.programShader.position, 2, this.gl.FLOAT, false, 0, 0);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D,  this.NoiseTexture);
    this.gl.uniform1i(this.programShader.uSampler, 0);
    
    this.gl.drawArrays( this.gl.TRIANGLES, 0, 6 );
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
};

PUMPER.GL.LaserBubblesRender = function(gl, width, height)   {
    this.gl = gl;
    
    this.vertexShader               = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.NullVertexShader, this.gl.VERTEX_SHADER);
    this.fragmentShader             = PUMPER.GL.compileShader(this.gl, PUMPER.GL.Shaders.LaserBubblesFragment /*LaserBubblesFragment*/, this.gl.FRAGMENT_SHADER);
    this.programShader              = PUMPER.GL.createProgram(this.gl, this.vertexShader, this.fragmentShader);
    
    this.gl.useProgram(this.programShader);
    
    this.programShader.time         = this.gl.getUniformLocation( this.programShader, "time" );
    this.programShader.resolution   = this.gl.getUniformLocation( this.programShader, "resolution" );
    this.programShader.position     = this.gl.getAttribLocation ( this.programShader, "position" );
    
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
     
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
    this.texture.width = width; 
    this.texture.height = height; 
    this.texture.rwidth = width;
    this.texture.rheight = height;  
    
    this.RenderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(gl.RENDERBUFFER, this.RenderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    this.FrameBuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.FrameBuffer);
    this.FrameBuffer.width = width;
    this.FrameBuffer.height = height;    
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.RenderBuffer);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    
    this.resolution = 2;
    this.startTime = Date.now();
    this.time = 0;
    
    this.VertexBuffer           = this.gl.createBuffer();
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array( new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ) ) , this.gl.STATIC_DRAW);
    
};
PUMPER.GL.LaserBubblesRender.prototype.Render = function() {
    this.time = Date.now() - this.startTime;
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.FrameBuffer);
    
    this.gl.viewport(0,0, this.FrameBuffer.width, this.FrameBuffer.height);
    //this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    this.gl.useProgram(this.programShader);
    this.gl.uniform1f(this.programShader.time, this.time / 1000);
    this.gl.uniform2f(this.programShader.resolution, this.FrameBuffer.width, this.FrameBuffer.height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VertexBuffer);
    this.gl.vertexAttribPointer(this.programShader.position, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays( this.gl.TRIANGLES, 0, 6 );
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
};
