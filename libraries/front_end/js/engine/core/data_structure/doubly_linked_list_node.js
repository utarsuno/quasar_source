'use strict';

$_QE.prototype.DoublyLinkedListNode = function(object) {
    this._node_next = null;
    this._node_prev = null;
    this._position  = null;
    this._object    = object;
};
