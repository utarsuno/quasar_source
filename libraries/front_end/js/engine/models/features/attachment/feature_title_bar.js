'use strict';

$_QE.prototype.FeatureTitleBar = function(parent, text, icon, changeable) {
    this.parent = parent;
    this.title = new $_QE.prototype.Text3D(this.parent.world, 64, text, changeable);
    this.title.offset_vertical_percentage   = HALF;
    this.title.offset_horizontal_percentage = -HALF;
    this.title.offset_depth_distance        = 1;
    this.parent.add_attachment(this.title);

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

    this.add_close_button = function() {
        this.button_close = new $_QE.prototype.FloatingIcon(this.parent.world, ASSET_ICON_CROSS, 64, QE.COLOR_RED);
        // TODO: Create better close button abstraction
        //this.button_close.set_to_close_button();
        if (this.button_settings != null) {
            this._shift_settings_button();
        }
        this.button_close.offset_vertical_percentage   = HALF;
        this.button_close.offset_horizontal_percentage = HALF;
        this.button_close.offset_depth_distance        = 1;
        this.button_close.create_icon();
        this.parent.add_attachment(this.button_close);
    };

    this._shift_settings_button = function() {
        this.button_settings.offset_horizontal_distance = -64;

    };

};