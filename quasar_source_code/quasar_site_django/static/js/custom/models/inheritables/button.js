'use strict';

function InheritableButton() {

    // Used for buttons.
    this.disable = function() {
        this.color_changed = true;
        this.set_default_color(COLOR_RED, true);
        this._disabled = true;
    };

    // Used for buttons.
    this.enable = function() {
        this.color_changed = true;
        this.set_default_color(COLOR_GREEN, true);
        this._disabled = false;
    };

}