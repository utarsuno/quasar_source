'use strict';

// Code based from : https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js

function TheTransition() {
    this.__init__();
}

TheTransition.prototype = {
    __init__: function() {
        this.texture = MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_TRANSITION, TRANSITION_GRID);
        this.shader_vertex = MANAGER_SHADER.get_shader(SHADER_TRANSITION_VERTEX);
        this.shader_fragment = MANAGER_SHADER.get_shader(SHADER_TRANSITION_FRAGEMENT);
        this.quad_material = new THREE.ShaderMaterial( {
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
                tMixTexture: {
                    value: this.texture
                }
            },
            vertexShader: this.shader_vertex,
            fragmentShader: this.shader_fragment
        });
        //this.quad_geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    }
};

function TransitionPair(scene_a, scene_b, the_transition, renderer_manager) {
    this.__init__(scene_a, scene_b, the_transition, renderer_manager);
}


// Code based from : https://github.com/mrdoob/three.js/blob/master/examples/js/crossfade/transition.js
TransitionPair.prototype = {
    __init__: function(scene_a, scene_b, the_transition, renderer_manager) {
        this.scene = new THREE.Scene();
        this.scene_a = scene_a;
        this.scene_b = scene_b;
        this.renderer_manager = renderer_manager;
        this.the_transition = the_transition;
        this.elapsed_delta = 0;
        this.transition    = 0;
        this.transition_speed = 2.25;
    },
    set_size_if_needed: function(current_resize) {
        if (current_resize !== this.current_resize) {
            if (is_defined(this.quad_geometry)) {
                this.quad_geometry.dispose();
                this.scene.remove(this.quad);
                this.quad.mesh.dispose();
                this.quad_geometry = null;
                this.quad = null;
            }
        }
        this.camera_ortho = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10);
        this.quad_geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
        this.quad = new THREE.Mesh(this.quad_geometry, this.the_transition.quad_material);

        this.the_transition.quad_material.uniforms.tDiffuse1.value = this.scene_a.fbo.texture;
        this.the_transition.quad_material.uniforms.tDiffuse2.value = this.scene_b.fbo.texture;
    },
    is_pair: function(scene_a, scene_b) {
        return this.scene_a === scene_a && this.scene_b === scene_b;
    },
    start: function() {
        this.elapsed_delta = 0;
        this.transition    = 0;
    },
    render: function(delta) {
        var t = (1 + Math.sin(this.transition_speed * this.elapsed_delta / Math.PI)) / 2;
        this.transition = THREE.Math.smoothstep(t, 0.3, 0.7);

        this.the_transition.quad_material.uniforms.mixRatio.value = this.transition;

        // Prevent render both scenes when it's not necessary
        if (this.transition == 0 ) {
            this.scene_b.render(delta, false);
        } else if (this.transition == 1) {
            this.scene_a.render(delta, false);
            this.renderer_manager.in_transition = false;
        } else {
            // When 0<transition<1 render transition between two scenes
            this.scene_a.render(delta, true);
            this.scene_b.render(delta, true);

            this.renderer_manager.renderer.render(this.scene, this.camera_ortho, null, true);
        }

        this.elapsed_delta += delta;
    }
};

function WorldTransition() {
    this._the_transition = null;
    this.current_transition = null;
    this.in_transition = false;

    this.load_transition = function() {
        this._the_transition = new TheTransition(this);
    };

    this._transition_pairs = [];

    this._get_transition_pair = function(old_scene, new_scene) {
        for (var t = 0; t < this._transition_pairs.length; t++) {
            if (this._transition_pairs[t].is_pair(old_scene, new_scene)) {
                return this._transition_pairs[t];
            }
        }
        var new_transition_pair = new TransitionPair(old_scene, new_scene, this._the_transition, this.current_resize);
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
        this.in_transition = true;
        this.current_transition = this._get_transition_pair(old_scene, new_scene);
        this.current_transition.set_size_if_needed(this.current_resize);
        this.current_transition.start();
    };

    this.transition_render = function(delta) {
        this.current_transition.render(delta);
    };

    this._set_current_scene = function(scene) {
        this.outline_glow.set_to_hover_color();
        this.outline_glow.remove_current_object();
        this.outline_glow.outline_pass.renderScene = scene;
        this.render_pass.scene = scene;
    };

}

// this.transition_render(delta);this.renderer.render(MANAGER_WORLD.current_world.scene, this.camera);