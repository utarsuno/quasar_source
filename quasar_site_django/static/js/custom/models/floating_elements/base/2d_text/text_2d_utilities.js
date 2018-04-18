'use strict';

function Text2DUtilities() {
    this.__init__();
}

Text2DUtilities.prototype = {
    __init__: function() {
        this.canvas_regular = new CanvasAbstraction(1, 1);

        this.canvas_bold = new CanvasAbstraction(1, 1);
        this.canvas_bold.set_font_property_bold(true);

        this.canvas_italic = new CanvasAbstraction(1, 1);
        this.canvas_italic.set_font_property_italic(true);

        this.canvas_italic_and_bold = new CanvasAbstraction(1, 1);
        this.canvas_italic_and_bold.set_font_property_bold(true);
        this.canvas_italic_and_bold.set_font_property_italic(true);
    },

    get_width_of_text_given_bounding_height: function(text, height) {
        this.canvas_regular.set_height(height);
        this.canvas_regular.update_font();
        let w = this.canvas_regular.get_text_width_for_texture(text);
        return get_nearest_power_of_two_for_number(w);
    },

    get_width_of_bold_text_given_bounding_height: function(text, height) {
        this.canvas_bold.set_height(height);
        this.canvas_bold.update_font();
        let w = this.canvas_bold.get_text_width_for_texture(text);
        return get_nearest_power_of_two_for_number(w);
    },

    get_width_of_italic_text_given_bounding_height: function(text, height) {
        this.canvas_italic.set_height(height);
        this.canvas_italic.update_font();
        let w = this.canvas_italic.get_text_width_for_texture(text);
        return get_nearest_power_of_two_for_number(w);
    },

    get_width_of_italic_and_bold_text_given_bounding_height: function(text, height) {
        this.canvas_italic_and_bold.set_height(height);
        this.canvas_italic_and_bold.update_font();
        let w = this.canvas_italic_and_bold.get_text_width_for_texture(text);
        return get_nearest_power_of_two_for_number(w);
    }
};