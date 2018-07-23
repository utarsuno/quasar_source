'use strict';

$_QE.prototype.DomElementCanvas = function(data, type_dom, type_canvas) {
    this._canvas_type = type_canvas;
    $_QE.prototype.DomElement.call(this, data, type_dom, DOM_ELEMENT_CANVAS);
    this._offset_left = null;
    this._offset_top  = null;
    this._margin_top  = null;
    this._margin_left = null;

    this._canvas_width = null;
    this._canvas_height = null;

    this.set_canvas_width = function(w) {
        if (this._canvas_width !== w) {
            switch(this._canvas_type) {
            case CANVAS_GUI_2D_ABSOLUTE_PIXELS:
                this._element.width = w;
                this._canvas_width = w;
                break;
            case CANVAS_GUI_2D_RELATIVE_TO_SCREEN:
                this._element.style.width = w + 'vw';
                this._canvas_width = w;
                //this._w = (w / 100) * QE.client.state_window_width_inner;
                break;
            }
            //this.canvas.width = this._w;
        }
    };

    this.set_canvas_height = function(h) {
        if (this._canvas_height !== h) {
            switch(this._canvas_type) {
            case CANVAS_GUI_2D_ABSOLUTE_PIXELS:
                this._element.height = h;
                this._canvas_height = h;
                break;
            case CANVAS_GUI_2D_RELATIVE_TO_SCREEN:
                this._element.style.height = h + 'vh';
                this._canvas_height = h;
                //this._h = (h / 100) * QE.client.state_window_height_inner;
                break;
            }
            //this.canvas.height = this._h;
        }
    };

    this.set_left_offset = function(o) {
        if (this._offset_left !== o) {
            this._element.style.left = o + '%';
            this._offset_left = o;
        }
    };

    this.set_top_offset = function(o) {
        if (this._offset_top !== o) {
            this._element.style.top = o + '%';
            this._offset_top = o;
        }
    };

    this.set_margin_top = function(mt) {
        if (this._margin_top !== mt) {
            this._element.style.marginTop = mt + '%';
            this._margin_top = mt;
        }
    };

    this.set_margin_left = function(ml) {
        if (this._margin_left !== ml) {
            this._element.style.marginLeft = ml + '%';
            this._margin_left = ml;
        }
    };
};
