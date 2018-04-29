'use strict';

function FloatingText2D(world, height, text, fixed_width, cacheable, cacheable_texture) {
    this.__init__(world, height, text, fixed_width, cacheable, cacheable_texture);
}

FloatingText2D.prototype = {

    __init__: function(world, height, text, fixed_width, cacheable, cacheable_texture) {

        // If 'fixed_width' is not provided then the width will be dynamically set.

        // Inherit.
        Text2D.call(this, world, fixed_width, height, text, cacheable, cacheable_texture);

        this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

        // For debugging mesh width : this.override_background_color = FLOATING_TEXT_BACKGROUND_ERROR;
        this.set_foreground_color(COLOR_BLUE);

        this.initialize();
    }

};