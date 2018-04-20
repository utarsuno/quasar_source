'use strict';

function Text2DUtilities() {
    this.__init__();
}

Text2DUtilities.prototype = {

    __init__: function() {
        this.canvas = new CanvasAbstraction();
    },

    get_width_needed: function(text, height, bold, italic) {
        this.canvas.set_text_property_bold(bold);
        this.canvas.set_text_property_italic(italic);
        this.canvas.set_height(height);
        this.canvas.set_font();
        return this.canvas.get_text_width(text);
    }
};