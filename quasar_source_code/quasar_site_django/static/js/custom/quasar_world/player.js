'use strict';

function Player(renderer_api) {
    this.__init__(renderer_api);
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

    // Tracking keyboard keys.
    key_down_ctrl: null,
    key_down_d   : null,

    __init__: function(renderer_api) {
        this.renderer_api = renderer_api;
        this.camera = this.renderer_api.camera;

        this.fps_controls = new FPSControls(this.camera);
        this.pointer_lock_api = new PointerLockAPI(this.fps_controls);

        this.data_display = new DataDisplay(this.fps_controls);

        this.key_down_ctrl = false;
        this.key_down_d    = false;

        // Handle key down events.
        document.addEventListener('keydown', this.on_key_down.bind(this), false);
        // Handle key up events.
        document.addEventListener('keyup', this.on_key_up.bind(this), false);

        // Set player state.
        this.logged_in = false;
        this.engaged   = false;

        // Create the instance of WebSocketClient. This won't connect until the player logs in.
        this.web_socket_client = new WebSocketClient();

        this.owner_name = null;

        // TODO : move this state somewhere else
        this.currently_fullscreen = false;
    },

    send_chat_message: function(chat_message) {
        if (!is_defined(this.owner_name)) {
            this.owner_name = MANAGER_ENTITY.get_owner_entity().get_value('owner_username');
        }
        this.web_socket_client.send_chat_message(chat_message);
    },

    log_out: function() {
        // FOR_DEV_START
        l('LOG OUT HERE!!!!');
        // FOR_DEV_END

        MANAGER_ENTITY.clear_all();

        // TODO : Create generic functionality for worlds to handle when a player has logged out.
        MANAGER_WORLD.world_home.loaded_entities = false;

        this.owner = null;
        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);
        this.logged_in = false;
        // TODO : Notify the server that the player has logged out?
    },


    get_password: function() {
        return ENTITY_OWNER.get_password();
    },

    try_to_send_position_update_to_server: function() {
        var position = this.get_position();
        var position_string = '' + Math.round(position.x).toString() + ',' + Math.round(position.y).toString() + ',' + Math.round(position.z).toString();

        var position_was_different = false;
        var look_at_was_different = false;

        if (is_defined(this.previous_position_string)) {
            if (position_string !== this.previous_position_string) {
                position_was_different = true;
            }
        }
        this.previous_position_string = position_string;

        var look_at = this.fps_controls.get_direction();
        var look_at_string = look_at.x.toString() + ',' + look_at.y.toString() + ',' + look_at.z.toString();

        if (is_defined(this.previous_look_at_string)) {
            if (look_at_string !== this.previous_look_at_string) {
                look_at_was_different = true;
            }
        }
        this.previous_look_at_string = look_at_string;

        if (position_was_different && look_at_was_different) {
            this.web_socket_client.send_position_and_look_at_update(position_string, look_at_string);
        } else if (position_was_different) {
            this.web_socket_client.send_position_update(position_string);
        } else if (look_at_was_different) {
            this.web_socket_client.send_look_at_update(look_at_string);
        }
    },

    set_player_id: function(player_id) {
        l('Setting the player id to : ' + player_id);
        this.player_id = player_id;
        this.web_socket_client.connect(ENTITY_OWNER);
    },

    login: function(username, password) {
        ENTITY_OWNER = new EntityOwner(username, password);
        MANAGER_ENTITY.load_data(username, password);
        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_home);
        this.logged_in = true;
    },

    // TODO : consider holding the currently engaged object so that the player can send a disengage/engage message to it.

    enable_controls: function() {
        this.fps_controls.enable();
    },

    disengage: function() {
        //this.fps_controls.enable()
        if (this.engaged) {
            this.engaged = false;
        }
    },

    is_engaged: function() {
        return this.engaged;
    },

    engage_but_leave_controls_enabled: function() {
        this.engaged = true;
        this.fps_controls.enable();
    },

    engage: function() {
        this.engaged = true;
        this.fps_controls.disable();
    },

    update: function(delta) {
        this.fps_controls.physics(delta);
        this.data_display.update();

        if (is_defined(MANAGER_WORLD)) {
            if (MANAGER_WORLD.current_player_menu.is_visible()) {
                MANAGER_WORLD.current_player_menu.update(delta);
            }
        }
    },

    on_key_down: function(event) {
        switch(event.keyCode) {
        case KEY_CODE_CONTROL:
            this.key_down_ctrl = true;
            break;
        case KEY_CODE_D:
            this.key_down_d = true;
            if (this.key_down_ctrl) {
                // Toggle debugging.
                this.data_display.toggle();
                this.renderer_api.stats_api.toggle();
            }
            break;
        case KEY_CODE_F:
            // Toggle fullscreen.
            if (this.key_down_ctrl) {
                if (!this.currently_fullscreen) {
                    THREEx.FullScreen.request();
                    this.renderer_api.on_window_resize();
                } else {
                    THREEx.FullScreen.cancel();
                }
                this.currently_fullscreen = !this.currently_fullscreen;
            }
            //if (!this.is_engaged()) {
            //this.fps_controls.toggle_flying()
            //}
            break;
        case KEY_CODE_ENTER:
            if (GUI_TYPING_INTERFACE.is_visible()) {
                GUI_TYPING_INTERFACE.add_user_text();
                GUI_TYPING_INTERFACE.hide();
                this.disengage();
                this.fps_controls.enable();
            } else if (!this.is_engaged()) {
                if (!is_defined(MANAGER_WORLD.current_world.currently_looked_at_object)) {
                    if (!GUI_TYPING_INTERFACE.is_visible()) {
                        GUI_TYPING_INTERFACE.show();
                        this.engage();
                    }
                }
            }
            break;
        }

        // Check who should currently process events.

        if (GUI_TYPING_INTERFACE.is_visible()) {
            GUI_TYPING_INTERFACE.key_down_event(event);
        } else {
            MANAGER_WORLD.key_down_event(event);
        }
    },

    on_key_up: function(event) {
        switch(event.keyCode) {
        case KEY_CODE_CONTROL:
            this.key_down_ctrl = false;
            break;
        case KEY_CODE_D:
            this.key_down_d = false;
            break;
        }
    },

    get_position: function() {
        return this.fps_controls.get_position();
    },

    look_at: function(vector) {
        this.fps_controls.look_at(vector);
    },

    set_position_xyz: function(x, y, z) {
        this.fps_controls.yaw.position.set(x, y, z);
        //this.fps_controls.yaw.position.x = x;
        //this.fps_controls.yaw.position.y = y;
        //this.fps_controls.yaw.position.z = z;
    },

    set_position: function(vector) {
        this.fps_controls.yaw.position.x = vector.x;
        this.fps_controls.yaw.position.y = vector.y;
        this.fps_controls.yaw.position.z = vector.z;
    },

    get_direction: function() {
        return this.fps_controls.get_direction();
    },

    get_parametric_equation: function() {
        var position = this.get_position();
        var vector   = this.fps_controls.get_direction();
        return [[position.x, vector.x], [position.y, vector.y], [position.z, vector.z]];
    },

    get_parametric_value: function(t) {
        var position = this.get_position();
        var vector   = this.fps_controls.get_direction();
        return [position.x + vector.x * t, position.y + vector.y * t, position.z + vector.z * t];
    },

    /*___       __       ___         __            ___
     |__  |    /  \  /\   |  | |\ | / _`     |\/| |__  |\ | |  |
     |    |___ \__/ /~~\  |  | | \| \__>     |  | |___ | \| \__/ */

    turn_off_menu: function() {
        MANAGER_WORLD.current_player_menu.set_to_invisible();
    },

    turn_on_menu: function() {
        MANAGER_WORLD.current_player_menu.set_to_visible();
    }
};



