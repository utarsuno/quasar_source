// Originally based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
uniform float offset;
void main() {
    // 2048 / 64 == 32
    // 1 / 32 == 0.03125
    vUv = vec2(uv.x, uv.y) * vec2(0.03125, 1.0) + vec2(0.03125 * offset, 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}