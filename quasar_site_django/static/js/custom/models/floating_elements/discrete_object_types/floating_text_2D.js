'use strict';

function FloatingText2D(world, height, text) {
    this.__init__(world, height, text);
}

FloatingText2D.prototype = {

    __init__: function(world, height, text) {

        // Get the width needed.
        var width = MANAGER_TEXT_2D.get_width_of_text_given_bounding_height(text, height);

        // Inherit.
        Text2D.call(this, world, width, height, text);

        this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

        this.maintain_engage_when_tabbed_to = false;
        this.engable = false;

        this.initialize();
    }

};