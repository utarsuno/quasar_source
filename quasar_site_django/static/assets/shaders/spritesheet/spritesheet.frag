// Based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
// TODO : Optimization, since height is contstant only use a 1D float for offset;
uniform float offset;
uniform vec2 repeat;
uniform sampler2D texture;
uniform vec3 color;
void main(void) {
    if (texture.r < 0.5) {
        discard;
    }
    gl_FragColor = texture2D(texture, vUv) * vec4(color, 1.0);
    //gl_FragColor = texture2D(texture, vUv) * vec4(1.0, 0.0, 1.0, 1.0);
}