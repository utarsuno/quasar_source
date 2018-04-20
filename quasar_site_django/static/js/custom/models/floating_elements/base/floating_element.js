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

    this.set_to_typeable = function() {
        this.needs_mobile_keyboard = true;
        this.set_to_interactive();
    };

    this.set_to_clickable = function() {
        this.engable = false;
        this.maintain_engage_when_tabbed_to = false;
        this.set_to_interactive();
        this.is_clickable = true;
    };

    this.add_label_left = function(text) {
        let label = new FloatingText2D(this.world, this.height, text);
        //label.set_text_property_right(true);
        label.set_current_foreground_color(COLOR_TEXT_CONSTANT, true);
        //this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
        this.add_floating_element([-label.width / 4, -HALF], null, 0, label);
        return label;
    };

    this.add_label_right = function(text, text_size) {
        let label;
        if (is_defined(text_size)) {
            label = new FloatingText2D(this.world, text_size, text);
        } else {
            label = new FloatingText2D(this.world, this.height, text);
        }
        this.add_floating_element([label.width / 2, HALF], null, 0, label);
        return label;
    };

    this.add_icon_left = function(icon_type) {
        let icon = new FloatingIcon(this.world, icon_type, this.height);
        this.add_floating_element([-this.height / 2, -HALF], null, 0, icon);
        return icon;
    };

    this.add_icon_button_left = function(icon_type, engage_function) {
        let icon_button = new FloatingIconButton(this.world, icon_type, this.height, engage_function);
        this.add_floating_element([-this.height / 2, -HALF], null, 0, icon_button);
        return icon_button;
    };

    this.add_icon_button_right = function(icon_type, engage_function) {
        let icon_button = new FloatingIconButton(this.world, icon_type, this.height, engage_function);
        this.add_floating_element([this.height / 2, HALF], null, 0, icon_button);
        return icon_button;
    };

    this.add_button_right = function(width, text, engage_function, color) {
        let button = new FloatingButton(this.world, width, this.height, text, engage_function);
        if (is_defined(color)) {
            button.set_foreground_color(color);
        }
        this.add_floating_element([button.width / 2, HALF], null, 0, button);
        return button;
    };
}