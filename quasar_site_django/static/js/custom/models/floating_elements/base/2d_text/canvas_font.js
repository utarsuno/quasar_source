'use strict';

function CanvasFont() {

    this.smudge_factor = 0.85;

    this.text_property_bold     = false;
    this.text_property_italic   = false;
    this.text_property_centered = false;

    this.font = null;

    this.set_font_property_bold = function(is_bold) {
        this.text_property_bold  = is_bold;
    };

    this.set_font_property_italic = function(is_italic) {
        this.text_property_italic = is_italic;
    };

    this.set_text_property_centered = function(is_centered) {
        this.text_property_centered = is_centered;
    };

    this.set_font = function() {
        this.font_size = int(this.height * this.smudge_factor);
        let additional_properties = '';
        if (this.text_property_italic) {
            additional_properties += 'italic ';
        }
        if (this.text_property_bold) {
            additional_properties += 'bold ';
        }
        this.font = additional_properties + str(this.font_size) + 'px Arial';
        //l('Font is : {' + this.font + '}');
        this.context.font = this.font;
    };
}