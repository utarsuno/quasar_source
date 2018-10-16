'use strict';

$_QE.prototype.FeatureTitleBar = function(parent_wall) {

    this._title_row = new $_QE.prototype.FeatureRow(parent_wall, 64, 1);

    this.add_title = function(text, interactive=false) {
        this.title = this._title_row.create_text3d(text, QE.COLOR_YELLOW, interactive, 0);
    };

    this.add_icon = function(icon_type) {
        this.icon = this._title_row.create_icon(icon_type, QE.COLOR_GREEN, -1);
    };

    this.add_button_help = function() {
        this.button_help = this._title_row.create_icon(ASSET_ICON_QUESTION, QE.COLOR_YELLOW, 1);
        this.button_help.set_to_button(function() {
            l('TODO: HELP!');
        });
    };

    this.add_button_settings = function() {
        this.button_settings = this._title_row.create_icon(ASSET_ICON_GEARS, QE.COLOR_BLUE, 2);
        this.button_settings.set_to_button(function() {
            l('TODO: SETTINGS!');
        });
    };

    this.add_button_close = function() {
        this.button_close = this._title_row.create_icon(ASSET_ICON_CROSS, QE.COLOR_RED, 3);
        this.button_close.set_to_button(function() {
            l('TODO: CLOSE ME!');
        });
    };
};
