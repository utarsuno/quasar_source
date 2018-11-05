'use strict';

$_QE.prototype.DomCanvas = function() {};

Object.assign(
    $_QE.prototype.DomCanvas.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        //_canvas_width  : null,
        //_canvas_height : null,

        save_as_image: function(image_name) {
            QE.manager_canvas.download_canvas(this._element, image_name);
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