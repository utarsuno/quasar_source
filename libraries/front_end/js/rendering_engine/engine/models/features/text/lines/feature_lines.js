'use strict';

$_QE.prototype.FeatureTextLines = function(max_rows, bottom_row_as_input) {

    this.max_rows = max_rows;
    this.rows = [];

    this.bottom_row_as_input = bottom_row_as_input;

    this.add_text_line_to_bottom = function(content, color) {
        let new_text_line = new $_QE.prototype.FeatureTextLine(false);
        new_text_line.add_text_to_line(content, color);
        this.rows.unshift(new_text_line);

        let r;
        for (r = 0; r < this.rows.length; r++) {
            this.rows[r].update_needed_for_line = true;
        }

    };

    if (this.bottom_row_as_input) {
        $_QE.prototype.FeatureTyping.call(this);
    }

};

