'use strict';

$_QE.prototype.FeatureColor = function(){};

Object.assign($_QE.prototype.FeatureColor.prototype, {
    current_background_color: null,
    default_background_color: null,
    current_foreground_color: null,
    default_foreground_color: null,

    set_current_background_color: function(color) {
        if (this.current_background_color !== color) {
            this.current_background_color = color;
            this.set_flag(EFLAG_UPDATE_COLOR, true);
        }
    },

    set_default_background_color: function(color) {
        if (this.default_background_color !== color) {
            this.default_background_color = color;
            this.set_flag(EFLAG_UPDATE_COLOR, true);
        }
    },

    set_current_foreground_color: function(color) {
        if (this.current_foreground_color !== color) {
            this.current_foreground_color = color;
            this.set_flag(EFLAG_UPDATE_COLOR, true);
            this.trigger_event(ELEMENT_EVENT_ON_FOREGROUND_COLOR);
        }
    },

    set_default_foreground_color: function(color) {
        if (this.default_foreground_color !== color) {
            this.default_foreground_color = color;
            this.set_flag(EFLAG_UPDATE_COLOR, true);
            this.trigger_event(ELEMENT_EVENT_ON_BACKGROUND_COLOR);
        }
    },

    set_colors: function(foreground_color, background_color) {
        this.set_foreground_color(foreground_color);
        this.set_background_color(background_color);
    },

    set_foreground_color: function(color) {
        this.set_default_foreground_color(color);
        this.set_current_foreground_color(color);
    },

    set_background_color: function(color) {
        this.set_default_background_color(color);
        this.set_current_background_color(color);
    },

});
