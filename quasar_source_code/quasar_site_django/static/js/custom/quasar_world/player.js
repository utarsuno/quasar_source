'use strict'

function Player(renderer_api) {
    this.__init__(renderer_api)
}

Player.prototype = {

    // Entity owner.
    entity_owner: null,

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

    // Tracking keyboard keys.
    key_down_ctrl: null,
    key_down_d   : null,

    // Current status message.
    // TODO : Create a status message that will float in front of the player.

    __init__: function(renderer_api) {
        this.renderer_api = renderer_api
        this.camera = this.renderer_api.camera

        this.fps_controls = new FPSControls(this.camera)
        this.pointer_lock_api = new PointerLockAPI(this.fps_controls)

        this.data_display = new DataDisplay(this.fps_controls)

        this.key_down_ctrl = false
        this.key_down_d    = false

        // Handle key down events.
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        // Handle key up events.
        document.addEventListener('keyup', this.on_key_up.bind(this), false)

        // Set player state.
        this.logged_in = false
        this.engaged   = false

        // Give reference of self to the World Manager.
        WORLD_MANAGER.set_player(this)
    },

    sounds_loaded: function() {
        WORLD_MANAGER.add_to_all_scenes(AUDIO_MANAGER.get_typing_sound())
    },

    get_username: function() {
        return this.entity_owner.username
    },

    get_password: function() {
        return this.entity_owner.password
    },

    perform_login: function(username, password) {
        this.entity_owner = new Owner(username, password, WORLD_MANAGER.world_home)
        WORLD_MANAGER.set_current_world(WORLD_MANAGER.world_home)
    },

    // TODO : consider holding the currently engaged object so that the player can send a disengage/engage message to it.

    enable_controls: function() {
        this.fps_controls.enable()
    },

    disengage: function() {
        //this.fps_controls.enable()
        if (this.engaged) {
            this.engaged = false
            if (WORLD_MANAGER.current_world.currently_looked_at_object !== null) {
                if (WORLD_MANAGER.current_world.currently_looked_at_object.is_engaged()) {
                    WORLD_MANAGER.current_world.currently_looked_at_object.disengage(this.player)
                }
            }
        }
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
        case KEY_CODE_CONTROL:
            this.key_down_ctrl = true
            break
        case KEY_CODE_D:
            this.key_down_d = true
            if (this.key_down_ctrl) {
                // Toggle debugging.
                this.data_display.toggle()
                this.renderer_api.stats_api.toggle()
            }
            break
        case KEY_CODE_F:
            //this.fps_controls.toggle_flying()
            break
        }

        WORLD_MANAGER.key_down_event(event)
    },

    on_key_up: function(event) {
        switch(event.keyCode) {
        case KEY_CODE_CONTROL:
            this.key_down_ctrl = false
            break
        case KEY_CODE_D:
            this.key_down_d = false
            break
        }
    },

    get_position: function() {
        return this.fps_controls.get_position()
    },

    look_at: function(vector) {
        this.fps_controls.look_at(vector)
    },

    set_position: function(vector) {
        this.fps_controls.yaw.position.x = vector.x
        this.fps_controls.yaw.position.y = vector.y
        this.fps_controls.yaw.position.z = vector.z
    }

}



