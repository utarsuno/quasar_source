'use strict';

$_QE.prototype.FeatureColor = function(foreground_color, background_color) {

    this.current_background_color = background_color;
    this.default_background_color = background_color;

    this.current_foreground_color = foreground_color;
    this.default_foreground_color = foreground_color;

    this.update_needed_for_colors = false;

    this.set_current_background_color = function(color) {
        if (this.current_background_color !== color) {
            this.current_background_color = color;
            this.update_needed_for_colors = true;
            if (is_defined(this.current_background_color_changed)) {
                this.current_background_color_changed();
            }
        }
    };

    this.set_default_background_color = function(color) {
        if (this.default_background_color !== color) {
            this.default_background_color = color;
            this.update_needed_for_colors = true;
        }
    };

    this.set_current_foreground_color = function(color) {
        if (this.current_foreground_color !== color) {
            this.current_foreground_color = color;
            this.update_needed_for_colors = true;
            if (is_defined(this.current_foreground_color_changed)) {
                this.current_foreground_color_changed();
            }
        }
    };

    this.set_default_foreground_color = function(color) {
        if (this.default_foreground_color !== color) {
            this.default_foreground_color = color;
            this.update_needed_for_colors = true;
        }
    };

    this.set_foreground_color = function(color) {
        this.set_default_foreground_color(color);
        this.set_current_foreground_color(color);
    };

    this.set_background_color = function(color) {
        this.set_default_background_color(color);
        this.set_current_background_color(color);
    };

};