// Base shader from : https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js
uniform float mix_ratio;

uniform sampler2D texture_diffuse_new_scene;
uniform sampler2D texture_diffuse_old_scene;
uniform sampler2D texture_mix;

uniform float threshold;

varying vec2 vUv;

void main() {
    vec4 texel1 = texture2D(texture_diffuse_new_scene, vUv);
    vec4 texel2 = texture2D(texture_diffuse_old_scene, vUv);

    vec4 transition_texel = texture2D(texture_mix, vUv);
    float r               = mix_ratio * (1.0 + threshold * 2.0) - threshold;
    float mixf            = clamp((transition_texel.r - r) * (1.0 / threshold), 0.0, 1.0);

    gl_FragColor = mix(texel1, texel2, mixf);
}
