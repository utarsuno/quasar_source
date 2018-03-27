'use strict';

function FloatingInput2D(world, width, text_height, text) {
    this.__init__(world, width, text_height, text);
}

FloatingInput2D.prototype = {

    __init__: function(world, width, text_height, text) {
        // Inherit.
        Floating2DText.call(this, world, width, text_height, text);

        this.set_default_background_color(COLOR_SEMI_TRANSPARENT, false);
        this.set_default_foreground_color(COLOR_TEXT_DEFAULT, false);


        this.world.interactive_objects.push(this);

        this.create_base_dynamic_texture();
        this.create_base_mesh();
    }

};