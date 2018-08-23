'use strict';

$_QE.prototype.GUI2DDebugInformation = function() {

    $_QE.prototype.FeatureColor.call(this, COLOR_GREEN, null);

    $_QE.prototype.CanvasGUI2D.call(this, 'gui_2D_debug_information', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);

    this.width = 400;
    this.height = QE.CANVAS_FONT_SMALLER[1] * 2;
    this.initialize_gui(400, 64, 0, 0, null, false, true, QE.CANVAS_FONT_SMALLER);

    $_QE.prototype.CanvasRenderingTextLines.call(this, 3, false);

    this.add_text_line_to_bottom('fps', QE.COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('memory', QE.COLOR_CANVAS_GREEN);
    this.add_text_line_to_bottom('threejs', QE.COLOR_CANVAS_GREEN);


    //QE.add_gui_2d_element(this);
};