// Originally based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
uniform float offset;
uniform vec2 repeat;
uniform sampler2D texture;
uniform vec3 color;
void main(void) {
    gl_FragColor = texture2D(texture, vUv) * vec4(color, 1.0);
    if (gl_FragColor.a < 0.1) {
        discard;
    }
}