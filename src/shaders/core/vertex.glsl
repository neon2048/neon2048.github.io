varying vec4 vcol;
uniform float utime;
uniform float utime_expand;
uniform float utime_fade;
uniform float utime_contract;
uniform vec3 umouse;
uniform float uradius;

#define MOD3 vec3(.1031,.11369,.13787)
#define STARTOFF 4.71238898038469 

// https://www.shadertoy.com/view/4djSRW
vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

// Perlin Noise function from https://www.shadertoy.com/view/4sc3z2
float perlin_noise(vec3 p)
{
    vec3 pi = floor(p);
    vec3 pf = p - pi;
    
    vec3 w = pf * pf * (3.0 - 2.0 * pf);
    
    return 	mix(
        		mix(
                	mix(dot(pf - vec3(0, 0, 0), hash33(pi + vec3(0, 0, 0))), 
                        dot(pf - vec3(1, 0, 0), hash33(pi + vec3(1, 0, 0))),
                       	w.x),
                	mix(dot(pf - vec3(0, 0, 1), hash33(pi + vec3(0, 0, 1))), 
                        dot(pf - vec3(1, 0, 1), hash33(pi + vec3(1, 0, 1))),
                       	w.x),
                	w.z),
        		mix(
                    mix(dot(pf - vec3(0, 1, 0), hash33(pi + vec3(0, 1, 0))), 
                        dot(pf - vec3(1, 1, 0), hash33(pi + vec3(1, 1, 0))),
                       	w.x),
                   	mix(dot(pf - vec3(0, 1, 1), hash33(pi + vec3(0, 1, 1))), 
                        dot(pf - vec3(1, 1, 1), hash33(pi + vec3(1, 1, 1))),
                       	w.x),
                	w.z),
    			w.y);
}

const float SIZE_EXPAND_MULTIPLIER = 0.25;
const float NOISE_EXPAND_MAX = 7.;
const float PERLIN_MULTIPLIER = 0.8;
const float COLOR_PULSE_MULTIPLIER = .3;

const vec4 COL1 = vec4(0.40, 0.03, 0.14, 1.);
const vec4 COL2 = vec4(0.93, 0.05, 0.17, 1.);

void main() {

  float multiplier = 1.;
  vec3 pos = position;
  vec3 perl_pos = position;

  if( utime_expand > 0. ) {
    float progress = smoothstep(0.,1., utime_expand);
    multiplier = multiplier + progress*SIZE_EXPAND_MULTIPLIER;

    pos = pos * multiplier;
    perl_pos = perl_pos*mix(1., NOISE_EXPAND_MAX, progress);
  }

  perl_pos.x += utime*0.3;
  float noise = perlin_noise(perl_pos);

  pos = pos + normal * uradius * multiplier * noise * PERLIN_MULTIPLIER;

  float sinTime = 0.5+sin(STARTOFF+utime)/2.;
  vcol = mix(COL1, COL2, noise-sinTime*COLOR_PULSE_MULTIPLIER);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
