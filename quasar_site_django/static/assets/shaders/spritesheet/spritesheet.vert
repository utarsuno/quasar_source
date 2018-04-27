// Based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vUv;
// TODO : Optimization, since height is contstant only use a 1D float for offset;
uniform vec2 offset;
uniform vec2 repeat;
uniform sampler2D texture;
uniform vec3 color;
void main() {
    vUv = uv * repeat + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}