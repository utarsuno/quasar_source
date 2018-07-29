// Originally based off of : https://gist.github.com/mattdw/60efe28d5e787655f618e2a70a4e8bfe
varying vec2 vUv;
uniform float offset;
// TODO : Test changing number_of_textures into a define statement.
void main() {
    float number_of_textures = 1.0 / 27.0;
    vUv = vec2(uv.x, uv.y) * vec2(number_of_textures, 1.0) + vec2(number_of_textures * offset, 0.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}