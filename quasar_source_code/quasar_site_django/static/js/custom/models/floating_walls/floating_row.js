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

    shift_down: function() {
        this.row_number += 1;
        // TODO : PERFROM VERTICAL SHIFT ON ALL ELEMENTS!
    }

};