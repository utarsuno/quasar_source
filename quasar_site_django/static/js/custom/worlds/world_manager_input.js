'use strict';

function WorldManagerInput() {

    this.right_click_down = function () {
        if (CURRENT_PLAYER.has_input()) {

            // If the player has input and is NOT engaged AND the player menu is not visible then right clicking will make the PlayerMenu show up.

            var currently_looked_at_object = this.current_world.currently_looked_at_object;
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


