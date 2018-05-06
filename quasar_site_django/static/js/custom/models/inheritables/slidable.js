'use strict';

function Slideable() {
    // Used for sliders.
    this.requires_mouse_x_movement      = false;
    this.requires_mouse_y_movement      = false;

    /* __          __   ___  __      __   __       ___  __   __        __
      /__` |    | |  \ |__  |__)    /  ` /  \ |\ |  |  |__) /  \ |    /__`
      .__/ |___ | |__/ |___ |  \    \__, \__/ | \|  |  |  \ \__/ |___ .__/ */

    this.bind_slider_delta_x_functions = function(increase_function, decrease_function) {
        this.slider_x_increase_function = increase_function;
        this.slider_x_decrease_function = decrease_function;
    };

    this.bind_slider_delta_y_functions = function(increase_function, decrease_function) {
        this.slider_y_increase_function = increase_function;
        this.slider_y_decrease_function = decrease_function;
    };

    this.provide_mouse_x_movement = function(movement_x) {
        if (movement_x > 0) {
            if (is_defined(this.slider_x_increase_function)) {
                this.slider_x_increase_function();
            }
        } else if (movement_x < 0) {
            if (is_defined(this.slider_x_decrease_function)) {
                this.slider_x_decrease_function();
            }
        }
    };

    this.provide_mouse_y_movement = function(movement_y) {
        if (movement_y > 0) {
            if (is_defined(this.slider_y_increase_function)) {
                this.slider_y_increase_function();
            }
        } else if (movement_y < 0) {
            if (is_defined(this.slider_y_decrease_function)) {
                this.slider_y_decrease_function();
            }
        }
    };

}