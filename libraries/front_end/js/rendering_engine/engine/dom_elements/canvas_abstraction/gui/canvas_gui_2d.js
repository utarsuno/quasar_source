'use strict';

$_QE.prototype.CanvasGUI2D = function(unique_name, type, rendering_style) {

    $_QE.prototype.CanvasTexture.call(this, unique_name, type, rendering_style);

    this.initialize_gui = function(x, y, optional_class_to_add) {
        this.add_class('gui_canvas');
        if (is_defined(optional_class_to_add)) {
            this.add_class(optional_class_to_add);
        }
        this.append_to_document_body();
        this.set_screen_x(x);
        this.set_screen_y(y);
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


