'use strict';

$_QE.prototype.DoublyLinkedListRows = function() {};

Object.assign($_QE.prototype.DoublyLinkedListRows.prototype, $_QE.prototype.DoublyLinkedListInteractive.prototype, {
    _node_class: $_QE.prototype.DoublyLinkedListNodeRow,

    add_row: function(row, interactive=false) {
        this.insert_element_at_position(row, this._length + 1);
        if (interactive) {
            this.on_element_set_to_interactive(row);
        }
    },

    ensure_row_is_interactive: function(row) {
        let node = this.get_node_from_object(row);
        if (!node.already_in_interactive_list) {
            node.already_in_interactive_list = true;
            this.on_node_set_to_interactive(node);
        }
    },

    get_next_tab_target_from_row_after: function(row) {
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

