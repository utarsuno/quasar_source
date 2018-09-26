'use strict';

$_QE.prototype.FeatureTitleBar = function(parent, text, icon) {
    this.parent = parent;

    if (icon != null) {
        this.title_icon = new $_QE.prototype.FloatingIcon(this.parent.world, icon, 64, QE.COLOR_GREEN);
        this.title_icon.offset_vertical_percentage   = HALF;
        this.title_icon.offset_horizontal_percentage = -HALF;
        this.title_icon.offset_depth_distance        = 1;
        this.title_icon.create_icon();
        this.parent.add_attachment(this.title_icon);
    }

    this.add_settings_button = function() {
        this.button_settings = new $_QE.prototype.FloatingIcon(this.parent.world, ASSET_ICON_GEARS, 64, QE.COLOR_BLUE);
        this.button_settings.offset_vertical_percentage   = HALF;
        this.button_settings.offset_horizontal_percentage = HALF;
        this.button_settings.offset_depth_distance        = 1;
        this.button_settings.create_icon();
        this.parent.add_attachment(this.button_settings);
        if (this.button_close != null) {
            this._shift_settings_button();
        }
    };

    this._shift_settings_button = function() {
        this.button_settings.offset_horizontal_distance = -64;

    };

};