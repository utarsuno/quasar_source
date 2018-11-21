'use strict';

$_QE.prototype.PlayerMenuRow = function() {};

$_QE.prototype.PlayerMenuRow.prototype = {

    ___create_button: function(index, icon, action) {
        this.button = this.row.create_icon_button(index, null, {
            ARG_COLOR_FOREGROUND : QE.COLOR_GREEN_LIGHT,
            ARG_COLOR_HIGHLIGHT  : QE.COLOR_YELLOW,
            ARG_FEATURE_HIGHLIGHT: true,
            ARG_ICON             : icon,
            ARG_EVENT_ACTION     : action
        });
    },

    ___create_text: function(index, text_alignment) {
        this.text = this.row.create_text2d(index, null, {
            ARG_TEXT             : this._title,
            ARG_COLOR_FOREGROUND : QE.COLOR_RGB_GREEN_LIGHT,
            ARG_COLOR_HIGHLIGHT  : QE.COLOR_RGB_YELLOW,
            ARG_FEATURE_HIGHLIGHT: true,
            ARG_FONT             : QE.FONT_ARIAL_16,
            ARG_WIDTH            : 256,
            ARG_TEXT_ALIGNMENT   : text_alignment
        });
    },

    __init__: function(menu, icon, title, action, icon_first=false, sub_menu=false) {
        this._enabled_for_level = true;
        this._title             = title;

        this.row = menu.create_row_animated(null, QE.FONT_ARIAL_16.height, .15, -5);
        if (!icon_first) {
            this.___create_button(5, icon, action);
            this.___create_text(4, TEXT_ALIGNMENT_END);
        } else {
            this.___create_button(-5, icon, action);
            this.___create_text(-4, TEXT_ALIGNMENT_START);
        }

        let self = this;
        this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
            self.button.set_current_foreground_color(QE.COLOR_YELLOW);
            self.text.set_current_foreground_color(QE.COLOR_RGB_YELLOW);

            if (!sub_menu) {
                self.row.parent_wall.on_main_menu_button_look_at(self.button);
            }
        });

        this.button.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, function() {
            self.button.set_current_foreground_color(QE.COLOR_GREEN_LIGHT);
            self.text.set_current_foreground_color(QE.COLOR_RGB_GREEN_LIGHT);
        });

    },

    _on_close: function() {
        if (this.button.flag_is_on(EFLAG_IS_BEING_LOOKED_AT)) {
            l('Button is engaged and being looked at!');
            l(this);
        }
        this.unlock_colors();
        if (this.menu != null) {
            this.menu.animation_close();
        }
    },

    lock_colors: function() {
        this.button.flag_set_on(EFLAG_IS_LOCKED_FOREGROUND);
        this.text.flag_set_on(EFLAG_IS_LOCKED_FOREGROUND);
        if (this.menu != null) {
            this.menu.animation_play_forward(false, false);
        }
    },

    unlock_colors: function() {
        this.button.flag_set_off(EFLAG_IS_LOCKED_FOREGROUND);
        this.text.flag_set_off(EFLAG_IS_LOCKED_FOREGROUND);
        this.button.set_foreground_color_to_default();
        this.text.set_foreground_color_to_default();
        if (this.menu != null) {
            this.menu.animation_play_reverse(false, false);
        }
    },

};
