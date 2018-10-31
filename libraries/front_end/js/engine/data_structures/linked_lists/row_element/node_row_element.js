'use strict';

$_QE.prototype.DoublyLinkedListNodeRowElement = function(object) {
    this._object = object;
};

Object.assign($_QE.prototype.DoublyLinkedListNodeRowElement.prototype, $_QE.prototype.DoublyLinkedListNodeInteractive.prototype, {

    update_horizontal_position: function() {
        if (this._object.get_flag(EFLAG_FORMAT_X_END)) {
            if (this._node_next != null) {
                l(this._node_next._object.width);
                this._object.set_offset_horizontal(1, -0.5, this._node_next._object.position_offsets[2] - this._node_next._object.width);
            } else {
                this._object.set_offset_horizontal(1, -0.5);
            }
        } else if (this._object.get_flag(EFLAG_FORMAT_X_START)) {
            if (this._node_prev != null) {
                l(this._node_prev._object.width);
                this._object.set_offset_horizontal(0, 0.5, this._node_prev._object.position_offsets[2] + this._node_prev._object.width);
            } else {
                this._object.set_offset_horizontal(0, 0.5);
            }
        } else {
            this._object.set_offset_horizontal(0.5, -.5);
        }
    },

    is_interactive: function() {
        return this._object.get_flag(EFLAG_INTERACTIVE);
    },

    update_node: function() {
        this._object.trigger_event(ELEMENT_EVENT_ON_NODE_UPDATE, this);
    },

    increment_and_update: function() {
        this.increment();
        this.update_node();
    },

    decrement_and_update: function() {
        this.decrement();
        this.update_node();
    },
});
