'use strict';

$_QE.prototype.CanvasRenderingTextLine = function() {};

Object.assign(
    $_QE.prototype.CanvasRenderingTextLine.prototype,
    $_QE.prototype.CanvasRendererText.prototype,
    {
        constructor : $_QE.prototype.CanvasRenderingTextLine,

        set_text_alignment: function(text_alignment) {
            this._set_text_alignment(text_alignment);
            this.row.set_text_alignment(text_alignment);
        },

        _render_start: function() {
            // TODO: check if context style has changed.
        },

        _render_end: function() {
        },

        _render_clear: function() {
            this._clear_canvas();
        },

        _render_background: function() {
            this._fill_background();
        },

        _render_foreground: function() {
            this._set_color(this.current_foreground_color);
            this.row.render();
        },

        set_row_text: function(text) {
            // TODO:
            this._render_needed = true;
            this.row.set_text(text);
        },

        set_bottom_row: function(text) {
            this.rows[0].set_text(text);
        },

    }
);
