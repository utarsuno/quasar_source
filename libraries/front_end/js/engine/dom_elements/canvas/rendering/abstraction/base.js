'use strict';

$_QE.prototype.CanvasRenderer = function() {};

$_QE.prototype.CanvasRenderer.prototype = {

    /* Dynamic fields:

    _render_needed      : {bool}
    _current_fill_color : {color}
    _text_alignment     : {TEXT_ALIGNMENT_START, TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_END}

    // TODO: Formalize support:
    _require_border     : {bool}
     */

    _set_text_alignment: function(text_alignment) {
        if (this._text_alignment != text_alignment) {
            this._text_alignment = text_alignment;
            switch (this._text_alignment) {
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
            this._render_needed = true;
        }
    },

    _fill_background: function() {
        this._set_color(this.current_background_color);
        this._fill_canvas();
    },

    _set_color: function(c) {
        if (this._current_fill_color != c && c != null) {
            this._current_fill_color = c;
            this.context.fillStyle   = c;
        }
    },

    _fill_canvas: function() {
        this.context.fillRect(0, 0, this.width, this.height);
    },

    _clear_canvas: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },

};
