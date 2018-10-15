'use strict';

$_QE.prototype.CanvasRenderingTextLine = function(typeable, on_enter_event) {
    $_QE.prototype.CanvasRendering.call(this);
    $_QE.prototype.FeatureTextLine.call(this, typeable, on_enter_event);


    this._render_needed = function() {
        return this.update_needed_for_line;
    };

    this._post_render = function() {
        this.update_needed_for_line = false;
    };

    this._render = function() {
        this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);
        this.context.fillStyle = COLOR_CANVAS_TEAL;
        this.context.fillText(this.text, 0, this.canvas_font_size - this.canvas_font_offset);
    };

    this._render_segments = function() {

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
