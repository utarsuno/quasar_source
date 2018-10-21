'use strict';

// 1024 * 2014
const _TO_MB_VALUE                = 1048576; // #pre-process_global_constant
// Math.ceil(0.01 * _TO_MB_VALUE)
const _JUST_NOTICEABLE_DIFFERENCE = 10486;   // #pre-process_global_constant

$_QE.prototype.DisplayCacheMemory = function(row_reference) {
    this.__init__(row_reference);
};

Object.assign($_QE.prototype.DisplayCacheMemory.prototype, $_QE.prototype.DisplayCache.prototype, {
    _values               : new Uint32Array(2),
    _displays             : new Float32Array(2),
    _reference_performance: window.performance,

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
