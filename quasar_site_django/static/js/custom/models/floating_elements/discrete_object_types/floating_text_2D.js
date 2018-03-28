'use strict';

function FloatingText2D(world, height, text) {
    this.__init__(world, height, text);
}

FloatingText2D.prototype = {

    __init__: function(world, height, text) {

        // Get the width needed.
        var width = MANAGER_TEXT_2D.get_width_of_text_given_bounding_height(text, height);
        l('The width needed is :');
        l(width);

        // Inherit.
        Text2D.call(this, world, width, height, text);

        //this.set_default_background_color(COLOR_SEMI_TRANSPARENT, false);
        //this.set_default_foreground_color(COLOR_TEXT_CONSTANT, false);

        //this.override_background_color = 'rgba(0, 0, 0, 0';
        this.background_is_transparent = true;

        this.maintain_engage_when_tabbed_to = false;
        this.engable = false;

        this.initialize();
    }

};