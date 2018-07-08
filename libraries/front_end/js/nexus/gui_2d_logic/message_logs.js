'use strict';

$_NL.prototype.GUI2DMessageLogs = function() {

    this.gui_2d_logs = new $_QE.prototype.CanvasGUI2DLines('_gui_2d_logs');
    this.gui_2d_logs.initialize(0, 0, 800, 800);
    //this.gui_2d_logs.set_text('Hello World Text 2D!');
    this.gui_2d_logs.add_row('Nexus Local!');
    QE.add_gui_2d_element(this.gui_2d_logs);

};