'use strict';

function Interactive() {

    // Settings.
    this.needs_engage_for_parsing_input = true;
    this.maintain_engage_when_tabbed_to = true;
    this.engable                        = true;
    this.uses_cursor                    = true;

    this.only_used_for_blocking_input   = false;

    this.maintain_engage_until_right_click = false;

    // Used for sliders.
    this.requires_mouse_x_movement      = false;
    this.requires_mouse_y_movement      = false;

    // Function events.
    this.engage_function    = null;
    this.disengage_function = null;
    this.look_at_function   = null;
    this.look_away_function = null;

    // States.
    this.being_looked_at    = false;
    this.being_engaged_with = false;

    // Next table target pointer.
    this.next_tab_target    = null;

    this.look_away = function() {
        if (!this.only_used_for_blocking_input) {
            this.being_looked_at = false;
            this.state_change_look_at(false);
            if (is_defined(this.look_away_function)) {
                this.look_away_function();
            }
        }
        if (this.being_engaged_with) {
            this.being_engaged_with = false;
        }
    };

    this.look_at = function() {
        if (!this.only_used_for_blocking_input) {
            this.being_looked_at = true;
            this.state_change_look_at(true);
            if (is_defined(this.look_at_function)) {
                this.look_at_function();
            }
        }
    };

    this.disengage = function() {
        this.being_engaged_with = false;
        if (this.engable) {
            this.state_change_engage(false);
        }
        if (is_defined(this.disengage_function)) {
            this.disengage_function();
        }
    };

    this.is_engaged = function() {
        return this.being_engaged_with;
    };

    this.engage = function() {
        if (this.engable) {
            this.being_engaged_with = true;
            this.state_change_engage(true);
        }
        if (is_defined(this.engage_function)) {
            this.engage_function();
        }
    };

    this.set_engage_function = function(engage_function) {
        this.engage_function = engage_function;
    };

    this.set_disengage_function = function(disengage_function) {
        this.disengage_function = disengage_function;
    };

    this.set_look_at_function = function(look_at_function) {
        this.look_at_function = look_at_function;
    };

    this.set_look_away_function = function(look_away_function) {
        this.look_away_function = look_away_function;
    };

    this.set_next_tab_target = function(tab_target) {
        this.next_tab_target = tab_target;
    };

    this.set_value_pre_changed_function = function(value_pre_changed_function) {
        this.value_pre_changed_function = value_pre_changed_function;
    };

    this.set_value_post_changed_function = function(value_post_changed_function) {
        this.value_post_changed_function = value_post_changed_function;
    };

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
