'use strict';

$_QE.prototype.DisplayCache     = function() {};
$_QE.prototype.DisplayCacheList = function() {};

Object.assign($_QE.prototype.DisplayCache.prototype, {
    //_value_string: '',
    //_has_update  : false,
    //row_reference: null,

    __init__: function(row_reference) {
        this._value_string= '';
        this._has_update  = false;
        this.row_reference = row_reference;
        return this;
    },

    //_update: function() {
    //    this.parent_object.set_row_contents(this.row, this._value_string, COLOR_CANVAS_GREEN);
    //    this._has_update = false;
    //},

    _update: function() {
        this._set_display();
        this.row_reference.set_text(this._value_string);
        this._has_update = false;
    },

    _check_for_update: function() {
        if (this._has_update) {
            //this.parent_object.set_row_contents(this.row, this._value_string, COLOR_CANVAS_GREEN);
            this._update();
        }
    },
});

Object.assign(
    $_QE.prototype.DisplayCacheList.prototype,
    $_QE.prototype.DisplayCache.prototype,
    {
        _set_value: function(position, v) {
            if (this._values[position] != v) {
                this._values[position] = v;
                this._has_update = true;
            }
        },
    }
);
