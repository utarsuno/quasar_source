'use strict';

$_QE.prototype.CanvasGUI2DLines = function(unique_name, number_of_rows) {

    $_QE.prototype.CanvasGUI2D.call(this, unique_name, CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ROWS);
    $_QE.prototype.CanvasLines.call(this, number_of_rows, $_QE.prototype.CanvasFontPresets['console_font_smaller']);

};