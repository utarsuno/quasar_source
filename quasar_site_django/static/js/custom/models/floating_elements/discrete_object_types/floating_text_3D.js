'use strict';

function FloatingText3D(world, size, text) {
    this.__init__(world, size, text);
}

FloatingText3D.prototype = {

    __init__: function(world, size, text) {
        // Inherit.
        Text3D.call(this, world, size, text);

        this.set_default_background_color(COLOR_SEMI_TRANSPARENT, false);
        this.set_default_foreground_color(COLOR_TEXT_CONSTANT, false);

        this.maintain_engage_when_tabbed_to = false;
        this.engable = false;
    }

};