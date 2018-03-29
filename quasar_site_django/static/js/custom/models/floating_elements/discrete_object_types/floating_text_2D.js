'use strict';

function FloatingText2D(world, height, text, text_properties) {
    this.__init__(world, height, text, text_properties);
}

FloatingText2D.prototype = {

    __init__: function(world, height, text, text_properties) {

        var italic = false;
        var bold   = false;
        if (is_defined(text_properties)) {
            italic = text_properties[0];
            bold   = text_properties[1];
        }

        var width;
        if (italic && bold) {
            width = MANAGER_TEXT_2D.get_width_of_italic_and_bold_text_given_bounding_height(text, height);
        } else if (italic) {
            width = MANAGER_TEXT_2D.get_width_of_italic_text_given_bounding_height(text, height);
        } else if (bold) {
            width = MANAGER_TEXT_2D.get_width_of_bold_text_given_bounding_height(text, height);
        } else {
            width = MANAGER_TEXT_2D.get_width_of_text_given_bounding_height(text, height);
        }

        // Inherit.
        Text2D.call(this, world, width, height, text, text_properties);

        this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

        //this.maintain_engage_when_tabbed_to = false;
        //this.engable = false;

        this.initialize();
    }

};