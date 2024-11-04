uniform float utime;
uniform float upixwidth;
uniform float upixheight;
uniform float uxelements;
uniform float uyelements;
uniform float uAnimationDuration;
uniform float ualpha;
uniform float uExplosionSize;
uniform float uExplosionMultiplier;


const int MAX_EXPLOSIONS = 10;
uniform vec3 uExplosionCenters[MAX_EXPLOSIONS];
uniform float uExplosionStartTimes[MAX_EXPLOSIONS];

attribute float instance_id;

varying vec2 vuv;
varying float valpha;


// https://www.shadertoy.com/view/4djSRW
vec3 hash31(float p)
{
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx+33.33);
   return fract((p3.xxy+p3.yzz)*p3.zyx); 
}


void main() {
    vuv = uv;

    vec3 cur_pos = position;

    float posx = mod(instance_id, uxelements);
    float posy = floor(instance_id / uxelements);

    vec3 scale = vec3(upixwidth,upixheight,1);
    vec3 pixeloffset = vec3(upixwidth * posx, upixheight*posy, 0) + vec3(
        -upixwidth*(uxelements/2.0-0.5),
        -upixheight*(uyelements/2.0-0.5),
        0.
    );

    cur_pos = cur_pos * scale + pixeloffset;
    vec3 rng = (hash31(instance_id)*2.-1.);



    for(int i=0;i<MAX_EXPLOSIONS;i++){

        if(uExplosionStartTimes[i] == 0.){
            break;
        }

        if(utime >= uExplosionStartTimes[i] && utime <= uExplosionStartTimes[i]+uAnimationDuration){
            float dist = 
                uExplosionSize - distance(pixeloffset, uExplosionCenters[i]);

            dist = max(dist, 0.0);
            float passed = utime - uExplosionStartTimes[i];
            vec3 offset = rng * 
                pow(dist,3.) * 
                sin(mix(0., 3.1415926, passed/uAnimationDuration)) * uExplosionMultiplier;
            cur_pos = cur_pos + offset;

        }
    }


    float dist = distance(pixeloffset, vec3(0,0,0));
    vec3 tgt_pos = cur_pos + rng*6. * pow(dist,4.) * 1.;
    float prog = 1.-pow(1.-min(utime*0.2,1.),8.);
    cur_pos = mix(tgt_pos, cur_pos, prog);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(cur_pos, 1.);

    valpha = clamp(ualpha, 0., 1.);
    vuv.x = vuv.x/uxelements + (1./uxelements)*posx;
    vuv.y = vuv.y/uyelements + (1./uyelements)*posy;
}
