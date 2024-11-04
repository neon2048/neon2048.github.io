varying vec4 vcol;
varying vec2 vUV;

uniform float utime;

// https://www.shadertoy.com/view/4djSRW
#define MOD3 vec3(.1031,.11369,.13787)
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

void main() {

    vec2 uv = vUV - vec2(0.5,0.5);

    float l = length(uv) * 2. * (1.+(perlin_noise(vec3(uv*7., utime)))*0.33);

    float m1 = clamp(.1/smoothstep(.3, 1., l), 0., 1.);
    float m2 = clamp(.1/smoothstep(.45, 0., l), 0., 1.);

    float m3 = clamp(.1/smoothstep(.1, 1., l), 0., 1.);
    float m4 = clamp(.1/smoothstep(.35, 0., l), 0., 1.);

    float m5 = clamp(.1/smoothstep(.05, 1., l), 0., 1.);
    float m6 = clamp(.1/smoothstep(.3, 0., l), 0., 1.);

    float m = max(m1 * m2, m3*m4);
    m = max(m, m5*m6);
    m = pow(m,3.);
    vec4 col = vcol;
    col.a = m;
    gl_FragColor = col;
}
