'use strict';

$_QE.prototype.CanvasRenderingTextLines = function() {};

Object.assign(
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    {
        constructor : $_QE.prototype.CanvasRenderingTextLines,

        set_properties: function(number_of_visible_rows, width, font, canvas_id, create_dom_canvas=false) {
            this.text_alignment   = TEXT_ALIGNMENT_START;
            this.rows_need_update = false;
            this.font             = font;
            this.rows             = [];
            this.num_batches      = 0;
            this.batches          = new Int32Array(number_of_visible_rows * 2);
            if (!create_dom_canvas) {
                this.set_canvas_reference(canvas_id);
            } else {
                this.create_as_canvas(canvas_id);
            }
            this.set_dimensions(width, this.font.height * number_of_visible_rows);
            let r;
            for (r = 0; r < number_of_visible_rows; r++) {
                this.rows.push(new $_QE.prototype.VisibleRow(r, this));
            }
        },

        set_text_alignment: function(text_alignment) {
            if (this.text_alignment != text_alignment) {
                this.text_alignment = text_alignment;
                switch (this.text_alignment) {
                case TEXT_ALIGNMENT_START:
                    this.context.textAlign = 'start';
                    break;
                case TEXT_ALIGNMENT_CENTER:
                    this.context.textAlign = 'center';
                    break;
                case TEXT_ALIGNMENT_END:
                    this.context.textAlign = 'end';
                    break;
                }
            }
        },

        _post_render: function() {
            if (this.texture != null) {
                this.texture.needsUpdate = true;
            }
            //if (this.material != null) {
            //    this.material.needsUpdate = true;
            //}
            let l;
            for (l = 0; l < this.rows.length; l++) {
                this.rows[l].update_needed = false;
            }
            this.rows_need_update = false;
            this.num_batches      = 0;
        },

        _batches_calculate: function() {
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

        _batches_clear: function() {
            let b;
            for (b = 0; b < this.num_batches; b++) {
                this.context.clearRect(0, this.batches[1 + b * 2], this.width, this.batches[b * 2]);
            }
        },

        _batches_background: function() {
            if (this.current_background_color != null) {
                this.context.fillStyle = this.current_background_color;
                let b;
                for (b = 0; b < this.num_batches; b++) {
                    this.context.fillRect(0, this.batches[1 + b * 2], this.width, this.batches[b * 2]);
                }
            }
        },

        _batches_foreground: function() {
            let r;
            this.context.fillStyle = COLOR_CANVAS_GREEN;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    this.rows[r].render();
                }
            }
        },

        _render: function() {
            this._batches_calculate();
            this._batches_clear();
            this._batches_background();
            this._batches_foreground();
            this._post_render();
        },

        update: function() {
            if (this.rows_need_update) {
                this._render();
                this._post_render();
                return true;
            }
            return false;
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
