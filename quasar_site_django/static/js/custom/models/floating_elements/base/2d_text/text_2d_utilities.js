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
        var h = get_nearest_power_of_two_for_number(height * 2) * 0.85;
        var ratio = parseFloat(h) / parseFloat(height);
        this.canvas_regular.set_height(height);
        this.canvas_regular.update_font();
        var w = this.canvas_regular.get_text_width_for_texture(text);

        return w * ratio;
    },

    get_width_of_bold_text_given_bounding_height: function(text, height) {
        var h = get_nearest_power_of_two_for_number(height * 2) * 0.85;
        var ratio = parseFloat(h) / parseFloat(height);
        this.canvas_bold.set_height(height);
        this.canvas_bold.update_font();
        var w = this.canvas_bold.get_text_width_for_texture(text);

        return w * ratio;
    },

    get_width_of_italic_text_given_bounding_height: function(text, height) {
        var h = get_nearest_power_of_two_for_number(height * 2) * 0.85;
        var ratio = parseFloat(h) / parseFloat(height);
        this.canvas_italic.set_height(height);
        this.canvas_italic.update_font();
        var w = this.canvas_italic.get_text_width_for_texture(text);

        //l('height{' + height + '}');
        //l('ratio{' + ratio + '}');
        l('w{' + w + '}');
        l('w * ratio{' + (w * ratio) + '}');

        var font_family = 'font-family: Arial';
        var font_size   = this.canvas_italic.font_size + 'px';
        var font_style  = 'italic';

        var div = document.createElement('div');
        div.id = text;
        div.style.fontFamily = font_family;
        div.style.fontSize = font_size;
        div.style.fontStyle = font_style;
        div.style.visibility = 'hidden';
        div.textContent = text;
        document.body.appendChild(div);
        var style = window.getComputedStyle(document.getElementById(text));
        l('THE ACTUAL WIDTH {' + document.getElementById(text).offsetWidth + '}');
        l('WHAT ABOUT THIS? {' + style.width + '}');
        //var box = div.getBBox();

        l('');

        return (w / 2);
    },

    get_width_of_italic_and_bold_text_given_bounding_height: function(text, height) {
        var h = get_nearest_power_of_two_for_number(height * 2) * 0.85;
        var ratio = parseFloat(h) / parseFloat(height);
        this.canvas_italic_and_bold.set_height(height);
        this.canvas_italic_and_bold.update_font();
        var w = this.canvas_italic_and_bold.get_text_width_for_texture(text);

        return w * ratio;
    }
};
