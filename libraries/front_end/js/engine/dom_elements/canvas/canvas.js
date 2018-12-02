'use strict';

$_QE.prototype.DomCanvas = function() {};

Object.assign(
    $_QE.prototype.DomCanvas.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        // _canvas_width
        // _canvas_height

        __init__internal_canvas: function(_id=null, display_style=null) {
            this.__init__internal('canvas', _id, display_style);
            this.set_canvas_context();
            return this;
        },

        __init__external_canvas: function(_id, display_style) {
            this.__init__external(_id, display_style);
            this.set_canvas_context();
            return this;
        },

        save_as_image: function(image_name) {
            QE.manager_canvas.download_canvas(this._element, image_name);
        },

        set_canvas_dimensions: function(w, h) {
            this.set_canvas_width(w);
            this.set_canvas_height(h);
        },

        set_canvas_width: function(w) {
            if (this._canvas_width != w) {
                this._element.width = w;
                this._canvas_width  = w;
            }
        },

        set_canvas_height: function(h) {
            if (this._canvas_height != h) {
                this._element.height = h;
                this._canvas_height  = h;
            }
        },

        set_canvas_context: function() {
            this._context = this._element.getContext('2d');
        },

        set_canvas_font: function(font) {
            if (this._context == null) {
                QE.log_warning('Tried setting font for canvas whose context is currently null!', this);
            }
            if (font == null) {
                // Default font.
                font = QE.FONT_ARIAL_16;
            }
            if (this.font == null || (this.font != null && this.font != font)) {
                this.font = font;
            }
            if (this._context.font != this.font.font_as_string) {
                this._context.font = this.font.font_as_string;
            }
        },

        set_canvas_render_style: function(render_style) {
            this._context.globalCompositeOperation = render_style;
        },

    }
);


/*
Useful but not currently used:

        _offset_left   : null,
        _offset_right  : null,
        _offset_top    : null,

        set_left_offset: function(o) {
            if (this._offset_left != o) {
                this._element.style.left = o + '%';
                this._offset_left        = o;
            }
        },

        set_top_offset: function(o) {
            if (this._offset_top != o) {
                this._element.style.top = o + '%';
                this._offset_top        = o;
            }
        },

 */