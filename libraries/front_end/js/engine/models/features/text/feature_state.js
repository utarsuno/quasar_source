'use strict';

$_QE.prototype.FeatureTextState = function() {

    this.warning_icon = new $_QE.prototype.FloatingIcon(this.world, ASSET_ICON_WARNING, this.height, QE.COLOR_RED, true);
    this.warning_icon.offset_depth_distance        = 1;
    this.warning_icon.offset_horizontal_distance   = -16;
    this.warning_icon.offset_horizontal_percentage = 0.5;
    this.warning_icon.manual_visibility            = true;
    this.add_attachment(this.warning_icon);
    this.warning_icon.set_to_invisible();

    this.warning_text = this.add_label_right('WARNING TEXT', this.height / 2);
    this.warning_text.set_foreground_color(QE.COLOR_RED);
    this.warning_text.set_to_invisible();

    this.display_warning_icon = function(warning_text) {
        this.warning_icon.set_to_visible();
        this.override_background_color = FLOATING_TEXT_BACKGROUND_ERROR;
        if (warning_text != null) {
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

};