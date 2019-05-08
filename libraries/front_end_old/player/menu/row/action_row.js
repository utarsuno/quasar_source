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
            ARG_TEXT                : this._title,
            ARG_COLOR_FOREGROUND    : QE.COLOR_RGB_GREEN_LIGHT,
            ARG_COLOR_HIGHLIGHT     : QE.COLOR_RGB_YELLOW,
            ARG_FEATURE_HIGHLIGHT   : true,
            ARG_FONT                : QE.FONT_ARIAL_16,
            ARG_WIDTH               : 256,
            ARG_ALIGNMENT_TEXT      : text_alignment,
            ARG_LOOKABLE            : true,
            ARG_EVENT_ACTION        : this.button.trigger_event.bind(this.button, ELEMENT_EVENT_ON_ENGAGE)
        });
    },

    _on_row_looked_at: function(sub_menu) {
        this.button.set_current_foreground_color(QE.COLOR_YELLOW);
        this.text.set_current_foreground_color(QE.COLOR_RGB_YELLOW);
        if (!sub_menu) {
            this.row.parent_wall.on_main_menu_button_look_at(this.button);
        }
    },

    _on_row_looked_away: function() {
        this.button.set_current_foreground_color(QE.COLOR_GREEN_LIGHT);
        this.text.set_current_foreground_color(QE.COLOR_RGB_GREEN_LIGHT);
    },

    __init__: function(menu, icon, title, action, icon_first=false, sub_menu=false) {
        this._enabled_for_level = true;
        this._title             = title;
        this._parent_menu       = menu;

        this.row = menu.create_row_animated(null, QE.FONT_ARIAL_16.height, .15, -5);
        if (!icon_first) {
            this.___create_button(5, icon, action);
            this.___create_text(4, TEXT_ALIGNMENT_END);
        } else {
            this.___create_button(-5, icon, action);
            this.___create_text(-4, TEXT_ALIGNMENT_START);
        }

        this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, this._on_row_looked_at.bind(this, sub_menu));
        //this.text.set_event(ELEMENT_EVENT_ON_LOOK_AT, this._on_row_looked_at.bind(this, sub_menu));
        this.text.set_event(ELEMENT_EVENT_ON_LOOK_AT, this.button.trigger_event.bind(this.button, ELEMENT_EVENT_ON_LOOK_AT, sub_menu));

        this.button.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, this._on_row_looked_away.bind(this));
        //this.text.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, this._on_row_looked_away.bind(this));
        this.text.set_event(ELEMENT_EVENT_ON_LOOK_AWAY, this.button.trigger_event.bind(this.button, ELEMENT_EVENT_ON_LOOK_AWAY));
    },

    _on_close: function() {
        this.unlock_colors(false);
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

    unlock_colors: function(play_animation=true) {
        this.button.flag_set_off(EFLAG_IS_LOCKED_FOREGROUND);
        this.text.flag_set_off(EFLAG_IS_LOCKED_FOREGROUND);
        this.button.set_foreground_color_to_default();
        this.text.set_foreground_color_to_default();
        if (this.menu != null && play_animation) {
            this.menu.animation_play_reverse(false, false);
        }
    },

};
