uniform float utime;

varying vec4 vcol;
const vec4 COL1 = vec4(0.91, 0.81, 0.84, 1.0);

varying vec2 vUV;

void main() {
    vcol = COL1;
    vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
