'use strict';

$_QE.prototype.FeatureTitleBar = function(parent_wall) {
    this.create_row(parent_wall, 64, 1, false);
};

Object.assign(
    $_QE.prototype.FeatureTitleBar.prototype,
    $_QE.prototype.FeatureRow.prototype,
    {
        add_title: function(text, interactive=false) {
            this.title = this.create_text3d(text, QE.COLOR_YELLOW, interactive, 0);
        },

        add_icon: function(icon_type) {
            this.icon = this.create_icon(icon_type, QE.COLOR_GREEN, -1);
        },

        add_button_help: function() {
            this.button_help = this.create_icon(ASSET_ICON_QUESTION, QE.COLOR_YELLOW, 1);
            this.button_help.set_to_button(function() {
                l('TODO: HELP!');
            });
        },

        add_button_settings: function() {
            this.button_settings = this.create_icon(ASSET_ICON_GEARS, QE.COLOR_BLUE, 2);
            this.button_settings.set_to_button(function() {
                l('TODO: SETTINGS!');
            });
        },

        add_button_close: function() {
            this.button_close = this.create_icon(ASSET_ICON_CROSS, QE.COLOR_RED, 3);
            this.button_close.set_to_button(function() {
                l('TODO: CLOSE ME!');
            }, true);
        },
    }
);
