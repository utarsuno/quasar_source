precision mediump float;
//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//
#pragma glslify: grain = require('glsl-film-grain')
#pragma glslify: blend = require('glsl-blend-soft-light')

uniform vec3 color1;
uniform vec3 color2;
uniform float aspect;
uniform vec2 offset;
uniform vec2 scale;
uniform float noiseAlpha;
uniform float grainScale;
uniform float grainTime;
uniform vec2 smooth;

varying vec2 vUv;

void main() {
  vec2 q = vec2(vUv - 0.5);

  // aspectCorrection
  q.x *= aspect;

  q /= scale;
  q -= offset;
  float dst = length(q);
  dst = smoothstep(smooth.x, smooth.y, dst);
  vec3 color = mix(color1, color2, dst);
  
  if (noiseAlpha > 0.0 && grainScale > 0.0) {
    float gSize = 1.0 / grainScale;
    float g = grain(vUv, vec2(gSize * aspect, gSize), grainTime);
    vec3 noiseColor = blend(color, vec3(g));
    gl_FragColor.rgb = mix(color, noiseColor, noiseAlpha);
  } else {
    gl_FragColor.rgb = color;
  }
  gl_FragColor.a = 1.0;
}