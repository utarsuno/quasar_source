'use strict';

function ButtonState() {

    this._enabled = true;
    this._locked  = false;

    this.disabled_icon = new FloatingIcon(this.world, ICON_CROSS, 32);
    this.disabled_icon.set_attachment_depth_offset(1);
    this.disabled_icon.set_current_foreground_color(COLOR_RED, true);
    this.disabled_icon.manual_visibility = true;
    this.add_attachment(this.disabled_icon);
    this.disabled_icon.set_to_invisible();

    this.locked_icon = new FloatingIcon(this.world, ICON_LOCKED, 32);
    this.locked_icon.set_attachment_depth_offset(1);
    this.locked_icon.set_current_foreground_color(COLOR_RED, true);
    this.locked_icon.manual_visibility = true;
    this.add_attachment(this.locked_icon);
    this.locked_icon.set_to_invisible();

    this.warning_text = this.add_label_right('WARNING TEXT');
    this.warning_text.set_foreground_color(COLOR_RED);
    this.warning_text.set_to_invisible();

    this.disable = function() {
        this._enabled = false;
        this.disabled_icon.set_to_visible();
    };

    this.lock = function() {
        this._locked = true;
        this.locked_icon.set_to_visible();
    };

    this.enable = function() {
        this._enabled = true;
        this.disabled_icon.set_to_invisible();
    };

    this.unlock = function() {
        this._locked = false;
        this.locked_icon.set_to_invisible();
    };

    this.enabled = function() {
        return this._enabled && !this._locked;
    };

}
