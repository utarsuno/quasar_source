// Based off : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
uniform sampler2D texture;
uniform vec3 color;
uniform float alpha;

void main(void) {
    gl_FragColor = texture2D(texture, vUv);
    if (gl_FragColor.a < 0.05) {
        discard;
    } else {
        gl_FragColor.r = color.r;
        gl_FragColor.g = color.g;
        gl_FragColor.b = color.b;
        gl_FragColor.a *= alpha;
    }
}