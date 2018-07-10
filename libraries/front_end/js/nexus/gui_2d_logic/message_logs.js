'use strict';

$_NL.prototype.GUI2DMessageLogs = function(number_of_rows) {

    this.gui_2d_logs = new $_QE.prototype.CanvasGUI2DLines('_gui_2d_logs', number_of_rows, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    this.gui_2d_logs.initialize(800, 800);
    this.gui_2d_logs.initialize_gui(0, 0);

    //this.gui_2d_logs.set_text('Hello World Text 2D!');
    this.gui_2d_logs.add_row('Nexus Local!');
    QE.add_gui_2d_element(this.gui_2d_logs);

};