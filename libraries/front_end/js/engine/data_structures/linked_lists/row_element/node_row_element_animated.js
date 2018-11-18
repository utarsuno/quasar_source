'use strict';

$_QE.prototype.LinkedListNodeRowElementAnimated = function(object) {
    this._object = object;
};

Object.assign(
    $_QE.prototype.LinkedListNodeRowElementAnimated.prototype,
    $_QE.prototype.LinkedListNodeRowElement.prototype,
    {
        _get_relative_y: function() {
            return this._object.get_object().position.y;
        },

        _set_opacity: function(o) {
            this._object.set_opacity(o);
        },

        _reset_relative_y: function() {
            this._object.get_object().position.y = this._animation_y_end;
            this._object.refresh();
        },

        _set_relative_y: function(time) {
            this._object.get_object().position.y = THREE.Math.lerp(this._animation_y_start, this._animation_y_end, time);
            //this._object.get_object().position.y = y;
            // TEMPORARY.
            this._object.refresh();
        },
    }
);
