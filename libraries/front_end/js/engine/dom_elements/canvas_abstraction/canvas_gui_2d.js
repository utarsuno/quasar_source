'use strict';

$_QE.prototype.CanvasGUI2D = function(unique_name, type_dom, type_canvas) {
    $_QE.prototype.DomElementCanvas.call(this, unique_name, type_dom, type_canvas);

    this.initialize_gui = function(width, height, x, y, optional_class_to_add, hide, append, font) {
        this.create_element();
        if (hide != null) {
            if (hide) {
                this.hide();
            }
        }

        this.set_canvas_width(width);
        this.set_canvas_height(height);

        $_QE.prototype.CanvasTexture.call(this, this._element, font);

        this.initialize_texture();

        if (x != null) {
            this.set_left_offset(x);
        }
        if (y != null) {
            this.set_top_offset(y);
        }

        this.add_class(GLOBAL_ID_GUI_CANVAS);
        if (optional_class_to_add != null) {
            this.add_class(optional_class_to_add);
        }

        if (append != null) {
            if (append) {
                this.append_to_document_body();
            }
        } else {
            this.append_to_document_body();
        }
    };

};
