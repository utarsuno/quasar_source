// Based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
// TODO : Optimization, since height is contstant only use a 1D float for offset;
uniform vec2 offset;
uniform vec2 repeat;
uniform sampler2D texture;
uniform vec3 color;
void main(void) {
    gl_FragColor = texture2D(texture, vUv) * vec(color, 1.0);
}