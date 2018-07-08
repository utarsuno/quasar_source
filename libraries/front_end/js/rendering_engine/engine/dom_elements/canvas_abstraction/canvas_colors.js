'use strict';

$_QE.prototype.CanvasColors = function() {

    // TEMPORARY VALUES
    this.current_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;
    this.default_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;

    // TEMPORARY VALUES
    this.current_foreground_color = COLOR_GREEN;
    this.default_foreground_color = COLOR_GREEN;

    this.update_needed_for_colors = false;

    this.set_current_background_color = function(color) {
        if (this.current_background_color !== color) {
            this.current_background_color = color;
            this.update_needed_for_colors = true;
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
