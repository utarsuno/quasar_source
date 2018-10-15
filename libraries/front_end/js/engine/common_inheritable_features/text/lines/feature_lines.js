'use strict';

$_QE.prototype.FeatureTextLines = function(max_rows, bottom_row_as_input, on_enter_event) {

    let self      = this;

    this.max_rows = max_rows;
    this.rows     = [];

    this.update_needed_for_line = false;
    this.bottom_row_as_input    = bottom_row_as_input;

    this.set_row_contents = function(row_index, content, color) {
        this.rows[row_index].set_content(content, color);
        //this.rows[row_index].update_needed_for_line = true;
    };

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
        $_QE.prototype.FeatureTyping.call(this, null, null, function() {
            self.update_needed_for_line = true;
        }, on_enter_event);
    }

};
