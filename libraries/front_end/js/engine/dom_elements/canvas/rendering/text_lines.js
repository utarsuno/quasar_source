'use strict';

$_QE.prototype.CanvasRenderingTextLines = function() {};

Object.assign(
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.CanvasRendererText.prototype,
    {
        constructor : $_QE.prototype.CanvasRenderingTextLines,

        _initialize_renderer_text_reference_canvas: function(number_of_visible_rows, width, font, canvas_id) {
            this._initialize_renderer_text(font, number_of_visible_rows, canvas_id, false, width);
        },

        _initialize_renderer_text_internal_canvas: function(number_of_visible_rows, width, font, canvas_id) {
            this._initialize_renderer_text(font, number_of_visible_rows, canvas_id, true, width);
        },

        _render_end: function() {
            let l;
            for (l = 0; l < this.rows.length; l++) {
                this.rows[l].update_needed = false;
            }
            this.num_batches = 0;
        },

        _render_start: function() {
            let r;
            let in_batch = false;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    if (!in_batch) {
                        // Start of next batch.
                        in_batch = true;
                        this.batches[this.num_batches * 2]     = this.rows[r].y_start;
                        this.batches[this.num_batches * 2 + 1] = this.rows[r].y_start - this.rows[r].font.height;
                    } else {
                        // Continuation of current batch.
                        this.batches[this.num_batches * 2 + 1] = this.rows[r].y_start - this.rows[r].font.height;
                    }
                } else {
                    if (in_batch) {
                        // End of current batch.
                        in_batch = false;
                        this.num_batches += 1;
                    }
                }
            }
            if (in_batch) {
                // End of current (the last) batch.
                this.num_batches += 1;
            }
        },

        _render_clear: function() {
            let b;
            for (b = 0; b < this.num_batches; b++) {
                this.context.clearRect(0, this.batches[1 + b * 2], this.width, this.batches[b * 2]);
            }
        },

        _render_background: function() {
            if (this.current_background_color != null) {
                this._set_color(this.current_background_color);
                let b;
                for (b = 0; b < this.num_batches; b++) {
                    this.context.fillRect(0, this.batches[1 + b * 2], this.width, this.batches[b * 2]);
                }
            }
        },

        _render_foreground: function() {
            let r;
            this._set_color(COLOR_CANVAS_GREEN);
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    this.rows[r].render();
                }
            }
        },

        shift_rows_up: function() {
            let r;
            for (r = this.rows.length - 2; r > -1; r--) {
                this.rows[r + 1].set_text(this.rows[r].text);
            }
        },

        set_bottom_row: function(text) {
            this.rows[0].set_text(text);
        },

    }
);
