'use strict';

$_QE.prototype.FloatingText3D = function(world, size, text) {
    // Inherit.
    $_QE.prototype.Text3D.call(this, world, size, text);

    this.set_default_foreground_color(COLOR_TEXT_CONSTANT, false);

    // Create the Text3D.
    this.create_base_material();
    this.create_base_mesh();
};
