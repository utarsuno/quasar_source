'use strict';

$_QE.prototype.CanvasRenderingTextLines = function(max_rows, bottom_row_as_input) {
    $_QE.prototype.CanvasRendering.call(this);
    $_QE.prototype.FeatureTextLines.call(this, max_rows, bottom_row_as_input);

    this._render_needed = function() {
        if (this.update_needed_for_line) {
            return true;
        }
        let l;
        for (l = 0; l < this.rows.length; l++) {
            if (this.rows[l].update_needed_for_line) {
                return true;
            }
        }
        return false;
    };

    this._post_render = function() {
        let l;
        for (l = 0; l < this.rows.length; l++) {
            this.rows[l].update_needed_for_line = false;
        }
        this.update_needed_for_line = false;
    };

    this._render = function() {
        //this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);

        let r;

        // Pre-compute common calculations.
        let canvas_height_minus_y_offset = this._canvas_height - this.canvas_font_offset * 2;
        let canvas_font_total_height     = this.canvas_font_size + this.canvas_font_offset;
        let canvas_draw_y_offset_start   = this._canvas_height - this.canvas_font_size - (this.canvas_font_offset * 2);

        let row_y_offset                 = this._canvas_height - this.canvas_font_size - this.canvas_font_offset;


        // Clear pixels in rows that are needed to be rendered.
        let in_batch_clear = false;
        let batch_y_start  = null;
        let batch_y_end    = null;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].update_needed_for_line) {
                if (!in_batch_clear) {
                    in_batch_clear = true;
                    batch_y_start = row_y_offset - this.canvas_font_size * r - this.canvas_font_offset * r;
                }
            } else {
                if (in_batch_clear) {
                    in_batch_clear = false;
                    batch_y_end = row_y_offset - this.canvas_font_size * r - this.canvas_font_offset * r;
                    this.context.clearRect(0, batch_y_end, this._canvas_width, batch_y_start - batch_y_end);
                }
            }
        }
        if (in_batch_clear) {
            batch_y_end = row_y_offset - this.canvas_font_size * r - this.canvas_font_offset * r;
            this.context.clearRect(0, batch_y_end, this._canvas_width, batch_y_start - batch_y_end);
        }
        if (this.feature_typing) {
            this.context.clearRect(0, canvas_height_minus_y_offset - this.canvas_font_size, this._canvas_width, canvas_font_total_height);
        }


        // Draw backgrounds if needed.
        if (this.current_background_color !== null) {
            this.context.fillStyle = this.current_background_color;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed_for_line) {
                    this.context.fillRect(0, Math.floor(canvas_draw_y_offset_start - this.canvas_font_size * (r + 1) - this.canvas_font_offset * (r + 1)), this._canvas_width, canvas_font_total_height);
                }
            }
            if (this.feature_typing) {
                this.context.fillRect(0, canvas_height_minus_y_offset - this.canvas_font_size, this._canvas_width, canvas_font_total_height);
            }
        }

        // Draw any green text.
        this.context.fillStyle = QE.COLOR_CANVAS_GREEN;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].update_needed_for_line) {
                let s = this.rows[r].get_segments_for_color(QE.COLOR_CANVAS_GREEN);
                let i;
                for (i = 0; i < s.length; i++) {
                    this.context.fillText(s[i], 0, canvas_draw_y_offset_start - this.canvas_font_size * r - this.canvas_font_offset * r);
                }
            }
        }

        // Draw any yellow text.
        this.context.fillStyle = QE.COLOR_CANVAS_YELLOW;
        for (r = 0; r < this.rows.length; r++) {

        }

        // Draw any teal text.
        this.context.fillStyle = QE.COLOR_CANVAS_TEAL;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].update_needed_for_line) {
                let s = this.rows[r].get_segments_for_color(QE.COLOR_CANVAS_TEAL);
                let i;
                for (i = 0; i < s.length; i++) {
                    this.context.fillText(s[i], 0, Math.floor(canvas_draw_y_offset_start - this.canvas_font_size * r - this.canvas_font_offset * r));
                }
            }
        }
        if (this.feature_typing) {
            this.context.fillText(this.text, 0, canvas_height_minus_y_offset);
        }
    };


};


/*
    this._render_rows = function() {
        let row_offset = 0;
        if (is_defined(this.leave_bottom_row_for_input)) {
            if (this.leave_bottom_row_for_input) {
                row_offset += 1;
            }
        }
        let r;
        for (r = 0; r < this.rows.length; r++) {
            this.context.fillText(this.rows[r].content, 0, this._canvas_height - (this.font_size * (r + row_offset)) - (this.font_y_offset * (r + 1 + row_offset)));
        }
        // Render the user's input.
        if (row_offset > 0) {
            this.context.fillText(this.text, 0, this._canvas_height - (this.font_y_offset));
        }
    };

 */