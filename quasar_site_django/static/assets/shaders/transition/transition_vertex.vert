// Base shader from : https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js
varying vec2 vUv;

void main() {
	vUv         = vec2(uv.x, uv.y);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}