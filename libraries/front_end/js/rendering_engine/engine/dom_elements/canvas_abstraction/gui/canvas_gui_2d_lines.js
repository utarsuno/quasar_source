'use strict';

$_QE.prototype.CanvasGUI2DLines = function(unique_name) {

    $_QE.prototype.CanvasGUI2D.call(this, unique_name, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    $_QE.prototype.CanvasFont.call(this, $_QE.prototype.CanvasFontPresets['console_font_smaller']);

    this.update_needed_for_text = false;

    this.rows = [];

    this.add_row = function(content) {
        this.rows.unshift(content);
        this.update_needed_for_text = true;
    };

    this.update = function() {
        if (this.update_needed_for_font) {
            this.update_font();
            this.render_rows();
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            return;
        }
        if (this.update_needed_for_text) {
            this.render_rows();
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            return;
        }
        if (this.update_needed_for_colors) {
            this.render_rows();
            this.update_needed_for_font   = false;
            this.update_needed_for_text   = false;
            this.update_needed_for_colors = false;
            return;
        }
    };
};