'use strict';

$_QE.prototype.FeatureTitleBar = function() {

    $_QE.prototype.FeatureRow.call(this, 64, 1);

    this.add_title = function(text, interactive=false) {
        this.title = this.create_text3d_center(text, null, interactive);
    };

    this.add_icon = function(icon_type) {
        this.icon = this.create_icon_left(icon_type, QE.COLOR_GREEN);
    };

    this.add_button_help = function() {
        this.button_help = this.create_icon_right(ASSET_ICON_QUESTION, QE.COLOR_YELLOW, 2);
        this.button_help.set_to_button(function() {
            l('TODO: HELP!');
        });
    };

    this.add_button_settings = function() {
        this.button_settings = this.create_icon_right(ASSET_ICON_GEARS, QE.COLOR_BLUE, 1);
        this.button_settings.set_to_button(function() {
            l('TODO: SETTINGS!');
        });
    };

    this.add_button_close = function() {
        this.button_close = this.create_icon_right(ASSET_ICON_CROSS, QE.COLOR_RED, 0);
        this.button_close.set_to_button(function() {
            l('TODO: CLOSE ME!');
        });
    };
};
