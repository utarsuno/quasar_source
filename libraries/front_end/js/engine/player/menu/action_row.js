'use strict';

$_QE.prototype.PlayerMenuRow = function() {
};

$_QE.prototype.PlayerMenuRow.prototype = {

    __init__: function(menu, icon, title, action, icon_first=false) {
        this._enabled_for_level = true;
        this._title             = title;

        this.row = menu.create_row(null, QE.FONT_ARIAL_16.height);
        menu._add_animation_step(this.row, .5, true, QE.FONT_ARIAL_16.height);
        if (!icon_first) {
            this.button = this.row.create_icon_button(icon, QE.COLOR_GREEN_LIGHT, 5, action, false);
            this.text   = this.row.create_text2d(this._title, QE.COLOR_RGB_GREEN_LIGHT, QE.FONT_ARIAL_16, 256, 4);
            this.text.set_text_alignment(TEXT_ALIGNMENT_END);
        } else {
            this.button = this.row.create_icon_button(icon, QE.COLOR_GREEN_LIGHT, -5, action, false);
            this.text   = this.row.create_text2d(this._title, QE.COLOR_RGB_GREEN_LIGHT, QE.FONT_ARIAL_16, 256, -4);
            //this.button = this.row.create_icon_button(icon, QE.COLOR_GREEN_LIGHT, -4, action, false);
            this.text.set_text_alignment(TEXT_ALIGNMENT_START);

            //this.temp = this.row.create_icon_button(icon, QE.COLOR_RED_LIGHT, 5, action, false);
            //this.temp2 = this.row.create_icon_button(icon, QE.COLOR_RED, 4, action, false);
        }

        let self = this;
        this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
            self.button.set_current_foreground_color(QE.COLOR_YELLOW);
            self.text.set_current_foreground_color(QE.COLOR_RGB_YELLOW);
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
            this.menu._on_close();
        }
    },

    lock_colors: function() {
        this.button.flag_set_on(EFLAG_IS_LOCKED_FOREGROUND);
        this.text.flag_set_on(EFLAG_IS_LOCKED_FOREGROUND);
        if (this.menu != null) {
            this.menu.animation_play_forward_once();
        }
    },

    unlock_colors: function() {
        this.button.flag_set_off(EFLAG_IS_LOCKED_FOREGROUND);
        this.text.flag_set_off(EFLAG_IS_LOCKED_FOREGROUND);
        this.button.set_foreground_color_to_default();
        this.text.set_foreground_color_to_default();
        if (this.menu != null) {
            this.menu.animation_play_reversed_once();
        }
    },

};
