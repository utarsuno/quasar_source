'use strict';

$_QE.prototype.LinkedListRowElements = function() {};

Object.assign(
    $_QE.prototype.LinkedListRowElements.prototype,
    $_QE.prototype.LinkedListInteractive.prototype,
    {
        add_raw_element_interactive: function(element, position) {
            element.flag_set_on(EFLAG_IS_ROW_ELEMENT);
            element._parent_row = this;
            this.insert_element_at_position(element, position);
            this.on_element_set_to_interactive(element);
        },

        add_relative_element: function(element, position, create, update_normal=false) {
            if (position < 0) {
                element.flag_set_on(EFLAG_IS_FORMAT_X_START);
            } else if (position > 0) {
                element.flag_set_on(EFLAG_IS_FORMAT_X_END);
            } else {
                element.flag_set_on(EFLAG_IS_FORMAT_X_CENTER);
            }

            element._parent_row = this;

            this.parent_wall.add_attachment(element, create, update_normal);

            // TODO: This check should only be in the DEV/QA version.
            if (this.row_y_start == null || isNaN(this.row_y_start)) {
                l('ERROR. row_y_start IS BAD!');
                l(this.row_y_start);
            }

            element.set_offset_vertical(this.row_y_start, 0.5);
            element.flag_set_on(EFLAG_IS_ROW_ELEMENT);

            element.set_event(ELEMENT_EVENT_ON_NODE_UPDATE, function(node) {
                node.update_horizontal_position();
            });

            this.insert_element_at_position(element, position);

            // Check if the element is already interactive.
            if (element.flag_is_on(EFLAG_IS_INTERACTIVE)) {
                this._on_element_set_to_tab_target(element);
            } else {
                let self = this;
                element.set_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE, function() {
                    self._on_element_set_to_tab_target.bind(self)(element);
                });
            }

            return element;
        },

        _on_element_set_to_tab_target: function(element) {
            this.on_element_set_to_interactive(element);
            this.parent_wall.ensure_row_is_interactive(this);
        },

        get_next_tab_target_from_element: function(element) {
            let node = this.get_node_from_object(element);
            if (node._interactive_next != null) {
                return node._interactive_next._object;
            }
            return this.parent_wall.get_next_tab_target_from_row_after(this);
        },

    }
);

