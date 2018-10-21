'use strict';

$_QE.prototype.DisplayCacheFPS = function(row_reference) {
    this.__init__(row_reference);
};

Object.assign($_QE.prototype.DisplayCacheFPS.prototype, $_QE.prototype.DisplayCache.prototype, {
    _value: -1,

    set: function(v) {
        if (this._value != v) {
            this._value        = v;
            this._value_string = this._value.toString();
            this.row_reference.set_text(this._value_string);
        }
    },
});
