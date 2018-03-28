'use strict';

function Text2DUtilities() {
    this.__init__();
}

Text2DUtilities.prototype = {
    __init__: function() {
        this.canvas = new CanvasAbstraction(1, 1);
    },

    get_width_of_text_given_bounding_height: function(text, height) {
        var h = get_nearest_power_of_two_for_number(height * 2) * 0.85;
        var ratio = parseFloat(h) / parseFloat(height);
        this.canvas.set_height(height);

        var w = this.canvas.get_text_width_for_texture(text);

        return w * ratio;
    }
};
