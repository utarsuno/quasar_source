'use strict';

$_QE.prototype.LLNode = function(object) {
    this._object    = object;
    this._node_next = null;
    this._node_prev = null;
    this._position  = null;
};

Object.assign(
    $_QE.prototype.LLNode.prototype,
    {
        clear: function() {
            this._object    = null;
            this._node_prev = null;
            this._node_next = null;
            this._position  = null;
        },

        is_positive: function() {
            return this._position > 0;
        },

        is_negative: function() {
            return this._position < 0;
        },

        increment: function() {
            this.position += 1;
        },

        decrement: function() {
            this._position -= 1;
        },

        set_previous: function(node) {
            this._node_prev = node;
            node._node_next = this;
        },

        set_next: function(node) {
            this._node_next = node;
            node._node_prev = this;
        },

        same_position_as_previous: function() {
            return this._position == this._node_prev._position;
        },

        has_next: function() {
            return this._node_next != null;
        },

        has_previous: function() {
            return this._node_prev != null;
        },
    }
);
