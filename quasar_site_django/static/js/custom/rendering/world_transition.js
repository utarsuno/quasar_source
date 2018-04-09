'use strict';

// Code based from : https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js

function TheTransition() {
    this.__init__();
}

TheTransition.prototype = {
    __init__: function() {
        this.quadmaterial = new THREE.ShaderMaterial( {
            uniforms: {
                tDiffuse1: {
                    value: null
                },
                tDiffuse2: {
                    value: null
                },
                mixRatio: {
                    value: 0.0
                },
                threshold: {
                    value: 0.1
                },
                useTexture: {
                    value: 1
                },
                tMixTexture: {
                    value: this.textures[ 0 ]
                }
            },
            vertexShader: [
                'varying vec2 vUv;',

                'void main() {',

                'vUv = vec2( uv.x, uv.y );',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

                '}'

            ].join( '\n' ),
            fragmentShader: [

                'uniform float mixRatio;',

                'uniform sampler2D tDiffuse1;',
                'uniform sampler2D tDiffuse2;',
                'uniform sampler2D tMixTexture;',

                'uniform int useTexture;',
                'uniform float threshold;',

                'varying vec2 vUv;',

                'void main() {',

                'vec4 texel1 = texture2D( tDiffuse1, vUv );',
                'vec4 texel2 = texture2D( tDiffuse2, vUv );',

                'if (useTexture==1) {',

                'vec4 transitionTexel = texture2D( tMixTexture, vUv );',
                'float r = mixRatio * (1.0 + threshold * 2.0) - threshold;',
                'float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);',

                'gl_FragColor = mix( texel1, texel2, mixf );',
                '} else {',

                'gl_FragColor = mix( texel2, texel1, mixRatio );',

                '}',
                '}'

            ].join( '\n' )

        } );
    }
};

function TransitionPair(scene_a, scene_b) {
    this.__init__(scene_a, scene_b);
}

TransitionPair.prototype = {
    __init__: function(scene_a, scene_b) {
        this.scene_a = scene_a;
        this.scene_b = scene_b;
    },
    is_pair: function(scene_a, scene_b) {
        return this.scene_a === scene_a && this.scene_b === scene_b;
    }
};

function WorldTransition() {

    this._transition_texture = MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_TRANSITION, TRANSITION_GRID);

    this._transition_pairs = [];

    this._get_transition_pair = function(old_scene, new_scene) {
        for (var t = 0; t < this._transition_pairs.length; t++) {
            if (this._transition_pairs[t].is_pair(old_scene, new_scene)) {
                return this._transition_pairs[t];
            }
        }
        var new_transition_pair = new TransitionPair(old_scene, new_scene);
        this._transition_pairs.push(new_transition_pair);
        return new_transition_pair;
    };

    this.set_current_scene = function(scene, old_scene) {
        if (is_defined(old_scene)) {
            this._transition_between_scenes(scene, old_scene);
        } else {
            this._set_current_scene(scene);
        }
    };

    this._transition_between_scenes = function(old_scene, new_scene) {

    };

    this._set_current_scene = function(scene) {
        this.outline_glow.set_to_hover_color();
        this.outline_glow.remove_current_object();
        this.outline_glow.outline_pass.renderScene = scene;
        this.render_pass.scene = scene;
    };

}