uniform sampler2D utexture;
varying vec2 vuv;
varying float valpha;

void main() {

    // gl_FragColor = vec4(1,1,1,1);
    gl_FragColor = texture2D(utexture, vuv);
    gl_FragColor.a *= valpha;
}
