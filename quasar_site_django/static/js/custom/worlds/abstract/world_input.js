'use strict';

function WorldInput() {

    this.mobile_key_press = function(key) {
        if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.needs_engage_for_parsing_input) {
            this.currently_looked_at_object.mobile_add_character(key);
        }
    };

    this.mobile_key_delete = function() {
        if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.needs_engage_for_parsing_input) {
            this.currently_looked_at_object.mobile_delete_character();
        }
    };

    this.mobile_keyboard_close = function() {
        if (is_defined(this.currently_looked_at_object)) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage();
                CURRENT_PLAYER.set_state(PLAYER_STATE_FULL_CONTROL);
            }
        }
    };

    this.key_down_event_for_interactive_objects = function(event) {
        if (event.keyCode === KEY_CODE_TAB) {
            this.tab_to_next_interactive_object();
            event.stopPropagation();
        }

        if (is_defined(this.currently_looked_at_object)) {
            if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.needs_engage_for_parsing_input) {
                this.currently_looked_at_object.parse_keycode(event);
            } else if (event.keyCode === KEY_CODE_ENTER) {
                if (!this.currently_looked_at_object.is_engaged()) {
                    this.currently_looked_at_object.engage();
                }
            }
        }

        // No defaults will be useful (for now).
        event.preventDefault();
    };

    /*___       __      ___       ___      ___
       |   /\  |__)    |__  \  / |__  |\ |  |
       |  /~~\ |__)    |___  \/  |___ | \|  |  */

    // TODO : This needs to be refactored!
    this.tab_to_next_interactive_object = function() {
        /*
        if (MANAGER_WORLD.current_floating_cursor.engaged) {
            MANAGER_WORLD.current_floating_cursor.disengage();
        }

        if (is_defined(this.currently_looked_at_object)) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage();
                this.currently_looked_at_object.look_away();
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target;
                this.currently_looked_at_object.look_at();
                if (this.currently_looked_at_object.maintain_engage_when_tabbed_to) {
                    this.currently_looked_at_object.engage();
                } else {
                    CURRENT_PLAYER.enable_controls();
                }
            } else {
                this.currently_looked_at_object.look_away();
                this.currently_looked_at_object = this.currently_looked_at_object.next_tab_target;
                this.currently_looked_at_object.look_at();
            }
            CURRENT_PLAYER.look_at(this.currently_looked_at_object.object3D.position);
        } else if (is_defined(this.default_tab_target)) {
            this.currently_looked_at_object = this.default_tab_target;
            CURRENT_PLAYER.look_at(this.currently_looked_at_object.object3D.position);
            this.currently_looked_at_object.look_at();
        }
        */
    };

    /*     __        __   ___     ___       ___      ___  __
     |\/| /  \ |  | /__` |__     |__  \  / |__  |\ |  |  /__`
     |  | \__/ \__/ .__/ |___    |___  \/  |___ | \|  |  .__/ */

    // This gets called on left mouse button up event.
    this.single_left_click = function() {

        if (CURRENT_CLIENT.is_mobile && MANAGER_INPUT.mobile_keyboard_visible) {
            return;
        }

        if (is_defined(this.currently_looked_at_object)) {
            if (!this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.engage();

                // Check if keyboard is needed!
                if (CURRENT_CLIENT.is_mobile) {
                    if (is_defined(this.currently_looked_at_object.needs_mobile_keyboard)) {
                        if (this.currently_looked_at_object.needs_mobile_keyboard) {
                            MANAGER_INPUT.trigger_mobile_keyboard();
                        }
                    }
                }
            }
        }
    };

    // For now a middle click will act like a left click.
    this.single_middle_click = function() {
        this.single_left_click();
    };

    this.multi_left_click = function() {
        // For now just perform a regular left click action.
        this.single_left_click();
    };

    this.multi_middle_click = function() {
        // Fow now just perform a regular left click action.
        this.single_left_click();
    };

    this.multi_right_click = function() {
        // Fow now just perform a regular right click action.
    };

    this.wheel_event = function(delta) {
        if (this.floating_cursor._currently_engaged) {
            this.floating_cursor.wheel_event(delta);
        }
    };

}