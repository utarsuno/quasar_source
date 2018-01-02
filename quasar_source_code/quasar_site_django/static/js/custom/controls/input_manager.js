'use strict';

function InputManager() {
    this.__init__();
}

InputManager.prototype = {

    click_down_left   : null,
    click_down_right  : null,
    click_down_middle : null,

    __init__: function() {
    	this.click_down_left   = false;
    	this.click_down_right  = false;
    	this.click_down_middle = false;
    }

};