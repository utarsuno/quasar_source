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
                //    value: 0.1
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
        this.scene_old = scene_a;
        this.scene_new = scene_b;
        this.renderer_manager = renderer_manager;
        this.the_transition = the_transition;
        this.elapsed_delta = 0;
        this.transition    = 0;
        this.transition_speed = 0.65;
    },
    set_size_if_needed: function(current_resize) {
        if (current_resize !== this.current_resize) {
            if (is_defined(this.quad_geometry)) {
                this.quad_geometry.dispose();
                this.scene.remove(this.quad);
                //this.quad.dispose();
                this.quad_geometry = null;
                this.quad = null;
            }
        }
        this.camera_ortho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10);
        this.quad_geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
        this.quad = new THREE.Mesh(this.quad_geometry, this.the_transition.quad_material);

        this.scene.add(this.quad);

        this.the_transition.quad_material.uniforms.tDiffuse1.value = this.scene_new.fbo.texture;
        this.the_transition.quad_material.uniforms.tDiffuse2.value = this.scene_old.fbo.texture;
        l(this.scene_old.fbo.texture);
        l('---');
    },
    is_pair: function(scene_a, scene_b) {
        return this.scene_new === scene_b && this.scene_old === scene_a;
        //return this.scene_new === scene_a && this.scene_old === scene_b;
    },
    start: function(previous_camera, current_camera, transition_finished_callback) {
        this.elapsed_delta = 0;
        this.transition    = 0;
        this.previous_camera = previous_camera;
        this.current_camera  = current_camera;
        this.transition_finished_callback = transition_finished_callback;


        // TEMPORARY TESTING!!!
        //this.cube_camera = new THREE.CubeCamera(1, 10000, 128);
        this.fake_camera = new THREE.Camera();
        this.fake_scene = new THREE.Scene();
        //this.fake_scene.background = this.scene_old.fbo.texture;
        //this.fake_scene.background = COLOR_BLUE;

        this.renderer_manager.renderer.autoClear = false;
        this.renderer_manager.renderer.render(this.scene_old, this.current_camera, this.scene_old.fbo, true);

        this.fake_scene.background = this.scene_old.fbo;

    },
    render: function(delta) {
        //var t = (1 + Math.sin(this.transition_speed * this.elapsed_delta / Math.PI)) / 2;
        //this.transition = THREE.Math.smoothstep(t, 0.4, 0.6);
        //this.transition = t;
        this.transition = this.elapsed_delta;

        this.the_transition.quad_material.uniforms.mixRatio.value = this.transition;

        // TEMP
        //this.the_transition.quad_material.uniforms.tDiffuse1.value = this.scene_new.fbo.texture;
        //this.the_transition.quad_material.uniforms.tDiffuse2.value = this.scene_old.fbo.texture;
        //

        // Prevent render both scenes when it's not necessary
        if (this.transition == 0 ) {
            //this.scene_b.render(delta, false);
            //this.renderer_manager.renderer.render()
            //this.renderer_manager.renderer.setClearColor(0xffffff);
            //this.renderer_manager.renderer.render(this.scene_old, this.current_camera);
        } else if (this.transition >= 1) {
            //this.scene_a.render(delta, false);
            //this.renderer_manager.renderer.setClearColor(0x111111);
            //this.renderer_manager.renderer.render(this.scene_new, this.previous_camera);

            this.renderer_manager.in_transition = false;
            this.renderer_manager.set_current_scene(this.scene_new, this.transition_finished_callback);
        } else {
            //this.renderer_manager.renderer.setClearColor(0xffffff);
            //this.renderer_manager.renderer.render(this.scene_old, this.current_camera, this.scene_old.fbo, true);
            //this.renderer_manager.renderer.readRenderTargetPixels(this.scene_old.fbo);

            //l(this.scene_old.fbo.texture);
            //this.renderer_manager.renderer.render(this.scene_old);
            this.renderer_manager.renderer.render(this.fake_scene, this.fake_camera);

            //this.renderer_manager.renderer.setClearColor(0x111111);
            this.renderer_manager.renderer.render(this.scene_new, this.previous_camera, this.scene_new.fbo, true);

            this.renderer_manager.renderer.render(this.scene, this.camera_ortho, null, true);
        }

        this.elapsed_delta += delta / 5;
    }
};

function WorldTransition() {
    this._the_transition = null;
    this.current_transition = null;
    this.in_transition = false;

    this.load_transition = function() {
        this._the_transition = new TheTransition();
    };

    this._transition_pairs = [];

    this._get_transition_pair = function(old_scene, new_scene) {
        for (let t = 0; t < this._transition_pairs.length; t++) {
            if (this._transition_pairs[t].is_pair(old_scene, new_scene)) {
                return this._transition_pairs[t];
            }
        }
        let new_transition_pair = new TransitionPair(old_scene, new_scene, this._the_transition, this);
        this._transition_pairs.push(new_transition_pair);
        return new_transition_pair;
    };

    this.set_current_world = function(current_world, previous_world, transition_finished_callback) {
        let previous_camera_position = CURRENT_PLAYER.get_position();
        let previous_camera_look_at  = CURRENT_PLAYER.get_direction();

        let previous_scene = previous_world.scene;
        // TEMPORARY TESTING.
        //previous_scene.background = COLOR_GREEN;
        //
        let current_scene  = current_world.scene;

        //this.camera_transition.position.set(previous_camera_position.x, previous_camera_position.y, previous_camera_position.z);
        //this.camera_transition.lookAt(previous_camera_position.x + previous_camera_look_at.x, previous_camera_position.y + previous_camera_look_at.y, previous_camera_position.z + previous_camera_look_at.z);

        //let renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false};
        //let renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true};
        let renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter};
        previous_scene.fbo = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);

        // TEMPORARY TESTING.
        //let previous_scene_as_texture = new THREE.Texture();

        current_scene.fbo  = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);

        this.in_transition = true;
        this.current_transition = this._get_transition_pair(previous_scene, current_scene);
        this.current_transition.set_size_if_needed(this.current_resize);
        this.current_transition.start(this.camera, this.camera_transition, transition_finished_callback);
    };

    this.transition_render = function(delta) {
        this.current_transition.render(delta);
    };

    // Only used once for displaying the initial login world.
    this.set_current_scene = function(scene, transition_finished_callback) {
        this.outline_glow.set_to_hover_color();
        this.outline_glow.remove_current_object();
        this.outline_glow.outline_pass.renderScene = scene;
        this.render_pass.scene = scene;
        if (is_defined(transition_finished_callback)) {
            transition_finished_callback();
        }
    };

}
