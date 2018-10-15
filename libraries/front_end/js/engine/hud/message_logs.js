'use strict';

$_QE.prototype.GUI2DMessageLogs = function(number_of_rows) {

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_GREEN, null);

    $_QE.prototype.CanvasGUI2D.call(this, GLOBAL_ID_HUD_CHAT, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);

    this.initialize_gui(800, 600, 0, 10, null, null, true, QE.CANVAS_FONT_SMALLER);
    $_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, false);

    this.add_text_line_to_bottom('Nexus Local!', COLOR_CANVAS_GREEN);
};