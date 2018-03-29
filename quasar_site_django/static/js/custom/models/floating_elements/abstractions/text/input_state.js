'use strict';

function InputState() {

    this.warning_icon = new FloatingIcon(this.world, ICON_WARNING, this.height);
    this.warning_icon.set_attachment_depth_offset(1);
    this.warning_icon.set_attachment_horizontal_offset(-16, HALF);
    this.warning_icon.set_current_foreground_color(COLOR_RED, true);
    this.warning_icon.manual_visibility = true;
    this.warning_icon.set_attachment_name(ATTACHMENT_NAME_WARNING);
    this.add_attachment(this.warning_icon);
    this.warning_icon.set_to_invisible();

    this.display_warning_icon = function() {
        this.warning_icon.set_to_visible();
    };

    this.hide_warning_icon = function() {
        this.warning_icon.set_to_invisible();
    };

    /*
    this._enabled = true;

    this.disable = function() {
        this._enabled = false;
    };

    this.enable = function() {
        this._enabled = true;
    };

    this.enabled = function() {
        return this._enabled;
    };
    */
}

