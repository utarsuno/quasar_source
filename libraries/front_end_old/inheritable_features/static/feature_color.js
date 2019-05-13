$_QE.prototype.FeatureColor = function(){};

Object.assign($_QE.prototype.FeatureColor.prototype, {
    /*
    Fields:
        - current_background_color
        - default_background_color
        - current_foreground_color
        - default_foreground_color
        - opacity
     */

    _set_flag: function(foreground, background) {
        if (this.flag_set_on !== null) {
            this.flag_set_on(EFLAG_IS_UPDATED_NEEDED_FOR_COLOR);
            if (foreground) {
                this.trigger_event(ELEMENT_EVENT_ON_FOREGROUND_COLOR);
            } else if (background) {
                this.trigger_event(ELEMENT_EVENT_ON_BACKGROUND_COLOR);
            }
        }
    },

    _is_background_locked: function() {
        if (this.flag_is_on !== null) {
            return this.flag_is_on(EFLAG_IS_LOCKED_BACKGROUND);
        }
        return false;
    },

    _is_foreground_locked: function() {
        if (this.flag_is_on !== null) {
            return this.flag_is_on(EFLAG_IS_LOCKED_FOREGROUND);
        }
        return false;
    },

    set_background_color_to_default: function() {
        this.set_current_background_color(this.default_background_color);
    },

    set_current_background_color: function(color) {
        if (!this._is_background_locked()) {
            if (this.current_background_color !== color) {
                this.current_background_color = color;
                this._set_flag(false, false);
            }
        }
    },

    set_default_background_color: function(color) {
        if (!this._is_background_locked()) {
            if (this.default_background_color !== color) {
                this.default_background_color = color;
                this._set_flag(false, false);
            }
        }
    },

    set_foreground_color_to_default: function() {
        this.set_current_foreground_color(this.default_foreground_color);
    },

    set_current_foreground_color: function(color) {
        if (!this._is_foreground_locked()) {
            if (this.current_foreground_color !== color) {
                this.current_foreground_color = color;
                this._set_flag(true, false);
            }
        }
    },

    set_default_foreground_color: function(color) {
        if (!this._is_foreground_locked()) {
            if (this.default_foreground_color !== color) {
                this.default_foreground_color = color;
                this._set_flag(false, true);
            }
        }
    },

    set_colors: function(foreground_color, background_color) {
        this.set_foreground_color(foreground_color);
        this.set_background_color(background_color);
    },

    set_foreground_color: function(color, opacity=null) {
        this.set_default_foreground_color(color);
        this.set_current_foreground_color(color);
        if (opacity !== null) {
            this.opacity = opacity;
        }
    },

    set_background_color: function(color) {
        this.set_default_background_color(color);
        this.set_current_background_color(color);
    },

});
