'use strict';

//const _render_target_parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter};
const _render_target_parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, stencilBuffer: false};

function TransitionAffect(old_world, new_world, renderer_manager) {
    this.__init__(old_world, new_world, renderer_manager);
}

TransitionAffect.prototype = {

    __init__(old_world, new_world, renderer_manager) {
        this.renderer_manager = renderer_manager;
        this.old_world        = old_world;
        this.new_world        = new_world;

        this.fbo_previous     = new THREE.WebGLRenderTarget(this.renderer_manager.window_width, this.renderer_manager.window_height, _render_target_parameters);
        this.fbo_current      = new THREE.WebGLRenderTarget(this.renderer_manager.window_width, this.renderer_manager.window_height, _render_target_parameters);

        this.renderer_manager._transition_shader_material.set_texture_for_old_scene(this.fbo_previous.texture);
        this.renderer_manager._transition_shader_material.set_texture_for_new_scene(this.fbo_current.texture);
    },

    start: function(transition_finished_callback) {
        this.renderer_manager.in_transition = true;
        this.elapsed_delta = 0;
        //this.transition    = 0;

        this.transition_finished_callback = transition_finished_callback;

        this.scene = new THREE.Scene();
        this.camera_ortho = new THREE.OrthographicCamera(this.renderer_manager.window_width / -2, this.renderer_manager.window_width / 2, this.renderer_manager.window_height / 2, this.renderer_manager.window_height / -2, -10, 10);
        this.quad_geometry = new THREE.PlaneBufferGeometry(this.renderer_manager.window_width, this.renderer_manager.window_height);
        this.quad = new THREE.Mesh(this.quad_geometry, this.renderer_manager._transition_shader_material.get_shader_material());
        this.scene.add(this.quad);

        this.fake_camera = new THREE.Camera();
        this.fake_scene = new THREE.Scene();
        this.renderer_manager.renderer.autoClear = false;

        if (!is_defined(this.old_world)) {
            this.fake_scene.background = COLOR_BLACK;
        } else {
            this.renderer_manager.renderer.render(this.old_world.scene, this.renderer_manager._camera_transition, this.fbo_previous, true);
            this.fake_scene.background = this.fbo_previous;
        }
    },

    render: function(delta) {
        //var t = (1 + Math.sin(this.transition_speed * this.elapsed_delta / Math.PI)) / 2;
        //this.transition = THREE.Math.smoothstep(t, 0.4, 0.6);
        //this.transition = t;
        //this.transition = this.elapsed_delta;

        this.renderer_manager._transition_shader_material.set_mix_ratio(this.elapsed_delta);

        // Prevent render both scenes when it's not necessary
        if (this.elapsed_delta == 0 ) {
            this.renderer_manager.renderer.render(this.fake_scene, this.fake_camera);
        } else if (this.elapsed_delta >= 1) {
            this.renderer_manager.in_transition = false;
            this.renderer_manager.set_current_scene(this.new_world.scene, this.transition_finished_callback);
        } else {
            this.renderer_manager.renderer.render(this.fake_scene, this.fake_camera);

            //this.renderer_manager.renderer.setClearColor(0x111111);
            this.renderer_manager.renderer.render(this.new_world.scene, this.renderer_manager.camera, this.fbo_current, true);

            this.renderer_manager.renderer.render(this.scene, this.camera_ortho, null, true);
        }

        this.elapsed_delta += delta / 2.5;
    },

    clean_up: function() {
        this.quad_geometry.dispose();
        this.scene.remove(this.quad);
        //this.quad.dispose();
        this.quad_geometry = undefined;
        this.quad = undefined;

        if (is_defined(this.fbo_previous)) {
            //if (is_defined(this.fbo_previous.texture)) {
            //    this.fbo_previous.texture.dispose();
            //    this.fbo_previous.texture = undefined;
            //}
            this.fbo_previous.dispose();
            this.fbo_previous = undefined;
        }
        //this.fbo_current.texture.dispose();
        //this.fbo_current.texture = undefined;
        this.fbo_current.dispose();
        this.fbo_current = undefined;
    }

};

function WorldTransition() {
    this._transition_shader_material = null;
    this.in_transition               = false;
    this._current_transition         = null;
    this._camera_transition          = new THREE.PerspectiveCamera(this.field_of_view, this.aspect_ratio, this.near_clipping, this.far_clipping);

    this.load_transition_material = function() {
        this._transition_shader_material = MANAGER_SHADER.get_shader_material_abstraction(SHADER_MATERIAL_TRANSITION);
    };

    this.set_current_world = function(current_world, previous_world, transition_finished_callback, previous_position_and_look_at) {
        if (is_defined(previous_world)) {
            let p = previous_position_and_look_at[0];
            let l = previous_position_and_look_at[1];

            this._camera_transition.position.set(p.x, p.y, p.z);
            this._camera_transition.lookAt(p.x + l.x, p.y + l.y, p.z + l.z);
        }

        this._current_transition = new TransitionAffect(previous_world, current_world, this);
        this._current_transition.start(transition_finished_callback);
    };

    /*
    this.set_current_worldOLD = function(current_world, previous_world, transition_finished_callback, previous_position_and_look_at) {
        let previous_camera_position = CURRENT_PLAYER.get_position();
        let previous_camera_look_at  = CURRENT_PLAYER.get_direction();

        let previous_scene = previous_world.scene;
        let current_scene  = current_world.scene;

        this.camera_transition.position.set(previous_camera_position.x, previous_camera_position.y, previous_camera_position.z);
        this.camera_transition.lookAt(previous_camera_position.x + previous_camera_look_at.x, previous_camera_position.y + previous_camera_look_at.y, previous_camera_position.z + previous_camera_look_at.z);

        //
        this.current_transition = this._get_transition_pair(previous_scene, current_scene);
        this.current_transition.set_size_if_needed(this.current_resize);
        this.current_transition.start(this.camera, this.camera_transition, transition_finished_callback);
    };
    */

    // Only used once for displaying the initial login world.
    this.set_current_scene = function(scene, transition_finished_callback) {
        this.outline_glow.set_to_hover_color();
        this.outline_glow.remove_current_object();
        this.outline_glow.outline_pass.renderScene = scene;
        this.render_pass.scene = scene;

        this._current_transition.clean_up();
        this._current_transition = undefined;

        if (is_defined(transition_finished_callback)) {
            transition_finished_callback();
        }
    };

}
