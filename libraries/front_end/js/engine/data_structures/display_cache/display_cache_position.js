'use strict';

$_QE.prototype.DisplayCachePosition = function(parent_object, row_reference) {
    this.__init__(row_reference);
    this.player = parent_object.engine.player;
};

Object.assign($_QE.prototype.DisplayCachePosition.prototype, $_QE.prototype.DisplayCacheList.prototype, {
    _values               : new Float32Array(3),
    _cache_player_position: new THREE.Vector3(0, 0, 0),

    _set_display: function() {
        this._value_string = '(' + this._values[0].toFixed(2) + ', ' + this._values[1].toFixed(2) + ', ' + this._values[2].toFixed(2) + ')';
    },

    set: function() {
        this.player.get_position(this._cache_player_position);
        this._set_value(0, this._cache_player_position.x);
        this._set_value(1, this._cache_player_position.y);
        this._set_value(2, this._cache_player_position.z);
        this._check_for_update();
    },
});
