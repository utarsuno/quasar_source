'use strict';

const FRAGMENT_GLOW = [
    'uniform vec3 glowColor;',
    'varying float intensity;',
    'void main() {',
    '\tvec3 glow = glowColor * intensity;',
    '\tgl_FragColor = vec4( glow, 1.0 );',
    '}'
].join('\n');

const VERTEX_GLOW = [
    'uniform vec3 viewVector;',
    'uniform float c;',
    'uniform float p;',
    'varying float intensity;',
    'void main() {',
    '\tvec3 vNormal = normalize( normalMatrix * normal );',
    '\tvec3 vNormel = normalize( normalMatrix * viewVector );',
    '\tintensity = pow( c - dot(vNormal, vNormel), p );',
    '\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
].join('\n');

function ShaderAPI() {
    this.__init__();
}

ShaderAPI.prototype = {

    __init__: function() {
        l('GLOW!');
        l(FRAGMENT_GLOW);
        l('\n\n');
        l('GLOW 2');
        l(VERTEX_GLOW);
        l('\n\n');
    }
};

