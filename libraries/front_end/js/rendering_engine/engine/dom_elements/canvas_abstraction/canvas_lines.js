'use strict';

const SMUDGE_FACTOR = 0.85; // #pre-process_global_constant

$_QE.prototype.CanvasLines = function() {
    this.text_property_bold     = null;
    this.text_property_italic   = null;
    this.text_property_centered = null;
    this.font                   = null;
    this.needs_update           = false;

    this.set_font_property_bold = function(is_bold) {
        if (this.text_property_bold !== is_bold) {
            this.text_property_bold = is_bold;
            this.needs_update       = true;
        }
    };

    this.set_font_property_italic = function(is_italic) {
        if (this.text_property_italic !== is_italic) {
            this.text_property_italic = is_italic;
            this.needs_update         = true;
        }
    };

    this.set_font_property_centered = function(is_centered) {
        if (this.text_property_centered !== is_centered) {
            this.text_property_centered = is_centered;
            this.needs_update           = true;
        }
    };

    this.set_font = function(row_height) {
        if (this.needs_update) {

            this.font_size = Math.floor(row_height * SMUDGE_FACTOR);

            if (this.text_property_bold && this.text_property_italic) {
                this.font = 'italic bold ' + this.font_size.toString() + 'px Arial';
            } else if (this.text_property_bold) {
                this.font = 'bold ' + this.font_size.toString() + 'px Arial';
            } else if (this.text_property_italic) {
                this.font = 'italic ' + this.font_size.toString() + 'px Arial';
            } else {
                this.font = this.font_size.toString() + 'px Arial';
            }

            this.needs_update = false;
        }
    };
};