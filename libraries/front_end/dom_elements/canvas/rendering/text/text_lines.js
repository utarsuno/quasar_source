'use strict';

$_QE.prototype.CanvasRenderingTextLines = function() {};

Object.assign(
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.CanvasRendererText.prototype,
    {
        constructor : $_QE.prototype.CanvasRenderingTextLines,

        _force_render_full: function() {
            let l;
            for (l = 0; l < this.rows.length; l++) {
                this.rows[l].update_needed = true;
            }
            this._render_clear();
            this._render_background();
            this._render_foreground();
            this._render_end();
        },

        _render_end: function() {
            let l;
            for (l = 0; l < this.rows.length; l++) {
                this.rows[l].update_needed = false;
            }
        },

        _render_clear: function() {
            let r;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    this.rows[r].clear_row();
                }
            }
        },

        _render_background: function() {
            if (this.current_background_color != null) {
                this._set_color(this.current_background_color);
                let r;
                for (r = 0; r < this.rows.length; r++) {
                    if (this.rows[r].update_needed) {
                        this.rows[r].fill_background();
                    }
                }
            }
        },

        _render_foreground: function() {
            let r;
            for (r = 0; r < this.rows.length; r++) {
                if (this.rows[r].update_needed) {
                    this.rows[r].render();
                }
            }
        },

        shift_rows_up: function() {
            let r;
            for (r = this.rows.length - 2; r > -1; r--) {
                this.rows[r + 1]._clone(this.rows[r]);
            }
        },

        set_bottom_row: function(text, color) {
            if (color != null) {
                this.rows[0].set_text(text, color);
            } else {
                this.rows[0].set_text(text, this.current_foreground_color);
            }
        },

        add_message_error: function(message) {
            this.add_message(message, QE.COLOR_RGB_RED_LIGHT);
        },

        add_message_warning: function(message) {
            this.add_message(message, QE.COLOR_RGB_YELLOW);
        },

        add_message: function(message, color) {
            this.shift_rows_up();
            if (color != null) {
                this.set_bottom_row(message, color);
            } else {
                this.set_bottom_row(message, QE.COLOR_RGB_GREEN_LIGHT);
            }
        },

    }
);
