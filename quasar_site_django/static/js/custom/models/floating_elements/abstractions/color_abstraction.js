'use strict';

function ColorAbstraction(needs_hex_colors) {

    this.needs_hex_colors = needs_hex_colors;
    if (!is_defined(this.needs_hex_colors)) {
        this.needs_hex_colors = false;
    }

    // TEMPORARY VALUES
    this.current_background_color = COLOR_RED;
    this.default_background_color = COLOR_RED;

    this.override_background_color = null;

    // TEMPORARY VALUES
    this.current_foreground_color = COLOR_TEXT_DEFAULT;
    this.default_foreground_color = COLOR_TEXT_DEFAULT;

    this.override_foreground_color = null;

    this.color_changed            = false;

    this.set_current_background_color = function(color, refresh) {
        if (this.current_background_color !== color) {
            this.color_changed = true;
        }
        this.current_background_color = color;
        if (is_defined(refresh)) {
            if (refresh) {
                if (is_defined(this.current_background_color_changed)) {
                    this.current_background_color_changed();
                }
            }
        }
    };

    this.set_default_background_color = function(color, refresh) {
        this.default_background_color = color;
    };

    this.set_current_foreground_color = function(color, refresh) {
        if (this.current_foreground_color !== color) {
            this.color_changed = true;
        }
        this.current_foreground_color = color;
        if (is_defined(refresh)) {
            if (refresh) {
                if (is_defined(this.current_foreground_color_changed)) {
                    this.current_foreground_color_changed();
                }
                if (is_defined(this.refresh)) {
                    this.refresh();
                }
            }
        }
    };

    this.set_default_foreground_color = function(color, refresh) {
        this.default_foreground_color = color;
        if (is_defined(refresh)) {
            if (refresh) {
                if (is_defined(this.refresh)) {
                    this.refresh();
                }
            }
        }
    };

    this.set_foreground_color = function(color) {
        this.set_default_foreground_color(color, false);
        this.set_current_foreground_color(color, true);
    };

    this.set_background_color = function(color) {
        this.set_default_background_color(color, false);
        this.set_current_background_color(color, true);
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_current_background_color = function() {
        if (is_defined(this.override_background_color)) {
            return this.override_background_color;
        }
        if (this.needs_hex_colors) {
            //return this.current_background_color.getHex();
            return '#' + this.current_background_color.getHexString();
        } else {
            return this.current_background_color;
        }
    };

    this.get_current_foreground_color = function() {
        if (is_defined(this.override_foreground_color)) {
            return this.override_foreground_color;
        }
        if (this.needs_hex_colors) {
            //return this.current_foreground_color.getHex();
            return '#' + this.current_foreground_color.getHexString();
        } else {
            return this.current_foreground_color;
        }
    };

}


