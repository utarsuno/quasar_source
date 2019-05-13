$_QE.prototype.CanvasRenderer = function() {};

$_QE.prototype.CanvasRenderer.prototype = {

    /* Dynamic fields:
    _render_needed      : {bool}
    _current_fill_color : {color}
    _text_alignment     : {TEXT_ALIGNMENT_START, TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_END}

    Optional fields:
    _set_font           : {obj}

     */

    __init__canvas_renderer: function(text_alignment) {
        this._render_needed      = false;
        this._current_fill_color = null;
        if (text_alignment != null) {
            this._text_alignment = text_alignment;
        } else {
            this._text_alignment = TEXT_ALIGNMENT_START;
        }
    },

    _set_font: function(font) {
        if (this.font !== font) {
            this.font = font;
        }
        if (this._context != null) {
            if (this._context.font !== font.font_as_string) {
                this._context.font = font.font_as_string;
            }
        }
    },

    _set_text_alignment: function(text_alignment) {
        if (this._text_alignment !== text_alignment) {
            this._text_alignment = text_alignment;
            switch (this._text_alignment) {
            case TEXT_ALIGNMENT_START:
                this._context.textAlign = 'start';
                break;
            case TEXT_ALIGNMENT_CENTER:
                this._context.textAlign = 'center';
                break;
            case TEXT_ALIGNMENT_END:
                this._context.textAlign = 'end';
                break;
            }
            this._render_needed = true;
        }
    },

    _set_color: function(c) {
        if (this._current_fill_color !== c && c != null) {
            this._current_fill_color = c;
            this._context.fillStyle = c;
        }
    },

    _canvas_set_color: function(c) {
        this._set_color(c);
    },

    _set_render_color: function(c) {
        if (c != null & (this._context.fillStyle != null && this._context.fillStyle !== c)) {
            this._context.fillStyle = c;
        }
    },

    // Row operations.
    _fill_row: function(y_top, height) {
        this._context.fillRect(0, y_top, this.width, height);
    },

    _clear_row: function(y_top, height) {
        this._context.clearRect(0, y_top, this.width, height);
    },

    // Canvas operations.
    _fill_canvas_background: function(c) {
        if (c != null) {
            this._set_color(c);
        } else {
            this._set_color(this.current_background_color);
        }
        this._fill_canvas();
    },

    _fill_canvas: function() {
        this._context.fillRect(0, 0, this.width, this.height);
    },

    _clear_canvas: function() {
        this._context.clearRect(0, 0, this.width, this.height);
    },
};
