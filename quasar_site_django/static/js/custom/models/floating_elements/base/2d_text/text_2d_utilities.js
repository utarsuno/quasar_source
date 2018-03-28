'use strict';

function Text2DUtilities() {
    this.__init__();
}

Text2DUtilities.prototype = {
    __init__: function() {
        this.canvas = new CanvasAbstraction(1, 1);
    },

    get_width_of_text_given_bounding_height: function(text, height) {
        this.canvas.set_font(height);
        return this.canvas.get_text_width(text);
    }
};
