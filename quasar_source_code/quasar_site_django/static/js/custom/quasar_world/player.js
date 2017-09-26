'use strict'

function Player(renderer_api) {
    this.__init__(renderer_api)
}

Player.prototype = {

    // Current state.
    mouse_locked    : null,

    // Custom state variables.
    logged_in       : null,
    engaged         : null, 

    // Three JS objects.
    camera          : null,

    // Custom objects.
    renderer_api    : null,
    pointer_lock_api: null,
    fps_controls    : null,
    data_display    : null,
    crosshair       : null,

    // Tracking keyboard keys.
    key_down_ctrl: null,
    key_down_d   : null,
    
    __init__: function(renderer_api) {
        this.renderer_api = renderer_api
        this.camera       = new THREE.PerspectiveCamera(this.renderer_api.field_of_view, this.renderer_api.aspect_ratio, this.renderer_api.near_clipping, this.renderer_api.far_clipping)
        this.renderer_api.camera = this.camera

        this.fps_controls = new FPSControls(this.camera)
        this.renderer_api.add_to_scene(this.fps_controls.get_object())
        this.pointer_lock_api = new PointerLockAPI(this.fps_controls)

        this.data_display = new DataDisplay(this.fps_controls)

        this.crosshair = new Crosshair(this.renderer_api.window_width / 2, this.renderer_api.window_height / 2)
        this.renderer_api.crosshair = this.crosshair

        this.key_down_ctrl = false
        this.key_down_d    = false
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)

        // Set player state.
        this.logged_in = false
        this.engaged   = false
    },

    disengage: function() {
        this.engaged = false
        this.fps_controls.enable()
    },

    is_engaged: function() {
        return this.engaged
    },

    engage: function() {
        this.engaged = true
        this.fps_controls.disable()
    },

    update: function(delta) {
        this.fps_controls.physics(delta)
        this.data_display.update()
    },

    on_key_down: function(event) {
        switch(event.keyCode) {
        case 17: // ctrl
            this.key_down_ctrl = true
            break
        case 68: // d
            this.key_down_d = true
            if (this.key_down_ctrl) {
                // Toggle debugging.
                this.data_display.toggle()
                this.renderer_api.stats_api.toggle()
            }
            break
        }
    },

    on_key_up: function(event) {
        switch(event.keyCode) {
        case 17: // ctrl
            this.key_down_ctrl = false
            break
        case 68: // d
            this.key_down_d = false
            break
        }
    },

    look_at: function(vector) {
        // TODO : Fix this so that it works.
        //this.fps_controls.yaw.lookAt(vector)
    },

    set_position: function(vector) {
        this.fps_controls.yaw.position.x = vector.x
        this.fps_controls.yaw.position.y = vector.y
        this.fps_controls.yaw.position.z = vector.z
    }

}



