'use strict';

$_QE.prototype.DoublyLinkedListNodeRowElement = function(object) {
    $_QE.prototype.DoublyLinkedListNode.call(this, object);
    this._interactive_next = null;
    this._interactive_prev = null;

    this.update_horizontal_position = function() {
        if (this._object.get_flag(EFLAG_FORMAT_X_END)) {
            if (this._node_next != null) {
                this._object.set_offset_horizontal_percentage(1, -0.5, this._node_next._object.horizontal_offsets[2] - this._node_next._object.width);
            } else {
                this._object.set_offset_horizontal_percentage(1, -0.5);
            }
        } else if (this._object.get_flag(EFLAG_FORMAT_X_START)) {
            if (this._node_prev != null) {
                this._object.set_offset_horizontal_percentage(0, 0.5, this._node_prev._object.horizontal_offsets[2] + this._node_prev._object.width);
            } else {
                this._object.set_offset_horizontal_percentage(0, 0.5);
            }
        } else {
            this._object.set_offset_horizontal_percentage(0.5, -.5);
        }
    };

    this.is_interactive = function() {
        return this._object.get_flag(EFLAG_INTERACTIVE);
    };

    this.update_node = function() {
        this._object.trigger_event(ELEMENT_EVENT_ON_NODE_UPDATE, this);
    };

    this.increment_and_update = function() {
        this.increment();
        this.update_node();
    };

    this.decrement_and_update = function() {
        this.decrement();
        this.update_node();
    };

    this.same_position_as_previous = function() {
        return this._position == this._node_prev._position;
    };

    this.set_previous = function(node) {
        this._node_prev = node;
        node._node_next = this;
    };

    this.set_next = function(node) {
        this._node_next = node;
        node._node_prev = this;
    };

    this.set_interactive_next = function(node) {
        this._interactive_next = node;
        node._interactive_prev = this;
    };

    this.set_interactive_previous = function(node) {
        this._interactive_prev = node;
        node._interactive_next = this;
    };

    this.set_interactive_prev_and_next = function(node_prev, node_next) {
        node_prev._interactive_next = this;
        this._interactive_prev      = node_prev;
        node_next._interactive_prev = this;
        this._interactive_next      = node_next;
    };

    this.has_next = function() {
        return this._node_next != null;
    };

    this.has_previous = function() {
        return this._node_prev != null;
    };

};
