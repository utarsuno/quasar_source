'use strict';

$_QE.prototype.FeatureTitleBar = function(parent, text, icon, changeable) {
    this.parent = parent;
    this.title = new $_QE.prototype.Text3D(this.parent.world, 64, text, changeable);
    this.title.offset_vertical_percentage   = HALF;
    this.title.offset_horizontal_percentage = -HALF;
    this.title.offset_depth_distance        = 1;
    this.parent.add_attachment(this.title);

    if (is_defined(icon)) {
        this.title_icon = new $_QE.prototype.FloatingIcon(this.parent.world, icon, 64, QE.COLOR_CANVAS_YELLOW);
        this.title_icon.offset_vertical_percentage = HALF;
        this.title_icon.offset_horizontal_percentage = -HALF;
        this.title_icon.offset_depth_distance = 1;
        this.title_icon.create_icon();
        this.parent.add_attachment(this.title_icon);
    }

    this.add_settings_button = function() {
        this.button_settings = new $_QE.prototype.FloatingIcon(this.parent.world, ASSET_ICON_CROSS, QE.COLOR_CANVAS_GRAY);
        this.button_settings.offset_vertical_percentage = HALF;
        this.button_settings.offset_horizontal_percentage = HALF;
        this.button_settings.offset_depth_distance = 1;
        this.parent.add_attachment(this.button_settings);
    };
};