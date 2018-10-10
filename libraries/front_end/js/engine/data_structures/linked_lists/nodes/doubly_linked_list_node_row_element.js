'use strict';

$_QE.prototype.DoublyLinkedListNodeRowElement = function(object) {
    $_QE.prototype.DoublyLinkedListNode.call(this, object);
    this._interactive_next = null;
    this._interactive_prev = null;

    this.update_horizontal_position = function() {
        if (this._object.get_flag(EFLAG_FORMAT_X_END)) {
            if (this._node_prev != null) {
                let delta = -1 * (this._object._parent_row.elements.get_number_of_positive_elements() - this._position);
                //this._object.set_offset_horizontal_percentage(1, -0.5, this._node_prev._object.horizontal_offsets[2] - this._node_prev._object.width);
                this._object.set_offset_horizontal_percentage(1, -0.5, this._object.width * delta);
            } else {
                this._object.set_offset_horizontal_percentage(1, -0.5);
                //this._object.set_offset_horizontal_percentage(1, 0);
            }
        } else if (this._object.get_flag(EFLAG_FORMAT_X_START)) {
            if (this._node_prev != null) {
                this._object.set_offset_horizontal_percentage(0, 0.5, this._node_prev._object.horizontal_offsets[2] + this._node_prev._object.width);
                //this._object.set_offset_horizontal_percentage(0, 0.0, this._node_prev._object.horizontal_offsets[2] + this._node_prev._object.width);
            } else {
                this._object.set_offset_horizontal_percentage(0, 0.5);
                //this._object.set_offset_horizontal_percentage(0, 0.0);
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

};
