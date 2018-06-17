'use strict';

$_QE.prototype.Player = function() {
    $_QE.prototype.PlayerState.call(this);

};

function Player() {
    this.__init__();
}

Player.prototype = {

    __init__: function() {
        PlayerState.call(this);
        //this.fps_controls = new FPSControls();
        this.load_fps_controls();
        //l(this.fps_controls);
        // Inherit.
    },

    /*__            __     __   __
     |__) |__| \ / /__` | /  ` /__`
     |    |  |  |  .__/ | \__, .__/ */
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

    get_position: function() {
        return this.fps_controls.get_position();
    },

    get_direction: function() {
        return this.fps_controls.get_direction();
    }
};