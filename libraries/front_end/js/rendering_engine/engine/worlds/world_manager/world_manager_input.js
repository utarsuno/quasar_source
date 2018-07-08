'use strict';

$_QE.prototype.WorldManagerInput = function() {
    this._left_click_clock = new THREE.Clock(false);
    this._left_click_previous_start_time = null;

    this.left_click_up = function() {
        if (this.player.has_input()) {

            //if (this.current_world.floating_cursor._currently_engaged) {
            //    this.current_world.floating_cursor.disengage();
            //} else {
            this.current_world.single_left_click();
            //}

        } else {
            if (this.player.is_paused()) {
                if (this._left_click_previous_start_time === null) {
                    this._left_click_previous_start_time = this._left_click_clock.startTime;
                }
                if (this._left_click_clock.startTime - this._left_click_start_time_previous <= 400.0) {
                    this.player.set_state(PLAYER_STATE_FULL_CONTROL);
                }
                this._left_click_start_time_previous = this._left_click_clock.startTime;
            }
        }
    };

    this.left_click_down = function() {
        if (this.player.is_paused()) {
            this._left_click_clock.start();
        } else if (this.player.has_input()) {
            // Cursor engage.
            //if (is_defined(this.current_world.floating_cursor.currently_attached_to)) {
            //    if (this.current_world.floating_cursor.currently_attached_to.scalable) {
            //this.current_world.floating_cursor.engage();
            //   }
            //}
        }
    };

    this.middle_click_up = function() {
        l('Middle click up!');
        if (this.client.state_is_pointer_locked) {
            this.client.release_pointer_lock();
        } else {
            this.client.request_pointer_lock();
        }
    };

    this.right_click_down = function () {
        if (this.player.has_input()) {

            // If the player has input and is NOT engaged AND the player menu is not visible then right clicking will make the PlayerMenu show up.

            let currently_looked_at_object = this.current_world.currently_looked_at_object;
            if (is_defined(currently_looked_at_object)) {
                if (currently_looked_at_object.is_engaged()) {
                    currently_looked_at_object.disengage();
                    if (this.player.is_engaged()) {
                        this.player.set_state(PLAYER_STATE_FULL_CONTROL);
                    }
                }
            } else {
                //this.player_menu.toggle_visibility();
            }
        }
    };

    this.right_click_up = function() {
    };

    this.key_down_event = function(event) {
        if (this.player.in_typing_state()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                QE.gui_2d_typing.add_text_and_leave_typing_state();
            } else {
                QE.gui_2d_typing.parse_key_event(event);
            }
        } else if (this.player.has_input()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                if (!this.player.engaged_with_object()) {
                    this.player.set_state(PLAYER_STATE_TYPING);
                } else {
                    this._key_down_event(event);
                }
            } else {
                this._key_down_event(event);
            }
        }
    };

    this._key_down_event = function(event) {
        this.current_world.key_down_event_for_interactive_objects(event);
    };

    this.mobile_keyboard_event_key_press = function(key) {
        this.current_world.mobile_key_press(key);
    };

    this.mobile_keyboard_event_key_delete = function() {
        this.current_world.mobile_key_delete();
    };

    this.mobile_keyboard_close = function() {
        this.current_world.mobile_keyboard_close();
    };

};