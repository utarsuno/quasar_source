'use strict';

$_QE.prototype.DisplayCacheEngine = function(parent_object, row_reference) {
    this.__init__(row_reference);
    this.reference_info = parent_object.engine.renderer.info;
};

Object.assign($_QE.prototype.DisplayCacheEngine.prototype, $_QE.prototype.DisplayCacheList.prototype, {
    _values: new Uint32Array(3),

    _set_display: function() {
        this._value_string = 'g: ' + this._values[0].toString() + ', t: ' + this._values[1].toString() + ', s: ' + this._values[2].toString();
    },

    set: function() {
        this._set_value(0, this.reference_info.memory.geometries);
        this._set_value(1, this.reference_info.memory.textures);
        this._set_value(2, this.reference_info.programs.length);
        this._check_for_update();
    },
});
