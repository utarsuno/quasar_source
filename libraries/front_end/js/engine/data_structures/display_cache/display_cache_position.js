'use strict';

$_QE.prototype.DisplayCachePosition = function(parent_object, row, player) {
    this.row           = row;
    this.player        = player;
    this.parent_object = parent_object;
};

Object.assign($_QE.prototype.DisplayCachePosition.prototype, $_QE.prototype.DisplayCache.prototype, {
    _values               : new Float32Array(3),
    _cache_player_position: new THREE.Vector3(0, 0, 0),

    _set_position: function(position, v) {
        if (this._values[position] != v) {
            this._values[position] = v;
            this._has_update = true;
        }
    },

    set: function() {
        this.player.get_position(this._cache_player_position);
        this._set_position(0, this._cache_player_position.x);
        this._set_position(1, this._cache_player_position.y);
        this._set_position(2, this._cache_player_position.z);
        if (this._has_update) {
            this._value_string = '(' + this._values[0].toFixed(2) + ', ' + this._values[1].toFixed(2) + ', ' + this._values[2].toFixed(2) + ')';
            this._update();
        }
    },
});
