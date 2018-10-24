'use strict';

$_QE.prototype.DisplayDateTime = function(row_reference) {
    this.__init__(row_reference);
};

Object.assign($_QE.prototype.DisplayDateTime.prototype, $_QE.prototype.DisplayCache.prototype, {
    _value: null,

    _set_value: function(position, v) {
        if (this._values[position] < v && v - this._values[position] > _JUST_NOTICEABLE_DIFFERENCE) {
            this._values[position]   = v;
            this._displays[position] = this._values[position] / _TO_MB_VALUE;
            this._has_update         = true;
        } else if (this._values[position] > v && this._values[position] - v > _JUST_NOTICEABLE_DIFFERENCE) {
            this._values[position]   = v;
            this._displays[position] = this._values[position] / _TO_MB_VALUE;
            this._has_update         = true;
        }
    },

    _set_display: function() {
        this._value_string = '[' + this._displays[0].toFixed(2) + '/' + this._displays[1].toFixed(2) + ']';
    },

    set: function() {
        this._set_value(0, this._reference_performance.memory.usedJSHeapSize);
        this._set_value(1, this._reference_performance.memory.totalJSHeapSize);
        this._check_for_update();
    },
});
