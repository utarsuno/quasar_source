'use strict';

function Player() {
    this.__init__();
}

Player.prototype = {

    __init__: function() {
        this.fps_controls = new FPSControls();
        // Inherit.
        PlayerState.call(this);
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