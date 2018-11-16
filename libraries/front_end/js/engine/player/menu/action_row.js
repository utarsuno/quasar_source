'use strict';

$_QE.prototype.PlayerMenuRow = function() {
};

$_QE.prototype.PlayerMenuRow.prototype = {

    __init__: function(menu, icon, title, action, icon_first=false) {
        this._enabled_for_level = true;
        this._title             = title;

        this.row = menu.create_row(null, QE.FONT_ARIAL_16.height);
        menu._add_animation_step(this.row, 0.25, true, QE.FONT_ARIAL_16.height);
        if (!icon_first) {
            this.button = this.row.create_icon_button(icon, QE.COLOR_GREEN_LIGHT, 5, action, false);
            this.text = this.row.create_text2d(this._title, QE.COLOR_RGB_GREEN_LIGHT, QE.FONT_ARIAL_16, 256, 4);
            this.text.set_text_alignment(TEXT_ALIGNMENT_END);
        } else {
            this.button = this.row.create_icon_button(icon, QE.COLOR_GREEN_LIGHT, -5, action, false);
            this.text = this.row.create_text2d(this._title, QE.COLOR_RGB_GREEN_LIGHT, QE.FONT_ARIAL_16, 256, -4);
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

    lock_colors: function() {
        this.button.set_flag(EFLAG_LOCK_FOREGROUND, true);
        this.text.set_flag(EFLAG_LOCK_FOREGROUND, true);
    },

    unlock_colors: function() {
        this.button.set_flag(EFLAG_LOCK_FOREGROUND, false);
        this.text.set_flag(EFLAG_LOCK_FOREGROUND, false);
    },

};
