'use strict';

$_NL.prototype.GUI2DMessageLogs = function(number_of_rows) {

    $_QE.prototype.FeatureColor.call(this, COLOR_GREEN, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    $_QE.prototype.CanvasGUI2D.call(this, 'gui_2D_logs', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE,
        CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ROWS, $_QE.prototype.CanvasFontPresets['console_font_smaller']);

    $_QE.prototype.FeatureTextLines.call(this, number_of_rows);

    this.initialize_gui(800, 800, 0, 0);

    this.add_row('Nexus Local!');

    QE.add_gui_2d_element(this);

};