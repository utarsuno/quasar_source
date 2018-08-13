'use strict';

$_QE.prototype.FloatingElement = function(world) {
    $_QE.prototype.FeatureAttachment.call(this);
    $_QE.prototype.FeaturePosition.call(this, world);
    $_QE.prototype.FeatureVisibility.call(this);
    $_QE.prototype.FeatureRecycle.call(this);

    this.set_to_button = function(engage_function) {
        $_QE.prototype.FeatureButton.call(this, engage_function);
    };

    this.set_to_close_button = function() {
        let me = this;
        $_QE.prototype.FeatureButton.call(this, function() {
            //this.attachment_parent.force_hide_self_and_all_child_attachments_recursively
            me.attachment_parent.force_hide_self_and_all_child_attachments_recursively();
        });
    };
};

/*
$_QE.prototype.FloatingElement = function(world) {

    this.is_left_attachment = false;
    this.is_right_attachment = false;


    this.add_label_left = function(text, cacheable, cacheable_texture) {
        let label = new $_QE.prototype.FloatingText2D(this.world, this.height, text, null, cacheable, cacheable_texture);
        label.set_current_foreground_color(COLOR_BLUE, true);
        label.is_left_attachment = true;
        this.add_floating_element([-label.width / 2, -HALF], null, 0, label);
        return label;
    };

    this.add_label_right = function(text, text_size) {
        let label;
        if (is_defined(text_size)) {
            label = new $_QE.prototype.FloatingText2D(this.world, text_size, text);
        } else {
            label = new $_QE.prototype.FloatingText2D(this.world, this.height, text);
        }
        label.is_right_attachment = true;
        this.add_floating_element([label.width / 2, HALF], null, 0, label);
        return label;
    };

    this.add_icon_left = function(icon_type) {
        let icon = new $_QE.prototype.FloatingIcon(this.world, icon_type, this.height);
        this.add_floating_element([-this.height / 2, -HALF], null, 0, icon);
        return icon;
    };

    this.add_icon_button_left = function(icon_type, engage_function) {
        let icon_button = new $_QE.prototype.FloatingIconButton(this.world, icon_type, this.height, engage_function);
        this.add_floating_element([-this.height / 2, -HALF], null, 0, icon_button);
        return icon_button;
    };

    this.add_icon_button_right = function(icon_type, engage_function) {
        let icon_button = new $_QE.prototype.FloatingIconButton(this.world, icon_type, this.height, engage_function);
        this.add_floating_element([this.height / 2, HALF], null, 0, icon_button);
        return icon_button;
    };

    this.add_button_right = function(width, text, engage_function, color) {
        let button = new $_QE.prototype.FloatingButton(this.world, width, this.height, text, engage_function);
        if (is_defined(color)) {
            button.set_foreground_color(color);
        }
        this.add_floating_element([button.width / 2, HALF], null, 0, button);
        return button;
    };
};
    */