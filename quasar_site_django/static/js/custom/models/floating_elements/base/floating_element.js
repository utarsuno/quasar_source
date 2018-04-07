'use strict';

function FloatingElement(world) {

    // Inherit.
    Attachmentable.call(this, world);
    Animatable.call(this);
    ColorAbstraction.call(this);
    Interactive.call(this);
    Visibility.call(this);

    this.needs_mobile_keyboard = false;
    this.is_clickable          = false;
    this.is_interactive        = false;

    this.set_to_clickable = function() {
        this.engable = false;
        this.maintain_engage_when_tabbed_to = false;
        this.set_to_interactive();
        this.is_clickable = true;
    };

    this.set_to_interactive = function() {
        this.world.interactive_objects.push(this);
        this.is_interactive = true;
    };

    this.add_label_left = function(text) {
        var label = new FloatingText2D(this.world, this.height, text, TEXT_PROPERTY_JUST_ITALIC);
        label.set_text_property_right(true);
        label.set_current_foreground_color(COLOR_TEXT_CONSTANT, true);
        this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
    };

    this.add_icon_left = function(icon_type) {
        var icon = new FloatingIcon(this.world, icon_type, this.height);
        this.add_floating_element([-this.height / 2, -HALF], null, 0, icon);
    };
}