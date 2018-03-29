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

        // Create the Text3D.
        this.create_base_material();
        this.create_base_mesh();
    }

};