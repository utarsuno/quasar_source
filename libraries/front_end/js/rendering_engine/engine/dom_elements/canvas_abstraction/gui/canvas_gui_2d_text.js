'use strict';

$_QE.prototype.CanvasGUI2DText = function(unique_name, type) {

    $_QE.prototype.CanvasGUI2D.call(this, unique_name, type, CANVAS_RENDERING_SINGLE);
    $_QE.prototype.CanvasText.call(this, $_QE.prototype.CanvasFontPresets['console_font_smaller']);

    this.set_background_color(FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    this.get_text_then_clear = function() {
        let t;
        if (this.get_text_length_without_whitespaces() === 0) {
            t = null;
        } else {
            t = this.canvas_text;
        }
        this.set_text('');
        this.hide();
        return t;
    };
};