'use strict';

$_QE.prototype.CanvasText = function(font) {
    $_QE.prototype.CanvasFont.call(this, font);

    this.canvas_text = null;
    this.update_needed_for_text = false;

    this.set_text = function(t) {
        if (this.canvas_text !== t) {
            this.update_needed_for_text = true;
            this.canvas_text = t;
        }
    };
};