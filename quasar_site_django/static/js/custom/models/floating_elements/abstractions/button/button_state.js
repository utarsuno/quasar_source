'use strict';

function ButtonState() {

    this._enabled = true;

    this.disabled_icon = new FloatingIcon(this.world, ICON_CROSS, 32);
    this.disabled_icon.set_attachment_depth_offset(1);
    this.disabled_icon.set_current_foreground_color(COLOR_RED);
    this.disabled_icon.manual_visibility = true;
    this.disabled_icon.set_attachment_name(ATTACHMENT_NAME_ERROR);
    this.add_attachment(this.disabled_icon);
    this.disabled_icon.set_to_invisible();

    // TODO  :
    this.disable = function() {
        this._enabled = false;
        this.disabled_icon.set_to_visible();
    };

    // TODO :
    this.enable = function() {
        this._enabled = true;
    };

    // TODO :
    this.enabled = function() {
        return this._enabled;
    };

}
