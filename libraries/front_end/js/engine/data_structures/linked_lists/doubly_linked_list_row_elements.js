'use strict';

$_QE.prototype.DoublyLinkedListRowElements = function(parent_row) {
    this._parent_row = parent_row;

    $_QE.prototype.DoublyLinkedListBase.call(this, $_QE.prototype.DoublyLinkedListNodeRowElement);
    this._interactive_head   = null;
    this._interactive_tail   = null;
    this._length_interactive = 0;

    this.insert_element_at_position = function(element, position) {
        this.insert_node_at_position(this._cache_get(element), position);
    };

    this.add_relative_element = function(element, position, create, update_normal=false) {
        if (position < 0) {
            element.set_flag(EFLAG_FORMAT_X_START, true);
        } else if (position > 0) {
            element.set_flag(EFLAG_FORMAT_X_END, true);
        } else {
            element.set_flag(EFLAG_FORMAT_X_CENTER, true);
        }

        element._parent_row = this._parent_row;

        this._parent_row.parent_wall.add_attachment(element, create, update_normal);

        element.set_offset_vertical_percentage(this._parent_row.row_y_start, 0.5);
        element.set_flag(EFLAG_IS_ROW_ELEMENT, true);

        // Event handler must be set before inserting the node.
        element.set_event(ELEMENT_EVENT_ON_NODE_UPDATE, function(node) {
            node.update_horizontal_position();
        });

        this.insert_element_at_position(element, position);

        let self = this;
        element.set_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE, function() {
            //self._on_element_set_to_tab_target(element);
            self._on_element_set_to_tab_target.bind(self)(element);
        });

        return element;
    };

    this._set_node_tab_target = function(base_node, target_node) {

    };

    this._get_first_interactive_node_with_position_larger_than = function(position) {
        if (this._node_head == null) {
            return null;
        }
        let node = this._node_head;
        while (node != null) {
            if (node._position > position && node.is_interactive()) {
                return node;
            }
            node = node._node_next;
        }
        return null;
    };

    this._on_element_set_to_tab_target = function(element) {
        let node = this.get_node_from_object(element);
        let node_after;
        switch (this._length_interactive) {
        case 0:
            this._interactive_head = node;
            this._interactive_tail = node;
            break;
        case 1:
            if (this._interactive_head._position > node._position) {
                this._interactive_head.set_interactive_previous(node);
                this._interactive_head = node;
            } else {
                this._interactive_tail.set_interactive_next(node);
                this._interactive_tail = node;
            }
            break;
        default:
            node_after = this._get_first_interactive_node_with_position_larger_than(node._position);
            // Insert before head.
            if (this._interactive_head == node_after) {
                this._interactive_head.set_interactive_previous(node);
                this._interactive_head = node;
            } else {
                node.set_interactive_prev_and_next(node_after._interactive_prev, node_after);
            }
            break;
        }

        this._length_interactive += 1;
    };

    this.get_next_tab_target_from_current = function(element) {
        let node = this.get_node_from_object(element);
        return node._interactive_next;
    };
};
