'use strict';

function Player() {
    this.__init__();
}

Player.prototype = {
    // Custom state variables.
    engaged         : null,

    // Custom objects.
    fps_controls    : null,

    __init__: function() {
        this.fps_controls = new FPSControls();

        // Inherit.
        PlayerState.call(this);

        // Create the instance of WebSocketClient. This won't connect until the player logs in.
        this.web_socket_client = new WebSocketClient();
    },

    send_chat_message: function(chat_message) {
        this.web_socket_client.send_chat_message(chat_message);
    },

    update: function(delta) {
        this.fps_controls.physics(delta);
    },

    /*__            __     __   __
     |__) |__| \ / /__` | /  ` /__`
     |    |  |  |  .__/ | \__, .__/ */
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
    }
};