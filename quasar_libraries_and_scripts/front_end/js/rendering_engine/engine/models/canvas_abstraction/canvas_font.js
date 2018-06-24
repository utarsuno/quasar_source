'use strict';

const SMUDGE_FACTOR = 0.85; // #pre-process_global_constant

$_QE.prototype.CanvasFont = function() {
    this.text_property_bold     = false;
    this.text_property_italic   = false;
    this.text_property_centered = false;

    this.needs_update           = true;

    this.font = null;

    this.set_font_property_bold = function(is_bold) {
        this.text_property_bold = is_bold;
        this.needs_update       = true;
    };

    this.set_font_property_italic = function(is_italic) {
        this.text_property_italic = is_italic;
        this.needs_update         = true;
    };

    this.set_font_property_centered = function(is_centered) {
        this.text_property_centered = is_centered;
        this.needs_update           = true;
    };

    this.set_font = function() {
        if (this.needs_update) {

            if (is_defined(this.row_buffer)) {
                this.font_size = Math.floor((this.height / this.row_buffer.length) * SMUDGE_FACTOR);
            } else {
                this.font_size = Math.floor(this.height * SMUDGE_FACTOR);
            }

            let additional_properties = '';
            if (this.text_property_italic) {
                additional_properties += 'italic ';
            }
            if (this.text_property_bold) {
                additional_properties += 'bold ';
            }
            this.font = additional_properties + this.font_size.toString() + 'px Arial';
            l('Font is : {' + this.font + '}');
            this.context.font = this.font;
            this.needs_update = false;
        }
    };
};