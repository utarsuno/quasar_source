'use strict';

function InputManager() {
    this.__init__();
}

InputManager.prototype = {

    click_down_left   : null,
    click_down_right  : null,
    click_down_middle : null,
    mouse_down	      : null,

    __init__: function() {
    	this.click_down_left   = false;
    	this.click_down_right  = false;
    	this.click_down_middle = false;
    	this.mouse_down	       = false;
    },

    set_left_click_to_down: function() {
    	this.mouse_down = true;
    	this.click_down_left = true;
    },

    set_right_click_to_down: function() {
    	this.mouse_down = true;
    	this.click_down_right = true;
    },

    set_middle_click_to_down: function() {
    	this.mouse_down = true;
    	this.click_down_middle = true;
    },

    set_left_click_to_up: function() {
    	if (!this.click_down_right && !this.click_down_middle) {
    		this.mouse_down = false;
    	}
    	this.click_down_left = false;
    },

    set_right_click_to_up: function() {
    	if (!this.click_down_left && !this.click_down_middle) {
    		this.mouse_down = false;
    	}
    	this.click_down_right = false;
    },

    set_middle_click_to_up: function() {
    	if (!this.click_down_left && !this.click_down_right) {
    		this.mouse_down = false;
    	}
    	this.click_down_middle = false;
    }

};