'use strict';

function FloatingElement(world) {

    // Inherit.
    Attachmentable.call(this, world);
    Animatable.call(this);
    ColorAbstraction.call(this);
    Interactive.call(this);
    Visibility.call(this);

    this.needs_mobile_keyboard = false;

    this.set_to_clickable = function() {
        this.engable = false;
        this.maintain_engage_when_tabbed_to = false;
        this.set_to_interactive();
    };

    this.set_to_interactive = function() {
        this.world.interactive_objects.push(this);
    };

    this.add_label_left = function(text) {
        var label = new FloatingText2D(this.world, this.height, text, TEXT_PROPERTY_JUST_ITALIC);
        label.set_text_property_right(true);
        label.set_current_foreground_color(COLOR_TEXT_CONSTANT, true);
        this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
    };
}