'use strict';

function FloatingElement(world) {

    // Inherit.
    Attachmentable.call(this, world);
    Animatable.call(this);
    ColorAbstraction.call(this);
    Interactive.call(this);
    Visibility.call(this);

    this.set_to_clickable = function() {
        this.engable = false;
        this.maintain_engage_when_tabbed_to = false;
        this.set_to_interactive();
    };

    this.set_to_interactive = function() {
        this.world.interactive_objects.push(this);
    };

    this.add_label_left = function(text) {
        var label = new FloatingText2D(this.world, this.height, text);
        this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
    };
}