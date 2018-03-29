'use strict';

function FloatingElement(world) {

    // Inherit.
    Attachmentable.call(this, world);
    Animatable.call(this);
    ColorAbstraction.call(this);
    Interactive.call(this);
    Visibility.call(this);

    this.add_label_left = function(text) {
        var label = new FloatingText2D(this.world, this.height, text);
        this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
    };
}