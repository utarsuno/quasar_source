'use strict';

$_QE.prototype.CanvasAbstraction = function(canvas) {

    if (!is_defined(canvas)) {
        this.canvas = document.createElement('canvas');
    } else {
        this.canvas  = canvas;
    }
    this.context = this.canvas.getContext('2d');

    $_QE.prototype.CanvasRendering.call(this);

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_width = function(text) {
        return this.context.measureText(text).width;
    };

};
