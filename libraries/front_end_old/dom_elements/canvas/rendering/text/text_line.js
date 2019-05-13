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

        _render_end: function() {
        },

        _render_clear: function() {
            this._clear_canvas();
        },

        _render_background: function() {
            if (this.current_background_color != null) {
                this._fill_canvas_background();
            }
        },

        _render_foreground: function() {
            this._set_color(this.current_foreground_color);
            this.row.render();
        },

        set_row_text: function(text) {
            // TODO:
            this.row.set_text(text);
            this._render_needed = true;
        },

    }
);
