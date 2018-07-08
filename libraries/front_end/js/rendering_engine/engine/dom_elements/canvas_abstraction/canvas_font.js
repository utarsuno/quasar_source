'use strict';

const SMUDGE_FACTOR = 0.85; // #pre-process_global_constant

$_QE.prototype.CanvasFontPresets = {
    'console_font': ['20px Arial', 20, 4]
};

$_QE.prototype.CanvasFont = function(font) {
    this.font_preset            = font;
    this.text_property_bold     = null;
    this.text_property_italic   = null;
    this.text_property_centered = null;
    this.font                   = null;
    this.font_size              = this.font_preset[1];
    this.font_y_offset          = this.font_preset[2];
    this.update_needed_for_font = true;

    this.set_font_property_bold = function(is_bold) {
        if (this.text_property_bold !== is_bold) {
            this.text_property_bold     = is_bold;
            this.update_needed_for_font = true;
        }
    };

    this.set_font_property_italic = function(is_italic) {
        if (this.text_property_italic !== is_italic) {
            this.text_property_italic   = is_italic;
            this.update_needed_for_font = true;
        }
    };

    this.set_font_property_centered = function(is_centered) {
        if (this.text_property_centered !== is_centered) {
            this.text_property_centered = is_centered;
            this.update_needed_for_font = true;
        }
    };

    this.update_font = function() {
        if (this.update_needed_for_font) {

            //this.font_size = Math.floor(this.row_height * SMUDGE_FACTOR);

            if (this.text_property_bold && this.text_property_italic) {
                this.font = 'italic bold ' + this.font_preset[0];
            } else if (this.text_property_bold) {
                this.font = 'bold ' + this.font_preset[0];
            } else if (this.text_property_italic) {
                this.font = 'italic ' + this.font_preset[0];
            } else {
                this.font = this.font_preset[0];
            }

            this.context.font = this.font;
            this.update_needed_for_font = false;

            l('Set font to');
            l(this.context.font);
        }
    };

};