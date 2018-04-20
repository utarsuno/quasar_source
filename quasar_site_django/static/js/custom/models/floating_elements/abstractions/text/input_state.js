'use strict';

function InputState() {

    this.warning_icon = new FloatingIcon(this.world, ICON_WARNING, this.height);
    this.warning_icon.set_attachment_depth_offset(1);
    this.warning_icon.set_attachment_horizontal_offset(-16, HALF);
    this.warning_icon.set_current_foreground_color(COLOR_RED, true);
    this.warning_icon.manual_visibility = true;
    this.add_attachment(this.warning_icon);
    this.warning_icon.set_to_invisible();

    this.display_warning_icon = function(warning_text) {
        this.warning_icon.set_to_visible();
        this.override_background_color = FLOATING_TEXT_BACKGROUND_ERROR;
        if (is_defined(warning_text)) {
            this.warning_text.update_text(warning_text);
            this.warning_text.set_to_visible();
        }
        this.refresh();
    };

    this.hide_warning_icon = function() {
        this.warning_icon.set_to_invisible();
        this.override_background_color = FLOATING_TEXT_BACKGROUND_SUCCESS;
        this.warning_text.set_to_invisible();
        this.refresh();
    };

    // this.warning_icon.set_attachment_name(ATTACHMENT_NAME_WARNING);
}