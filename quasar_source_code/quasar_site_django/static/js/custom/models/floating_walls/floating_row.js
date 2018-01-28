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

    shift_down: function() {
        this.row_number += 1;
        // TODO : PERFROM VERTICAL SHIFT ON ALL ELEMENTS!
    }

};