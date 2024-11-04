uniform float utime;

varying vec4 vcol;

const vec4 COL1 = vec4(0.05, 0.05, 0.09, 1.0);

const float PI2 = 6.283185307179586;
void main() {


    vec3 cur_pos = position;
    float frequency1 = 4.;
    float offset1 = -utime;
    float waveHeight1 = 0.1 + 0.025 * sin(utime);

    float frequency2 = 1.;
    float offset2 = -utime;
    float waveHeight2 = 0.05;

    cur_pos.z += 
        cos(position.y * frequency1 + offset1)
        * sin(position.x * frequency1 + offset1)
        * waveHeight1;

    cur_pos.z += 
        cos(position.y * frequency2 + offset2) 
        * sin(position.x * frequency2 + offset2)
        * waveHeight2;

    vcol = COL1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(cur_pos, 1.);

}
