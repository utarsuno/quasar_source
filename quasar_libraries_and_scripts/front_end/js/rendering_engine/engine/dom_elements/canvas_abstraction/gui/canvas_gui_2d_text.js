'use strict';

$_QE.prototype.CanvasGUI2DText = function(unique_name) {

    $_QE.prototype.CanvasGUI2D.call(this, unique_name, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, DOM_ELEMENT_CANVAS, false);
    $_QE.prototype.CanvasText.call(this, $_QE.prototype.CanvasFontPresets['console_font']);

    this.update = function() {
        if (this.update_needed_for_font) {
            this.update_font();
            this.render();
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            return;
        }
        if (this.update_needed_for_text) {
            this.render();
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            return;
        }
        if (this.update_needed_for_colors) {
            this.render();
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            return;
        }
    };
};