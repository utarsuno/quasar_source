'use strict';

const CENTER_LEFT     = 1;
const CENTER_MIDDLE   = 2;
const CENTER_RIGHT    = 3;
const CENTER_ABSOLUTE = 4;

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

        this.row_hidden = false;
    },

    unhide_row: function() {
        this.row_hidden = false;
    },

    hide_row: function() {
        this.row_hidden = true;
    },

    display: function() {
        for (var e = 0; e < this.elements.length; e++) {
            this.elements[e].display_self_and_all_child_attachments_recursively();
        }
    },

    set_row_vertical_position: function(vertical_position_start) {
        for (var e = 0; e < this.elements.length; e++) {
            var element = this.elements[e];
            element.set_attachment_vertical_offset(vertical_position_start, HALF);
        }
    },

    get_height: function() {
        return this.elements[0].height;
    },

    _get_width_needed: function(x_params) {
        return this.parent_wall.width * (x_params[1] - x_params[0]);
    },

    add_button: function(x_params, text_height, text, engage_function, foreground_color, background_color) {
        var floating_button = new FloatingButton(this.world, this._get_width_needed(x_params), text_height, text, engage_function);
        return this._add_element(x_params, floating_button, foreground_color, background_color);
    },

    add_checkbox: function(x_params, size, checked, on_check_function) {
        var floating_checkbox = new FloatingCheckBox(this.world, size, checked, on_check_function);
        var end_x = x_params[0] + (size / this.parent_wall.width);
        var x_params2 = [x_params[0], end_x];
        return this._add_element(x_params2, floating_checkbox);
    },

    add_icon: function(x_params, icon_type) {
        var floating_icon = new FloatingIcon(this.world, icon_type, this._get_width_needed(x_params));
        return this._add_element(x_params, floating_icon);
    },

    add_icon_button: function(x_params, icon_type, engage_function) {
        var floating_icon = new FloatingIconButton(this.world, icon_type, this._get_width_needed(x_params), engage_function);
        x_params[0] -= 0.5 - ((floating_icon.width / this.parent_wall.width) / 2);
        return this.add_element(x_params, floating_icon);
    },

    add_text_3D: function(x_params, text_size, text) {
        var floating_text_3D = new FloatingText3D(this.world, text_size, text);
        x_params[0] -= 0.5;
        floating_text_3D.add_tag(SAVE_TAG_3D_ROW);
        return this.add_element(x_params, floating_text_3D);
    },

    add_text_2D: function(x_params, text_height, text, foreground_color, background_color) {
        var floating_text_2D = new FloatingText2D(this.world, text_height, text);
        return this._add_element([x_params[0], x_params[1], CENTER_LEFT], floating_text_2D, foreground_color, background_color);
    },

    add_input_3D: function(x_params, text_height, text) {
        var floating_input_3D = new FloatingInput3D(this.world, text_height, text);
        x_params[0] -= 0.5;
        floating_input_3D.add_tag(SAVE_TAG_3D_ROW);
        return this.add_element(x_params, floating_input_3D);
    },

    add_input_2D: function(x_params, text_height, text, foreground_color, background_color) {
        if (!is_defined(text)) {
            text = '';
        }
        var floating_input_2D = new FloatingInput2D(this.world, this._get_width_needed(x_params), text_height, text);
        return this._add_element(x_params, floating_input_2D, foreground_color, background_color);
    },

    _add_element: function(x_params, floating_element, foreground_color, background_color) {
        floating_element.set_attachment_depth_offset(1);
        if (is_defined(foreground_color)) {
            floating_element.set_foreground_color(foreground_color);
        }
        if (is_defined(background_color)) {
            floating_element.set_background_color(background_color);
        }
        //
        var centering = x_params[2];
        if (!is_defined(centering)) {
            centering = CENTER_ABSOLUTE;
        }
        // TEMP
        if (centering === false || centering === true) {
            centering = CENTER_ABSOLUTE;
        }

        switch(centering) {
        case CENTER_ABSOLUTE:
            floating_element.set_attachment_horizontal_offset(0, (x_params[0] + x_params[1]) / 2 - HALF);
            break;
        case CENTER_LEFT:
            var width_percentage = (floating_element.width / this.parent_wall.width) / 2;
            var alpha = -.5 / width_percentage;
            floating_element.set_attachment_horizontal_offset(0, width_percentage + alpha);
            break;
        case CENTER_MIDDLE:
            break;
        case CENTER_RIGHT:
            break;
        }
        //
        floating_element.set_attachment_vertical_offset(-8 + -16 * this.row_number, HALF);
        floating_element.attach_to(this.parent_wall);
        this.elements.push(floating_element);
        return floating_element;
    },

    add_element: function(x_params, floating_element, foreground_color, background_color) {
        floating_element.set_attachment_depth_offset(1);
        var x_start = x_params[0];
        if (is_defined(x_params[2])) {
            if (x_params[2]) {
                x_start -= (floating_element.width / this.parent_wall.width) / 2;
            }
        }

        floating_element.set_attachment_horizontal_offset(null, x_start);
        floating_element.set_attachment_vertical_offset(-8 + -16 * this.row_number, HALF);

        floating_element.attach_to(this.parent_wall);


        if (is_defined(foreground_color)) {
            floating_element.set_foreground_color(foreground_color);
        }
        if (is_defined(background_color)) {
            floating_element.set_background_color(background_color);
        }

        this.elements.push(floating_element);
        return floating_element;
    },

    // OLDER FUNCTIONS BELOW.

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
    get_element: function() {
        return this.elements[0];
    },

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
                save_data += element.needs_mobile_keyboard;
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