void main() {
    // modelViewMatrix   - passed in from THREE.js (position of model within our scene)
    // position          - the vertex position
    // modelViewPosition - camera's relation to the scene
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}