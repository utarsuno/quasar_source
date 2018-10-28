'use strict';

$_QE.prototype.CanvasRendererText = function() {};

$_QE.prototype.CanvasRendererText.prototype = {

    _initialize_renderer_text: function(font, number_of_visible_rows, canvas_id, canvas_is_internal, width) {
        this._render_needed      = true;
        this._current_fill_color = null;

        this.text_alignment      = TEXT_ALIGNMENT_START;
        this.font                = font;

        if (number_of_visible_rows != -1) {
            this.rows        = [];
            this.num_batches = 0;
            this.batches     = new Int32Array(number_of_visible_rows * 2);
        }

        if (canvas_is_internal) {
            this._set_canvas_as_internal(canvas_id);
        } else {
            this._set_canvas_as_reference(canvas_id);
        }

        this._initialize_visible_rows(number_of_visible_rows, width);

        if (canvas_is_internal) {
            this._initialize_as_new_canvas();
        } else {
            this._initialize_as_hud_from_reference();
        }
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

    _fill_background: function() {
        if (this.current_background_color != null) {
            this._set_color(this.current_background_color);
            this._fill_canvas();
        }
    },

    _fill_canvas: function() {
        this.context.fillRect(0, 0, this.width, this.height);
    },

    _clear_canvas: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },

    _set_color: function(c) {
        if (this._current_fill_color != c) {
            this._current_fill_color = c;
            this.context.fillStyle   = c;
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


};
