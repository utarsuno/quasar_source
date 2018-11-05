'use strict';

$_QE.prototype.CanvasRendererText = function() {};

Object.assign(
    $_QE.prototype.CanvasRendererText.prototype,
    $_QE.prototype.CanvasRenderer.prototype,
    {
        _set_font: function(font) {
            if (this.context.font != font.font_as_string) {
                this.context.font = font.font_as_string;
            }
        },

        initialize_renderer_text: function(font, number_of_visible_rows, width) {
            this._render_needed      = true;
            this._current_fill_color = null;

            this.text_alignment      = TEXT_ALIGNMENT_START;
            this.font                = font;

            if (number_of_visible_rows != -1) {
                this.rows        = [];
                this.num_batches = 0;
                this.batches     = new Int32Array(number_of_visible_rows * 2);
            }

            this._initialize_visible_rows(number_of_visible_rows, width);

            this._set_context();
        },

        _initialize_visible_rows: function(number_of_visible_rows, width) {
            if (number_of_visible_rows == -1) {
                this.set_dimensions(width, this.font.height);
                this.row = new $_QE.prototype.VisibleRow(0, this);
            } else {
                this.set_dimensions(width, this.font.height * number_of_visible_rows);
                let r;
                for (r = 0; r < number_of_visible_rows; r++) {
                    this.rows.push(new $_QE.prototype.VisibleRow(r, this));
                }
            }
        },

        update: function() {
            if (this._render_needed) {
                this._render_start();
                this._render_clear();
                this._render_background();
                this._render_foreground();

                // TODO: eventually have this be a setting instead of having an if statement.
                if (this.texture != null) {
                    this.texture.needsUpdate = true;
                }

                //if (this.material != null) {
                //    this.material.needsUpdate = true;
                //}

                this._render_end();

                this._render_needed = false;

                return true;
            }
            return false;
        },
    }
);
