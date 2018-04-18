'use strict';

function WorldManagerInput() {

    this._left_click_buffer = [];

    this.left_click_up = function() {
        if (CURRENT_PLAYER.has_input()) {

            if (this.current_world.floating_cursor._currently_engaged) {
                this.current_world.floating_cursor.disengage();
            } else {
                this.current_world.single_left_click();
            }

        } else {
            if (CURRENT_PLAYER.is_paused() && this._left_click_buffer.length > 1) {
                CURRENT_PLAYER.set_state(PLAYER_STATE_FULL_CONTROL);
            }
        }
    };

    this.left_click_down = function() {
        let current_milliseconds = new Date().getTime();

        for (let i = this._left_click_buffer.length; i--;) {
            if (current_milliseconds - this._left_click_buffer[i] >= 300) {
                this._left_click_buffer.splice(i, 1);
            }
        }

        this._left_click_buffer.push(current_milliseconds);

        if (CURRENT_PLAYER.has_input()) {
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
            if (event.keyCode === KEY_CODE_ENTER) {
                CURRENT_PLAYER.add_text_and_leave_typing_state();
            } else {
                CURRENT_CLIENT.key_down_event(event);
            }
        } else if (CURRENT_PLAYER.has_input()) {
            if (event.keyCode === KEY_CODE_ENTER) {
                if (!CURRENT_PLAYER.engaged_with_object()) {
                    CURRENT_PLAYER.set_state(PLAYER_STATE_TYPING);
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
