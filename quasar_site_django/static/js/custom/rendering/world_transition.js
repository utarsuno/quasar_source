'use strict';

function TransitionPair(old_scene, new_scene, the_transition, renderer_manager) {
    this.__init__(old_scene, new_scene, the_transition, renderer_manager);
}

function WorldTransition() {
    this._the_transition = null;
    this.in_transition = false;

    this.load_transition_material = function() {
        this._the_transition = new TheTransition();
    };

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

    this.set_current_world = function(current_world, previous_world, transition_finished_callback, previous_position_and_look_at) {
        let previous_camera_position = CURRENT_PLAYER.get_position();
        let previous_camera_look_at  = CURRENT_PLAYER.get_direction();

        let previous_scene = previous_world.scene;
        let current_scene  = current_world.scene;

        this.camera_transition.position.set(previous_camera_position.x, previous_camera_position.y, previous_camera_position.z);
        this.camera_transition.lookAt(previous_camera_position.x + previous_camera_look_at.x, previous_camera_position.y + previous_camera_look_at.y, previous_camera_position.z + previous_camera_look_at.z);

        //let renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false};
        //let renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true};
        let renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter};
        previous_scene.fbo = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);

        // TEMPORARY TESTING.
        //let previous_scene_as_texture = new THREE.Texture();

        current_scene.fbo  = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);

        this.in_transition = true;



        //
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
