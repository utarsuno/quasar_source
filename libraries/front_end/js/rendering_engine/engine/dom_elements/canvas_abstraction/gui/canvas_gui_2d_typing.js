'use strict';

$_QE.prototype.CanvasGUI2DTyping = function(unique_name) {

    $_QE.prototype.CanvasGUI2DText.call(this, unique_name);

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
