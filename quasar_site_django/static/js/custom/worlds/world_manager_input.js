'use strict';

function WorldManagerInput() {

    this._left_click_clock = new THREE.Clock(false);
    this._left_click_previous_start_time = null;

    this.left_click_up = function() {
        if (CURRENT_CLIENT.is_vr) {
            if (!CURRENT_PLAYER.is_paused()) {
                if (this._left_click_previous_start_time === null) {
                    this._left_click_previous_start_time = this._left_click_clock.startTime;
                } else {
                    if (this._left_click_clock.startTime - this._left_click_start_time_previous <= 400.0) {
                        this.right_click_down();
                    }
                    this._left_click_start_time_previous = this._left_click_clock.startTime;
                }
            }
        }

        if (CURRENT_PLAYER.has_input()) {

            if (this.current_world.floating_cursor._currently_engaged) {
                this.current_world.floating_cursor.disengage();
            } else {
                this.current_world.single_left_click();
            }

        } else {
            if (CURRENT_PLAYER.is_paused()) {
                if (this._left_click_previous_start_time === null) {
                    this._left_click_previous_start_time = this._left_click_clock.startTime;
                } else {
                    if (this._left_click_clock.startTime - this._left_click_start_time_previous <= 400.0) {
                        CURRENT_PLAYER.set_state(PLAYER_STATE_FULL_CONTROL);
                    }
                    this._left_click_start_time_previous = this._left_click_clock.startTime;
                }
            }
        }
    };

    this.left_click_down = function() {
        if (CURRENT_PLAYER.is_paused() || CURRENT_CLIENT.is_vr) {
            this._left_click_clock.start();
        } else if (CURRENT_PLAYER.has_input()) {
            // Cursor engage.
            if (is_defined(this.current_world.floating_cursor.currently_attached_to)) {
                if (this.current_world.floating_cursor.currently_attached_to.scalable) {
                    this.current_world.floating_cursor.engage();
                }
            }
        }
    };

    this.middle_click_up = function() {
        if (MANAGER_POINTER_LOCK.pointer_is_locked) {
            MANAGER_POINTER_LOCK.release_pointer_lock();
        } else {
            MANAGER_POINTER_LOCK.request_pointer_lock();
        }
    };

    this.right_click_down = function () {
        if (CURRENT_PLAYER.has_input()) {

            // If the player has input and is NOT engaged AND the player menu is not visible then right clicking will make the PlayerMenu show up.

            let currently_looked_at_object = this.current_world.currently_looked_at_object;
            if (is_defined(currently_looked_at_object)) {
                if (currently_looked_at_object.is_engaged()) {
                    currently_looked_at_object.disengage();
                    if (CURRENT_PLAYER.is_engaged()) {
                        CURRENT_PLAYER.set_state(PLAYER_STATE_FULL_CONTROL);
                    }
                }
            } else {
                this.player_menu.toggle_visibility();
            }
        }
    };

    this.right_click_up = function() {
    };

    this.key_down_event = function(event) {
        if (CURRENT_PLAYER.in_typing_state()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                CURRENT_PLAYER.add_text_and_leave_typing_state();
            } else {
                CURRENT_CLIENT.key_down_event(event);
            }
        } else if (CURRENT_PLAYER.has_input()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                if (!CURRENT_PLAYER.engaged_with_object()) {
                    if (CURRENT_CLIENT.is_logged_in()) {
                        CURRENT_PLAYER.set_state(PLAYER_STATE_TYPING);
                    }
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

}
