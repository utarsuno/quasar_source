'use strict';

$_QE.prototype.DoublyLinkedListRows = function(parent_wall) {
    this._parent_wall = parent_wall;
};

Object.assign($_QE.prototype.DoublyLinkedListRows.prototype, $_QE.prototype.DoublyLinkedListInteractive.prototype, {
    _node_class: $_QE.prototype.DoublyLinkedListNodeRow,

    ensure_row_is_interactive: function(row) {
        let node = this.get_node_from_object(row);
        if (!node.already_in_interactive_list) {
            node.already_in_interactive_list = true;
            this.on_node_set_to_interactive(node);
        }
    },

    get_next_tab_target_past_row: function(row) {
        let node = this.get_node_from_object(row);
        if (node._interactive_next != null) {
            return node._interactive_next.get_first_interactive_element();
        } else {
            if (this._interactive_head != node) {
                return this._interactive_head.get_first_interactive_element();
            }
            l('returning null??!!!');
            return null;
        }
    },

    get_first_tab_target: function() {
        if (this._length_interactive == 0) {
            return null;
        }
        return this._interactive_head.get_first_interactive_element();
    },

});

