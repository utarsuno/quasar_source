'use strict';

$_QE.prototype.CanvasRenderingTextLine = function(row_number, container) {
};

Object.assign(
    $_QE.prototype.CanvasRenderingTextLine.prototype,
    {
        /////
        render_row: function(context) {
            context.fillText(this.text, 0, this.y_start - this.font.offset);
        },
        /////

        _render_needed: function() {
            return this.update_needed_for_line;
        },

        _post_render: function() {
            this.texture.needsUpdate    = true;
            this.update_needed_for_line = false;
        },

        _render: function() {
            this.context.clearRect(0, 0, this._canvas_width, this._canvas_height);
            this.context.fillStyle = COLOR_CANVAS_TEAL;
            this.context.fillText(this.text, 0, this.font.height - this.font.offset);
        },
    }
);


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
