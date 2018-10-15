'use strict';

$_QE.prototype.DisplayCacheFPS = function(parent_object, row) {
    this.row           = row;
    this.parent_object = parent_object;
};

Object.assign($_QE.prototype.DisplayCacheFPS.prototype, $_QE.prototype.DisplayCache.prototype, {
    _value: -1,
    set: function(v) {
        if (this._value != v) {
            this._value        = v;
            this._value_string = this._value.toString();
            this._update();
        }
    },
});
