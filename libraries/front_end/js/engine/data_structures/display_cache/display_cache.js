'use strict';

$_QE.prototype.DisplayCache = function() {};

Object.assign($_QE.prototype.DisplayCache.prototype, {
    _value_string: '',
    _has_update  : false,

    _update: function() {
        this.parent_object.set_row_contents(this.row, this._value_string, COLOR_CANVAS_GREEN);
        this._has_update = false;
    },
});
