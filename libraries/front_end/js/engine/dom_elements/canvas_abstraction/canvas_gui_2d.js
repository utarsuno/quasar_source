'use strict';

$_QE.prototype.CanvasGUI2D = function(unique_name, type_dom, type_canvas) {
    $_QE.prototype.DomElementCanvas.call(this, unique_name, type_dom, type_canvas);

    this.initialize_gui = function(width, height, x, y, optional_class_to_add, hide, append, font) {
        this.create_element();
        if (is_defined(hide)) {
            if (hide) {
                this.hide();
            }
        }

        this.set_canvas_width(width);
        this.set_canvas_height(height);

        $_QE.prototype.CanvasTexture.call(this, this._element, font);

        this.initialize_texture();

        if (is_defined(x)) {
            this.set_left_offset(x);
        }
        if (is_defined(y)) {
            this.set_top_offset(y);
        }

        this.add_class('gui_canvas');
        if (is_defined(optional_class_to_add)) {
            this.add_class(optional_class_to_add);
        }

        if (is_defined(append)) {
            if (append) {
                this.append_to_document_body();
            }
        } else {
            this.append_to_document_body();
        }
    };

};
