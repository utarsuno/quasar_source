'use strict';

$_NL.prototype.GUI2DMessageLogs = function(number_of_rows) {

    $_QE.prototype.CanvasGUI2D.call(this, 'message_logs', CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ROWS);

    $_QE.prototype.FeatureTextLines.call(this, number_of_rows);
    $_QE.prototype.CanvasFont.call(this, $_QE.prototype.CanvasFontPresets['console_font_smaller']);

    //this.gui_2d_logs = new $_QE.prototype.CanvasGUI2DLines('_gui_2d_logs', number_of_rows, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    this.initialize(800, 800);
    this.initialize_gui(0, 0);

    //this.gui_2d_logs.set_text('Hello World Text 2D!');
    this.add_row('Nexus Local!');

    QE.add_gui_2d_element(this);

};