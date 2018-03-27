'use strict';

function FloatingRow(parent_wall, row_number, row_name) {
    this.__init__(parent_wall, row_number, row_name);
}

FloatingRow.prototype = {

    __init__: function(parent_wall, row_number, row_name) {
        this.parent_wall = parent_wall;
        this.world = this.parent_wall.world;
        this.row_number = row_number;
        this.row_name = row_name;
        this.elements = [];
    },

    // NEW FUNCTIONS.
    _get_width_needed: function(x_start_n_stop) {
        var total_percentage_of_parent_width = x_start_n_stop[1] - x_start_n_stop[0];
        var floating_element_width = this.parent_wall.width * total_percentage_of_parent_width;
        return (total_percentage_of_parent_width, floating_element_width);
    },

    //add_button: function(x_start_n_stop, text, color, function_to_bind) {
        //var button = this.add_2D_element(x_start_n_stop, text, TYPE_BUTTON, color);
        //button.set_engage_function(function_to_bind);
        //return button;
    //},

    add_icon: function(x_start_n_stop, icon_type) {
        var w = this._get_width_needed(x_start_n_stop);
        var floating_icon = new FloatingIcon(this.world, icon_type, w[1]);
        return this.add_element(x_start_n_stop, w[0], floating_icon);
    },

    add_text_3D: function(x_offset, text_size, text) {
        var floating_text_3D = new FloatingText3D(this.world, text_size, text);
        var total_percentage_of_parent_width = floating_text_3D.width / this.parent_wall.width;
        return this.add_element(x_offset, total_percentage_of_parent_width, floating_text_3D);
    },

    add_input_2D: function(x_start_n_stop, text_height, text) {
        if (!is_defined(text)) {
            text = '';
        }
        var w = this._get_width_needed(x_start_n_stop);
        var floating_input_2D = new FloatingInput2D(this.world, w[1], text_height, text);
        return this.add_element(x_start_n_stop, w[0], floating_input_2D);
    },

    add_text_2D: function(x_start_n_stop, text_height, text) {
        var w = this._get_width_needed(x_start_n_stop);
        var floating_text_2D = new FloatingText2D(this.world, w[1], text_height, text);
        return this.add_element(x_start_n_stop, w[0], floating_text_2D);
    },

    add_element: function(x_start_n_stop, total_percentage_of_parent_width, floating_element) {
        floating_element.set_attachment_depth_offset(1);
        floating_element.set_attachment_horizontal_offset(null, -HALF + x_start_n_stop[0] + total_percentage_of_parent_width / 2);
        floating_element.set_attachment_vertical_offset(-8 + -16 * this.row_number, HALF);

        floating_element.attach_to(this.parent_wall);

        this.elements.push(floating_element);
        return floating_element;
    },

    // OLDER FUNCTIONS BELOW.

    add_3D_element: function(text, type, color) {
        var floating_element = new Floating3DText(text, type, this.parent_wall.world);

        // TODO : Add ability to center later on.
        floating_element.set_attachment_horizontal_offset(null, -HALF);

        if (is_defined(color)) {
            floating_element.set_default_color(color);
            floating_element.set_color(color, true);
        }

        floating_element.set_attachment_vertical_offset(-32 * this.row_number, HALF);
        floating_element.attach_to(this.parent_wall);

        floating_element.add_tag(SAVE_TAG_3D_ROW);

        this.elements.push(floating_element);
        return floating_element;
    },

    add_2D_label_and_input: function(x_divide_mark, text, syntax_checks) {
        var label = this.add_2D_element([0, x_divide_mark], text, TYPE_CONSTANT);
        var input = this.add_2D_element([x_divide_mark, 1], '', TYPE_INPUT, null, syntax_checks);
        this.elements.push(label);
        this.elements.push(input);
        return [label, input];
    },

    add_2D_label_and_button: function(x_divide_mark, label_text, button_text, function_to_bind) {
        var label = this.add_2D_element([0, x_divide_mark], label_text, TYPE_CONSTANT);
        var button = this.add_2D_element([x_divide_mark, 1], button_text, TYPE_BUTTON);
        if (is_defined(function_to_bind)) {
            button.set_engage_function(function_to_bind);
        }
        this.elements.push(label);
        this.elements.push(button);
        return [label, button];
    },

    add_2D_element: function(x_start_n_stop, text, type, color, syntax_checks) {
        var total_percentage_of_parent_width = x_start_n_stop[1] - x_start_n_stop[0];
        var floating_element_width = this.parent_wall.width * total_percentage_of_parent_width;

        var floating_element = new Floating2DText(floating_element_width, text, type, this.parent_wall.world, syntax_checks);

        if (is_defined(color)) {
            floating_element.set_default_color(color);
            floating_element.set_color(color, true);
        }

        floating_element.set_attachment_depth_offset(1);
        floating_element.set_attachment_horizontal_offset(null, -HALF + x_start_n_stop[0] + total_percentage_of_parent_width / 2);

        // TODO : This should eventually be dynamic.
        floating_element.set_attachment_vertical_offset(-8 + -16 * this.row_number, HALF);

        floating_element.attach_to(this.parent_wall);

        this.elements.push(floating_element);
        return floating_element;
    },

    add_2D_button: function(x_start_n_stop, text, color, function_to_bind) {
        var button = this.add_2D_element(x_start_n_stop, text, TYPE_BUTTON, color);
        button.set_engage_function(function_to_bind);
        return button;
    },

    shift_up: function() {
        this.row_number -= 1;
        var objects_to_shift = this.get_all_elements_and_sub_attachments();
        for (var s = 0; s < objects_to_shift.length; s++) {
            objects_to_shift[s].apply_delta_to_vertical_offset(16, null);
        }
    },

    shift_down: function() {
        this.row_number += 1;
        var objects_to_shift = this.get_all_elements_and_sub_attachments();
        for (var s = 0; s < objects_to_shift.length; s++) {
            objects_to_shift[s].apply_delta_to_vertical_offset(-16, null);
        }
    },

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    has_element_with_tag: function(tag) {
        var all_elements = this.get_all_elements_and_sub_attachments();
        for (var e = 0; e < all_elements.length; e++) {
            if (all_elements[e].has_tag(tag)) {
                return true;
            }
        }
        return false;
    },

    get_3D_rows_save_data: function() {
        var save_data = '';
        for (var e = 0; e < this.elements.length; e++) {
            if (this.elements[e].has_tag(SAVE_TAG_3D_ROW)) {

                var element = this.elements[e];

                save_data += this.row_number + '+';
                save_data += element.get_text() + '+';
                save_data += element.get_type();
            }
        }
        if (save_data === '') {
            return NO_SAVE_DATA;
        }
        return save_data;
    },

    get_all_elements_with_tag: function(tag) {
        var elements = [];
        var all_elements = this.get_all_elements_and_sub_attachments();
        for (var e = 0; e < all_elements.length; e++) {
            if (all_elements[e].has_tag(tag)) {
                elements.push(all_elements[e]);
            }
        }
        return elements;
    },

    get_all_fields_of_type: function(type) {
        var fields = [];
        var all_elements = this.get_all_elements_and_sub_attachments();
        for (var e = 0; e < all_elements.length; e++) {
            if (is_defined(all_elements[e].type)) {
                if (all_elements[e].type === type) {
                    fields.push(all_elements[e]);
                }
            }
        }
        return fields;
    },

    get_all_elements_and_sub_attachments: function() {
        var all_objects = [];
        for (var e = 0; e < this.elements.length; e++) {
            all_objects.push(this.elements[e]);
            var all_sub_attachments = this.elements[e]._get_all_attachments_recursively();
            for (var a = 0; a < all_sub_attachments.length; a++) {
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
        var all_objects = this.get_all_elements_and_sub_attachments();
        for (var a = 0; a < all_objects.length; a++) {
            all_objects[a].fully_remove_self_and_all_sub_attachments();
        }
    }

};