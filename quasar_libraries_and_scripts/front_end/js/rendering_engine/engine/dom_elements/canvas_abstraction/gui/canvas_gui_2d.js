'use strict';

const CANVAS_GUI_2D_ABSOLUTE_PIXELS    = true;  // #pre-process_global_constant
const CANVAS_GUI_2D_RELATIVE_TO_SCREEN = false; // #pre-process_global_constant

$_QE.prototype.CanvasGUI2D = function(unique_name, type) {

    this._type = type;

    $_QE.prototype.DomElement.call(this, unique_name, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, DOM_ELEMENT_CANVAS, false);
    $_QE.prototype.CanvasColors.call(this);

    this._w = null;
    this._h = null;
    this._x = null;
    this._y = null;

    this.initialize = function(x, y, w, h) {
        this.create_element();
        this.add_class('gui_canvas');
        this.append_to_document_body();
        $_QE.prototype.CanvasAbstraction.call(this, this._element);
        this.set_width(w);
        this.set_height(h);
        this.set_screen_x(x);
        this.set_screen_y(y);
    };

    this.set_width = function(w) {
        if (this._w !== w) {
            if (this._type === CANVAS_GUI_2D_ABSOLUTE_PIXELS) {
                this._element.style.width = w + 'px';
                this._w = w;
            } else {
                this._element.style.width = w + 'vw';
                this._w = (w / 100) * QE.client.state_window_width_inner;
            }
            this.canvas.width = this._w;
        }
    };

    this.set_height = function(h) {
        if (this._h !== h) {
            if (this._type === CANVAS_GUI_2D_ABSOLUTE_PIXELS) {
                this._element.style.height = h + 'px';
                this._h = h;
            } else {
                this._element.style.height = h + 'vh';
                this._h = (h / 100) * QE.client.state_window_height_inner;
            }
            this.canvas.height = this._h;
        }
    };

    this.set_screen_x = function(x) {
        if (this._x !== x) {
            this._element.style.top = x + '%';
            this._x = x;
        }
    };

    this.set_screen_y = function(y) {
        if (this._y !== y) {
            this._element.style.left = y + '%';
            this._y = y;
        }
    };

};



// this.width = get_next_highest_power_of_two(width * 2);


