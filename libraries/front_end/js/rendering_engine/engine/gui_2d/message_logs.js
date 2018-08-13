'use strict';

$_QE.prototype.GUI2DMessageLogs = function(number_of_rows) {

    $_QE.prototype.FeatureColor.call(this, COLOR_GREEN, null);

    $_QE.prototype.CanvasGUI2D.call(this, 'gui_2D_logs', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);

    this.initialize_gui(800, 600, 0, 10, null, null, true, QE.CANVAS_FONT_SMALLER);
    $_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, false);

    this.add_text_line_to_bottom('Nexus Local!', QE.COLOR_CANVAS_GREEN);

    QE.add_gui_2d_element(this);
};