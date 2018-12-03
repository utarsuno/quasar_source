'use strict';

$_QE.prototype.FeatureTitleBar = function(parent_wall) {
    this.create_row(parent_wall, 64, 1, false);
};

Object.assign(
    $_QE.prototype.FeatureTitleBar.prototype,
    $_QE.prototype.FeatureRow.prototype,
    {
        add_title: function(text, interactive=false) {
            this.title = this.create_text3d(0, null, {
                ARG_INTERACTIVE     : interactive,
                ARG_TEXT            : text,
                ARG_COLOR_FOREGROUND: QE.COLOR_YELLOW
            });
        },

        add_icon: function(icon_type) {
            this.icon = this.create_icon(-1, null, {
                ARG_ICON            : icon_type,
                ARG_COLOR_FOREGROUND: QE.COLOR_GREEN
            });
        },

        add_button_help: function() {
            this.button_help = this.create_icon_button(1, null, {
                ARG_COLOR_FOREGROUND : QE.COLOR_YELLOW,
                ARG_ICON             : ASSET_ICON_QUESTION,
                ARG_EVENT_ACTION     : function() {
                    l('TODO: HELP!');
                }
            });
        },

        add_button_settings: function() {
            this.button_settings = this.create_icon_button(2, null, {
                ARG_COLOR_FOREGROUND : QE.COLOR_BLUE,
                ARG_ICON             : ASSET_ICON_GEARS,
                ARG_EVENT_ACTION     : function() {
                    l('TODO: Settings button!!!');
                }
            });
        },

        add_button_close: function() {
            let self = this;
            this.button_settings = this.create_icon_button(3, null, {
                ARG_COLOR_FOREGROUND        : QE.COLOR_RED,
                ARG_ICON                    : ASSET_ICON_CROSS,
                ARG_USE_CONFIRMATION_PROMPT : true,
                ARG_EVENT_ACTION            : function() {
                    l('TODO: Close me!!');
                    self.parent_wall.fully_destroy_self();
                }
            });
        },
    }
);
