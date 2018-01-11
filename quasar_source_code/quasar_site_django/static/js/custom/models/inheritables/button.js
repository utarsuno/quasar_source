'use strict';

function InheritableButton() {

    // Used for buttons.
    this.disable = function() {

        l('Previous color is : ');
        l(this.previous_default_color);
        l(this.default_color);


        this.previous_default_color = this.default_color;
        this.set_default_color(COLOR_RED);
        this._disabled = true;
    };

    // Used for buttons.
    this.enable = function() {
        this.set_default_color(this.previous_default_color);
        this._disabled = false;
    };


}