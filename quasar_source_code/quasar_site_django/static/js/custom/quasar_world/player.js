'use strict'

function Player(renderer_api) {
    this.__init__(renderer_api)
}

Player.prototype = {

    // Entity owner.
    owner: null,

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
        MANAGER_WORLD.set_player(this)

        // Create the instance of WebSocketClient. This won't connect until the player logs in.
        this.web_socket_client = new WebSocketClient()
    },

    log_out: function() {
        l('LOG OUT HERE!!!!')

        MANAGER_ENTITY.clear_all()

        // TODO : Create generic functionality for worlds to handle when a player has logged out.
        MANAGER_WORLD.world_home.loaded_entities = false

        this.owner = null
        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login)
        this.logged_in = false
        // TODO : Notify the server that the player has logged out?
    },

    get_username: function() {
        return this.owner.username
    },

    get_password: function() {
        return this.owner.password
    },

    set_player_id: function(player_id) {
        l('Setting the player id to : ' + player_id)
        this.player_id = player_id
        this.web_socket_client.connect(this.player_id)
    },

    perform_login: function(username, password) {
        this.owner = new Owner(username, password, MANAGER_WORLD.world_home)
        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_home)
        this.logged_in = true
    },

    // TODO : consider holding the currently engaged object so that the player can send a disengage/engage message to it.

    enable_controls: function() {
        this.fps_controls.enable()
    },

    disengage: function() {
        //this.fps_controls.enable()
        if (this.engaged) {
            this.engaged = false
        }
    },

    is_engaged: function() {
        if (GUI_TYPING_INTERFACE.is_visible()) {
            return true
        }
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
            if (!this.is_engaged()) {
                //this.fps_controls.toggle_flying()
            }
            break
        case KEY_CODE_ENTER:
            if (GUI_TYPING_INTERFACE.is_visible()) {
                GUI_TYPING_INTERFACE.hide()
                this.disengage()
            }
            if (!this.is_engaged()) {
                if (!GUI_TYPING_INTERFACE.is_visible()) {
                    GUI_TYPING_INTERFACE.show()
                    this.engage()
                }
            }
            break
        }

        // Check who should currently process events.

        if (GUI_TYPING_INTERFACE.is_visible()) {
            GUI_TYPING_INTERFACE.key_down_event(event)
        } else {
            MANAGER_WORLD.key_down_event(event)
        }
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



