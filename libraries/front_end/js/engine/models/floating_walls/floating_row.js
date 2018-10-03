'use strict';

function FloatingRow(parent_wall, row_number, row_name) {
    this.__init__(parent_wall, row_number, row_name);
}

FloatingRow.prototype = {

    __init__: function(parent_wall, row_number, row_name) {
        this.world = this.parent_wall.world;
        this.row_number = row_number;
        this.row_name = row_name;
        this.elements = [];
    },

    add_checkbox: function(x_params, size, checked, on_check_function) {
        let floating_checkbox = new FloatingCheckBox(this.world, size, checked, on_check_function);
        this._set_tab_target(floating_checkbox);
        let end_x = x_params[0] + (size / this.parent_wall.width);
        let x_params2 = [x_params[0], end_x];
        return this._add_element(x_params2, floating_checkbox);
    },

    add_input_3D: function(x_params, text_height, text) {
        let floating_input_3D = new FloatingInput3D(this.world, text_height, text);
        this._set_tab_target(floating_input_3D);
        x_params[0] -= 0.5;
        floating_input_3D.add_tag(SAVE_TAG_3D_ROW);
        return this.add_element(x_params, floating_input_3D);
    },

    _set_tab_target: function(element) {
        if (this.parent_wall._first_tab_target === null) {
            this.parent_wall._first_tab_target = element;
            this.parent_wall._previous_tab_target = element;

            // If the world currently has no default tab target the first tab-able object will be set to it.
            if (this.parent_wall.world._default_tab_target === null) {
                this.parent_wall.world._default_tab_target = element;
            }

        } else {
            this.parent_wall._previous_tab_target.next_tab_target = element;
            this.parent_wall._previous_tab_target = element;
        }
        element.tab_parent = this.parent_wall._first_tab_target;
    },

    _add_element: function(x_params, floating_element, foreground_color, background_color) {
        floating_element.attach_to(this.parent_wall);
        this.elements.push(floating_element);
        return floating_element;
    },

    // OLDER FUNCTIONS BELOW.

    shift_up: function() {
        this.row_number -= 1;
        let objects_to_shift = this.get_all_elements_and_sub_attachments();
        let s;
        for (s = 0; s < objects_to_shift.length; s++) {
            objects_to_shift[s].apply_delta_to_vertical_offset(16, null);
        }
    },

    shift_down: function() {
        this.row_number += 1;
        let objects_to_shift = this.get_all_elements_and_sub_attachments();
        let s;
        for (s = 0; s < objects_to_shift.length; s++) {
            objects_to_shift[s].apply_delta_to_vertical_offset(-16, null);
        }
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */

    get_3D_rows_save_data: function() {
        let save_data = '';
        let e;
        for (e = 0; e < this.elements.length; e++) {
            if (this.elements[e].has_tag(SAVE_TAG_3D_ROW)) {
                let element = this.elements[e];
                save_data += this.row_number + '+';
                save_data += element.get_text() + '+';
                save_data += element.needs_mobile_keyboard;
            }
        }
        if (save_data === '') {
            return NO_SAVE_DATA;
        }
        return save_data;
    },

    get_all_elements_with_tag: function(tag) {
        let elements = [];
        let all_elements = this.get_all_elements_and_sub_attachments();
        let e;
        for (e = 0; e < all_elements.length; e++) {
            if (all_elements[e].has_tag(tag)) {
                elements.push(all_elements[e]);
            }
        }
        return elements;
    },

    get_all_elements_and_sub_attachments: function() {
        let all_objects = [];
        let e;
        for (e = 0; e < this.elements.length; e++) {
            all_objects.push(this.elements[e]);
            let all_sub_attachments = this.elements[e]._get_all_attachments_recursively();
            let a;
            for (a = 0; a < all_sub_attachments.length; a++) {
                if (all_objects.indexOf(all_sub_attachments[a]) === NOT_FOUND) {
                    all_objects.push(all_sub_attachments[a]);
                }
            }
        }
        return all_objects;
    },

    /*__   ___       ___ ___    __
     |  \ |__  |    |__   |  | /  \ |\ |
     |__/ |___ |___ |___  |  | \__/ | \| */
    delete_all_elements: function() {
        let all_objects = this.get_all_elements_and_sub_attachments();
        let a;
        for (a = 0; a < all_objects.length; a++) {
            all_objects[a].fully_remove_self_and_all_sub_attachments();
        }
    }

};