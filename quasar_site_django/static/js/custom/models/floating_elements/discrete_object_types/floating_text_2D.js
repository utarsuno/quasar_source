'use strict';

function FloatingText2D(world, height, text, text_properties, fixed_width) {
    this.__init__(world, height, text, text_properties, fixed_width);
}

FloatingText2D.prototype = {

    __init__: function(world, height, text, text_properties, fixed_width) {

        // If 'fixed_width' is not provided then the width will be dynamically set.

        // Inherit.
        Text2D.call(this, world, fixed_width, height, text);

        //this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;
        this.override_background_color = FLOATING_TEXT_BACKGROUND_ERROR;
        this.set_foreground_color(COLOR_BLUE);

        this.initialize();
    }

};