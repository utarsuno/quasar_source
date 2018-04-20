'use strict';

function CanvasAbstraction() {
    // Inherit.
    CanvasFont.call(this);
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.render = function(background_color, foreground_color, text) {
        //l('Rendering will the following width and height');
        //l(this.width);
        //l(this.height);

        this.context.clearRect(0, 0, this.width, this.height);
        if (is_defined(background_color)) {
            this.context.fillStyle = background_color;
            this.context.fillRect(0, 0, this.width, this.height);
        }
        this.context.fillStyle = foreground_color;

        if (this.text_property_centered) {
            this.context.textAlign = 'center';
            this.context.fillText(text, this.width / 2, int(this.font_size * .9));
        } else {
            this.context.fillText(text, 0, int(this.font_size * .9));
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_width = function(text) {
        return this.context.measureText(text).width;
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_dimensions = function(width, height) {
        this._set_width(width);
        this._set_height(height);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    };

    this._set_height = function(height) {
        this.height = get_next_highest_power_of_two(height * 2);
    };

    this._set_width = function(width) {
        this.width = get_next_highest_power_of_two(width * 2);
    };
}