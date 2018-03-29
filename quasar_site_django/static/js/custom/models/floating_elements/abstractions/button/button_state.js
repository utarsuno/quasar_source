'use strict';

function ButtonState() {

    this._enabled = true;

    this.disabled_icon = new FloatingIcon(this.world, ICON_CROSS, 32);
    this.disabled_icon.set_attachment_depth_offset(1);
    this.disabled_icon.set_current_foreground_color(COLOR_RED, true);
    this.disabled_icon.manual_visibility = true;
    this.disabled_icon.set_attachment_name(ATTACHMENT_NAME_ERROR);
    this.add_attachment(this.disabled_icon);
    this.disabled_icon.set_to_invisible();

    this.disable = function() {
        this._enabled = false;
        this.disabled_icon.set_to_visible();
    };

    this.enable = function() {
        this._enabled = true;
        this.disabled_icon.set_to_invisible();
    };

    this.enabled = function() {
        return this._enabled;
    };

}
