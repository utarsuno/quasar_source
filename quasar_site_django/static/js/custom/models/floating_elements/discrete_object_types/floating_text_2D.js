'use strict';

function FloatingText2D(world, height, text, text_properties, fixed_width) {
    this.__init__(world, height, text, text_properties, fixed_width);
}

FloatingText2D.prototype = {

    __init__: function(world, height, text, text_properties, fixed_width) {

        let italic = false;
        let bold   = false;
        if (is_defined(text_properties)) {
            italic = text_properties[0];
            bold   = text_properties[1];
        }

        let width;
        if (!is_defined(fixed_width)) {
            /*
            if (italic && bold) {
                width = MANAGER_TEXT_2D.get_width_of_italic_and_bold_text_given_bounding_height(text, height);
            } else if (italic) {
                width = MANAGER_TEXT_2D.get_width_of_italic_text_given_bounding_height(text, height);
            } else if (bold) {
                width = MANAGER_TEXT_2D.get_width_of_bold_text_given_bounding_height(text, height);
            } else {
                width = MANAGER_TEXT_2D.get_width_of_text_given_bounding_height(text, height);
            }
            */
            width = 120;
        } else {
            this._fixed_width = true;
            width = fixed_width;
        }

        // Inherit.
        Text2D.call(this, world, width, height, text, text_properties);

        //this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;
        this.override_background_color = FLOATING_TEXT_BACKGROUND_ERROR;

        this.initialize();
        this.refresh();
    }

};







function FloatingText2DTest(world, height, text, text_properties, fixed_width) {
    this.__init__(world, height, text, text_properties, fixed_width);
}

FloatingText2DTest.prototype = {

    __init__: function(world, height, text, text_properties, fixed_width) {

        let italic = false;
        let bold   = false;
        if (is_defined(text_properties)) {
            italic = text_properties[0];
            bold   = text_properties[1];
        }

        let width;
        if (!is_defined(fixed_width)) {
            if (italic && bold) {
                width = MANAGER_TEXT_2D.get_width_of_italic_and_bold_text_given_bounding_height(text, height);
            } else if (italic) {
                width = MANAGER_TEXT_2D.get_width_of_italic_text_given_bounding_height(text, height);
            } else if (bold) {
                width = MANAGER_TEXT_2D.get_width_of_bold_text_given_bounding_height(text, height);
            } else {
                width = MANAGER_TEXT_2D.get_width_of_text_given_bounding_height(text, height);
            }
        } else {
            this._fixed_width = true;
            width = fixed_width;
        }

        // Inherit.
        Text2D.call(this, world, width, height, text, text_properties);

        this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

        this.initialize();
        this.refresh();
    }

};