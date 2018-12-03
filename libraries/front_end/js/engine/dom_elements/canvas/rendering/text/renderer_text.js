'use strict';

$_QE.prototype.CanvasRendererText = function() {};

Object.assign(
    $_QE.prototype.CanvasRendererText.prototype,
    $_QE.prototype.CanvasRenderer.prototype,
    {
        __init__renderer_text: function(args) {
            this.__init__canvas_renderer(TEXT_ALIGNMENT_START);

            if (args[ARG_NUMBER_OF_ROWS] != -1) {
                this.rows = [];
            }

            this.set_canvas_font(args[ARG_FONT]);
            this.__init__visible_rows(args[ARG_NUMBER_OF_ROWS], args[ARG_WIDTH]);

        },

        __init__visible_rows: function(number_of_visible_rows, width) {
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
                this._render_needed = false;

                //this._context.save();

                this._render_clear();
                this._render_background();
                this._render_foreground();
                this._render_end();

                //this._context.restore();

                //
                if (this.texture != null) {
                    this.texture.needsUpdate = true;
                }
                if (this.material != null) {
                    //this.material.needsUpdate = true;
                }
                //

                return true;
            }
            return false;
        },

    }
);


