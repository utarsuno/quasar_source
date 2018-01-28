'use strict';

function FloatingRow(parent_wall, row_number) {
    this.__init__(parent_wall, row_number);
}

FloatingRow.prototype = {

    __init__: function(parent_wall, row_number) {
        this.parent_wall = parent_wall;
        this.row_number = row_number;
        this.elements = [];
    },

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

        return floating_element;
    },

    add_2D_label_and_input: function(x_divide_mark, text, syntax_checks) {
    	var label = this.add_2D_element([0, x_divide_mark], text, TYPE_CONSTANT);
    	var input = this.add_2D_element([x_divide_mark, 1], '', TYPE_INPUT, syntax_checks);
    	input.set_engage_function(function_to_bind);
    	return [label, input];
    },

    add_2D_label_and_button: function(x_divide_mark, label_text, button_text, function_to_bind) {
    	var label = this.add_2D_element([0, x_divide_mark], text, TYPE_CONSTANT);
    	var button = this.add_2D_element([x_divide_mark, 1], '', TYPE_BUTTON, syntax_checks);
    	button.set_engage_function(function_to_bind);
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

        return floating_element;
    },

    add_2D_button: function(x_start_n_stop, text, color, function_to_bind) {
    	var button = this.add_2D_element(x_start_n_stop, text, TYPE_BUTTON, color);
    	button.set_engage_function(function_to_bind);
    	return button;
    },

    shift_down: function() {
        this.row_number += 1;
        // TODO : PERFROM VERTICAL SHIFT ON ALL ELEMENTS!
    }

};