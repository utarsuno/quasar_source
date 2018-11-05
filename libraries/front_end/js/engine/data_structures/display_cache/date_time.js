'use strict';

$_QE.prototype.DisplayDateTime = function(row_reference) {
    this.__init__(row_reference);
};

Object.assign($_QE.prototype.DisplayDateTime.prototype, $_QE.prototype.DisplayCache.prototype, {
    _value: null,

    set: function(v) {
        if (this._value != v) {
            this._value = v;
            this._value_string = v;
            this.row_reference.set_text(this._value_string);
        }
    },
});
