'use strict';

$_QE.prototype.ColorManager = function() {
    this.COLOR_CANVAS_GREEN  = 'rgb(157,255,113,0.75)'; // '#9dff71';
    this.COLOR_CANVAS_TEAL   = 'rgb(167,248,255,0.75)'; // '#a7f8ff';
    this.COLOR_CANVAS_YELLOW = 'rgb(242,255,102,0.75)'; // '#f2ff66';
    this.COLOR_CANVAS_GRAY   = 'rgb(41,41,41,0.45)'; // '#292929';

    /*
    this.COLOR_CANVAS_GREEN1 = new THREE.Color('#9dff71');
    this.COLOR_CANVAS_GREEN2 = new THREE.Color('#a7f8ff');
    this.COLOR_CANVAS_GREEN3 = new THREE.Color('#f2ff66');
    this.COLOR_CANVAS_GREEN4 = new THREE.Color('#292929');
    l(this.COLOR_CANVAS_GREEN1.getStyle());
    l(this.COLOR_CANVAS_GREEN2.getStyle());
    l(this.COLOR_CANVAS_GREEN3.getStyle());
    l(this.COLOR_CANVAS_GREEN4.getStyle());
    */


    this.COLOR_CANVAS_GREEN_INDEX  = 0;
    this.COLOR_CANVAS_TEAL_INDEX   = 1;
    this.COLOR_CANVAS_YELLOW_INDEX = 2;
    this.COLOR_CANVAS_GRAY_INDEX   = 3;
    this.COLOR_CANVAS_TABLE = [this.COLOR_CANVAS_GREEN, this.COLOR_CANVAS_TEAL, this.COLOR_CANVAS_YELLOW, this.COLOR_CANVAS_GRAY];
};


//this.context.fillStyle = '#' + this.current_foreground_color.getHexString();

