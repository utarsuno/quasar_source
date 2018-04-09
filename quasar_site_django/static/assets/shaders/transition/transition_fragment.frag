// Base shader from : https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js
uniform float mixRatio;

uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tMixTexture;

uniform float threshold;

varying vec2 vUv;

void main() {
    vec4 texel1 = texture2D(tDiffuse1, vUv);
    vec4 texel2 = texture2D(tDiffuse2, vUv);

    vec4 transitionTexel = texture2D(tMixTexture, vUv);
    float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
    float mixf=clamp((transitionTexel.r - r) * (1.0 / threshold), 0.0, 1.0);

    gl_FragColor = mix(texel1, texel2, mixf);
}