'use strict';

$_QE.prototype.WorldManagerInput = function() {
    this.on_wheel_event = function(direction) {
        if (this.player_cursor._currently_moving) {
            this.player_cursor.on_wheel_event(direction);
        }
    };

    this.left_click_up = function(is_double_click) {
        if (this.player_cursor.engaged()) {
            this.player_cursor.disengage();
        }

        if (this.player.has_input()) {
            this.current_world.left_click(is_double_click);
        } else if (this.player.is_paused() && is_double_click) {
            if (this.current_world.is_current_object_set_and_engaged()) {
                this.player.set_state(PLAYER_STATE_ENGAGED);
            } else {
                this.player.set_state(PLAYER_STATE_FULL_CONTROL);
            }
        }
    };

    this.left_click_down = function() {
        if (!this.player.is_paused()) {
            if (this.player_cursor.currently_attached_to !== null) {
                this.player_cursor.engage();
            }
        }
    };

    this.middle_click_up = function() {
        l('Middle click up!');
        if (this.client.has_pointer_lock) {
            this.client.release_pointer_lock();
        } else {
            this.client.request_pointer_lock();
        }
    };

    this.right_click_down = function () {
        if (this.player.has_input()) {
            if (this.current_world.is_current_object_set_and_engaged()) {
                this.current_world.disengage_from_currently_looked_at_object();
            }
        }
    };

    this.right_click_up = function() {
    };

    this.key_down_event = function(event) {
        if (this.player.in_typing_state()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                QE.application.leave_typing_state();
            } else {
                QE.gui_2d_typing.parse_key_event(event);
            }
        } else if (this.player.has_input()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                if (this.current_world.currently_looked_at_object === null) {
                    this.player.set_state(PLAYER_STATE_TYPING);
                } else {
                    this.current_world.key_down_event_for_interactive_objects(event);
                }
            } else {
                this.current_world.key_down_event_for_interactive_objects(event);
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