'use strict';

$_QE.prototype.CanvasGUI2DTexture = function(unique_name) {

    $_QE.prototype.DomElement.call(this, unique_name, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, DOM_ELEMENT_CANVAS, false);

    this._w = null;
    this._h = null;
    this._x = null;
    this._y = null;

    this.initialize = function(x, y, w, h) {
        this.create_element();
        this.add_class('gui_canvas');
        this.set_width(w);
        this.set_height(h);
        this.set_x(x);
        this.set_y(y);
        this.append_to_document_body();

        $_QE.prototype.CanvasAbstraction.call(this, this._element);
    };

    this.set_width = function(w) {
        if (this._w !== w) {
            this._element.style.width = w + 'px';
            this._w = w;
        }
    };

    this.set_height = function(h) {
        if (this._h !== h) {
            this._element.style.height = h + 'px';
            this._h = h;
        }
    };

    this.set_x = function(x) {
        if (this._x !== x) {
            this._element.style.top = x + 'px';
            this._x = x;
        }
    };

    this.set_y = function(y) {
        if (this._y !== y) {
            this._element.style.left = y + 'px';
            this._y = y;
        }
    };

};