$_QE.prototype.RendererSceneTransition = function() {
    this._render_target_parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter};
};

const _render_target_parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter};
//const _render_target_parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, stencilBuffer: false};

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

    start: function(transition_finished_callback, singleton_transition_function) {
        this.renderer_manager.in_transition = true;
        this.elapsed_delta = 0;
        //this.transition    = 0;

        this.transition_finished_callback = transition_finished_callback;

        this.scene = new THREE.Scene();

        this.camera_ortho = new THREE.OrthographicCamera(this.renderer_manager.window_width / -2, this.renderer_manager.window_width / 2, this.renderer_manager.window_height / 2, this.renderer_manager.window_height / -2, -10, 10);
        this.quad_geometry = new THREE.PlaneBufferGeometry(this.renderer_manager.window_width, this.renderer_manager.window_height);

        //this.camera_ortho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10);
        //this.quad_geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);

        this.quad = new THREE.Mesh(this.quad_geometry, this.renderer_manager._transition_shader_material.get_shader_material());
        this.scene.add(this.quad);

        this.fake_camera = new THREE.Camera();
        this.fake_scene = new THREE.Scene();

        this.renderer_manager.renderer.autoClear = false;
        //this.renderer_manager.renderer.render(this.old_world.scene, this.renderer_manager._camera_transition, this.fbo_previous, true);
        this.renderer_manager.renderer.render(this.old_world.scene, this.renderer_manager.camera, this.fbo_previous, true);
        this.fake_scene.background = this.fbo_previous;

        singleton_transition_function();
        MANAGER_AUDIO.play_sound(AUDIO_SOUND_TRANSITION);
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
            this.renderer_manager.renderer.render(this.new_world.scene, this.renderer_manager.camera);
            this.renderer_manager.set_current_scene(this.new_world.scene, this.transition_finished_callback);
        } else {
            this.renderer_manager.renderer.render(this.new_world.scene, this.renderer_manager.camera, this.fbo_current, true);
            this.renderer_manager.renderer.render(this.scene, this.camera_ortho, null, true);
        }

        //this.elapsed_delta += delta / 2.5;
        this.elapsed_delta += delta / 1.5;
    },

    clean_up: function() {
        this.quad_geometry.dispose();
        this.scene.remove(this.quad);
        //this.quad.dispose();

        this.quad_geometry = undefined;
        this.quad          = undefined;

        if (this.fbo_previous != null) {
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

        this._cache_transition_scene = new THREE.Scene();
        //this._cache_quad
    };

    this.set_current_world = function(current_world, previous_world, transition_finished_callback, previous_position_and_look_at, singleton_transition_function) {
        this._current_scene = current_world.scene;

        let p = previous_position_and_look_at[0];
        let l = previous_position_and_look_at[1];

        this._camera_transition.position.set(p.x, p.y, p.z);
        this._camera_transition.lookAt(p.x + l.x, p.y + l.y, p.z + l.z);

        this._current_transition = new TransitionAffect(previous_world, current_world, this);
        this._current_transition.start(transition_finished_callback, singleton_transition_function);
    };

    // Only used once for displaying the initial login world.
    this.set_current_scene = function(scene, transition_finished_callback) {
        this._current_scene = scene;

        this.outline_glow_set_state_hover();
        this.outline_glow_clear_target();
        this.outline_pass.renderScene = scene;
        this.render_pass.scene = scene;

        if (this._current_transition != null) {
            this._current_transition.clean_up();
            this._current_transition = undefined;
        }

        this.in_transition = false;
        this.renderer.autoClear = true;
        //this.renderer.setClearColor(0xEE00EE);

        if (transition_finished_callback != null) {
            transition_finished_callback();
        }
    };

}
