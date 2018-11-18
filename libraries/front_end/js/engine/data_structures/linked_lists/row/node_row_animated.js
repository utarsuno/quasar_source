'use strict';

$_QE.prototype.LinkedListNodeRowAnimated = function(object) {
    this._object                     = object;
    this.already_in_interactive_list = false;
};

Object.assign(
    $_QE.prototype.LinkedListNodeRowAnimated.prototype,
    $_QE.prototype.LinkedListNodeRow.prototype,
    {
        _animate_row_step: function(time) {
            let n = this._node_head;
            while (n != null) {
                n._set_opacity(time);
                n._set_relative_y(time);
                n = n._node_next;
            }
        },

        _animate_set_nodes_opacity: function(opacity) {
            let n = this._node_head;
            while (n != null) {
                n._set_opacity(opacity);
                n = n._node_next;
            }
        },
    }
);
