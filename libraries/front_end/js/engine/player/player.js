'use strict';

$_QE.prototype.Player = function(engine) {
    this.engine     = engine;
    this._cache[10] = 27.5;
    this._cache[11] = 19.445436482630058;
    this._cache[12] = 0.025;
    // Somewhat the formula:  1.0 - this._decay;
    this._cache[13] = 0.55;
};

Object.assign($_QE.prototype.Player.prototype, {

    // The first 9 values are used for the mouse.
    // Last 1 value is used for movement.
    _cache: new Float64Array(14),

    initialize_player_controls: function() {
        this.pitch.add(this.engine.camera);
        this.yaw.add(this.pitch);

        this._initialize_flashlight();
    },

    set_in_front_of_object: function(element, distance) {
        // Temporary.
        let p = element.get_world_position();
        let n = element.get_normal();
        this.set_position_xyz(
            p.x + n.x * distance,
            p.y + n.y * distance,
            p.z + n.z * distance
        );
        this.look_at(p);
    },

    set_object_in_front_of: function(element, distance) {
        element.set_position(
            this.yaw.position.x + this._cache_normal.x * distance,
            this.yaw.position.y,
            this.yaw.position.z + this._cache_normal.z * distance
        );
        element.update_element();
        element.look_at(
            this.yaw.position.x,
            this.yaw.position.y,
            this.yaw.position.z
        );
        element.update_element();
    },

});
