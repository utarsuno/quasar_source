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
    },

});