'use strict';

$_QE.prototype.CanvasRenderingTextLines = function(max_rows, bottom_row_as_input) {
    $_QE.prototype.CanvasRendering.call(this);
    $_QE.prototype.FeatureTextLines.call(this, max_rows, bottom_row_as_input);

    this._render_needed = function() {
        let l;
        let render_needed = false;
        for (l = 0; l < this.rows.length; l++) {
            if (this.rows[l].update_needed_for_line) {
                render_needed = true;
            }
        }
        //if (render_needed) {
        //    this.calculate_segment_offsets();
        //}
        return render_needed;
    };

    this._post_render = function() {
        let l;
        for (l = 0; l < this.rows.length; l++) {
            this.rows[l].update_needed_for_line = false;
        }
    };

    this._clear_out = function() {
        let r;
        //this.context.fillStyle = '#ffffff';
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].update_needed_for_line) {
                l('Clearing line {' + r + '}');
                this.context.clearRect(0, Math.floor(this._canvas_height - (this.canvas_font_size * (r + 2)) - this.canvas_font_offset * (r + 2)), this._canvas_width, this.canvas_font_size + this.canvas_font_offset);
            }
        }
        if (this.feature_needs_mobile_keyboard) {
            this.context.clearRect(0, this._canvas_height - this.canvas_font_size - this.canvas_font_offset, this._canvas_width, this.canvas_font_size + this.canvas_font_offset);
        }
    };

    this._render = function() {
        //this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);

        let r;

        // First draw backgrounds if needed.
        this._clear_out();
        if (this.current_background_color !== null) {
            this.context.fillStyle = this.current_background_color;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed_for_line) {
                    this.context.fillRect(0, Math.floor(this._canvas_height - (this.canvas_font_size * (r + 2)) - this.canvas_font_offset * (r + 2)), this._canvas_width, this.canvas_font_size + this.canvas_font_offset);
                }
            }
            if (this.feature_needs_mobile_keyboard) {
                this.context.fillRect(0, this._canvas_height - this.canvas_font_size - this.canvas_font_offset, this._canvas_width, this.canvas_font_size + this.canvas_font_offset);
            }
        }

        // Draw any green text.
        this.context.fillStyle = QE.COLOR_CANVAS_GREEN;
        for (r = 0; r < this.rows.length; r++) {
            //this.context.fillText(this.rows[r].content, 0, this._canvas_height - (this.canvas_font_size * (r + 1)) - (this.canvas_font_offset * (r + 1 + 1)));
            //this.context.fillText(r, 0, this._canvas_height - (this.canvas_font_size * (r + 1)) - (this.canvas_font_offset * (r + 1 + 1)));

            let s = this.rows[r].get_segments_for_color(QE.COLOR_CANVAS_GREEN);
            let i;
            //console.log(s);
            for (i = 0; i < s.length; i++) {
                this.context.fillText(s[i], 0, Math.floor(this._canvas_height - (this.canvas_font_size * (r + 1)) - (this.canvas_font_offset * (r + 1 + 1))));
            }
        }

        // Draw any yellow text.
        this.context.fillStyle = QE.COLOR_CANVAS_YELLOW;
        for (r = 0; r < this.rows.length; r++) {

        }

        // Draw any teal text.
        this.context.fillStyle = QE.COLOR_CANVAS_TEAL;
        for (r = 0; r < this.rows.length; r++) {
            let s = this.rows[r].get_segments_for_color(QE.COLOR_CANVAS_TEAL);
            let i;
            //console.log(s);
            for (i = 0; i < s.length; i++) {
                //l('Teal text {' + s[i] + '}');
                this.context.fillText(s[i], 0, Math.floor(this._canvas_height - (this.canvas_font_size * (r + 1)) - (this.canvas_font_offset * (r + 1 + 1))));
            }
            //l('--------');
        }
        if (this.feature_needs_mobile_keyboard) {
            //this.context.fillText(this.text, 0, this.canvas_font[CANVAS_FONT_INDEX_SIZE] - this.canvas_font[CANVAS_FONT_INDEX_OFFSET]);
            this.context.fillText(this.text, 0, this._canvas_height - this.canvas_font_offset);
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