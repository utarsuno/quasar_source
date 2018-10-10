'use strict';

$_QE.prototype.DoublyLinkedListNode = function(object) {
    this._node_next = null;
    this._node_prev = null;
    this._position  = null;
    this._object    = object;

    this.clear = function() {
        this._object    = null;
        this._node_prev = null;
        this._node_next = null;
        this._position  = null;
    };

    this.is_positive = function() {
        return this._position > 0;
    };

    this.is_negative = function() {
        return this._position < 0;
    };
};
