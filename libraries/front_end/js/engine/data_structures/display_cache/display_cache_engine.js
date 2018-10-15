'use strict';

$_QE.prototype.DisplayCacheEngine = function(parent_object, row, reference_info) {
    this.row            = row;
    this.reference_info = reference_info;
    this.parent_object  = parent_object;
};

Object.assign($_QE.prototype.DisplayCacheEngine.prototype, $_QE.prototype.DisplayCache.prototype, {
    _values: new Uint32Array(3),

    _set_position: function(position, v) {
        if (this._values[position] != v) {
            this._values[position] = v;
            this._has_update = true;
        }
    },

    set: function() {
        this._set_position(0, this.reference_info.memory.geometries);
        this._set_position(1, this.reference_info.memory.textures);
        this._set_position(2, this.reference_info.programs.length);
        if (this._has_update) {
            this._value_string = 'g: ' + this._values[0].toString() + ', t: ' + this._values[1].toString() + ', s: ' + this._values[2].toString();
            this._update();
        }
    },
});
