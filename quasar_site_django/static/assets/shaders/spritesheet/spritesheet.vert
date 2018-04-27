// Based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
// TODO : Optimization, since height is contstant only use a 1D float for offset;
//uniform vec2 offset;
uniform float offset;
uniform vec2 repeat;
void main() {
    //vUv = uv * repeat + offset;
    //vUv = vec2(uv.x, uv.y) * vec2(.037, 1);
    vUv = vec2(uv.x, uv.y) * vec2(1.0 / 27.0, 1.0) + vec2(1.0 / 27.0 * offset, 0.0);
    //vUv = vec2(uv.x, uv.y) * vec2(.037, 1) + vec2(.037 * offset, 0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}