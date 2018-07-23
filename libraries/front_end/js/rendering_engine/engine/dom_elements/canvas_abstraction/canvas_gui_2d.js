'use strict';

$_QE.prototype.CanvasGUI2D = function(unique_name, type_dom, type_canvas, type_rendering, font) {
    $_QE.prototype.DomElementCanvas.call(this, unique_name, type_dom, type_canvas);

    $_QE.prototype.CanvasFont.call(this, font);

    this.initialize_gui = function(width, height, x, y, optional_class_to_add) {
        this.create_element();

        this.set_canvas_width(width);
        this.set_canvas_height(height);

        $_QE.prototype.CanvasTexture.call(this, this._element);

        this.initialize_texture();

        this.set_left_offset(x);
        this.set_top_offset(y);

        this.add_class('gui_canvas');
        if (is_defined(optional_class_to_add)) {
            this.add_class(optional_class_to_add);
        }

        this.append_to_document_body();

        $_QE.prototype.CanvasRendering.call(this, type_rendering);
    };

};


// this.width = get_next_highest_power_of_two(width * 2);


