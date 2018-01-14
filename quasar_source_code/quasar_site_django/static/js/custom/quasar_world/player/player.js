'use strict';

function Player() {
    this.__init__();
}

Player.prototype = {
    // Custom state variables.
    logged_in       : null,
    engaged         : null, 

    // Three JS objects.
    camera          : null,

    // Custom objects.
    pointer_lock_api: null,
    fps_controls    : null,
    data_display    : null,

    __init__: function() {
        this.fps_controls = new FPSControls();

        // Set player state.
        this.logged_in = false;
        this.engaged   = false;

        // Create the instance of WebSocketClient. This won't connect until the player logs in.
        this.web_socket_client = new WebSocketClient();
    },

    send_chat_message: function(chat_message) {
        this.web_socket_client.send_chat_message(chat_message);
    },

    log_out: function() {
        // TODO : Log out needs to be updated to be fully functional and bug free.

        // FOR_DEV_START
        l('LOG OUT needs to be updated!');
        // FOR_DEV_END

        MANAGER_ENTITY.clear_all();

        // TODO : Create generic functionality for worlds to handle when a player has logged out.
        MANAGER_WORLD.world_home.loaded_entities = false;

        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);
        this.logged_in = false;
        // TODO : Notify the server that the player has logged out?
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

    // TODO : Update multi-player.
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

    engage: function() {
        this.engaged = true;
        this.fps_controls.disable();
    },

    update: function(delta) {
        this.fps_controls.physics(delta);
    },

    get_position: function() {
        return this.fps_controls.get_position();
    },

    look_at: function(vector) {
        this.fps_controls.look_at(vector);
    },

    set_position_xyz: function(x, y, z) {
        this.fps_controls.yaw.position.set(x, y, z);
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
    }
};