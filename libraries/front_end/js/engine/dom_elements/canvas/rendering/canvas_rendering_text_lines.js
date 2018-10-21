'use strict';

$_QE.prototype.CanvasRenderingTextLines = function() {};

Object.assign(
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    {
        constructor : $_QE.prototype.CanvasRenderingTextLines,

        set_properties: function(number_of_visible_rows, width, font, canvas_id) {
            this.rows_need_update = false;
            this.batch_values     = new Int32Array(3);
            this.font             = font;
            this.rows             = [];
            this.set_canvas_reference(canvas_id);
            this.set_dimensions(width, this.font.height * number_of_visible_rows);
            let r;
            for (r = 0; r < number_of_visible_rows; r++) {
                this.rows.push(new $_QE.prototype.VisibleRow(r, this));
            }
        },

        _post_render: function() {
            //this.material.needsUpdate = true;
            this.texture.needsUpdate = true;
            let l;
            for (l = 0; l < this.rows.length; l++) {
                this.rows[l].update_needed = false;
            }
            this.rows_need_update = false;
        },

        _clear_updated_rows: function() {
            this.batch_values[0] = 0;
            this.batch_values[1] = -1;
            this.batch_values[2] = -1;
            let r;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    if (this.batch_values[0] == 0) {
                        // First row (in this batch) that needs to be cleared.
                        this.batch_values[0] = 1;
                        this.batch_values[1] = this.rows[r].y_start;
                        this.batch_values[2] = this.batch_values[1] - this.rows[r].font.height;
                    } else {
                        // Currently inside batch so update ending position.
                        this.batch_values[2] = this.rows[r].y_start - this.rows[r].font.height;
                    }
                } else {
                    if (this.batch_values[0] != 0) {
                        // Was inside of a batch so now clear it out.
                        this.batch_values[0] = 0;
                        this.context.clearRect(0, this.batch_values[2], this.width, this.batch_values[1]);
                    }
                }
            }
            if (this.batch_values[0] != 0) {
                // Was inside of a batch so now clear it out.
                this.context.clearRect(0, this.batch_values[2], this.width, this.batch_values[1]);
            }
        },

        _render: function () {
            this._clear_updated_rows();

            //this.context.fillStyle = this.current_background_color;
            //this.context.fillRect(0, 0, this._canvas_width / 2, this._canvas_height / 2);

            let r;
            this.context.fillStyle = COLOR_CANVAS_GREEN;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    this.rows[r].render();
                }
            }

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

    }
);
