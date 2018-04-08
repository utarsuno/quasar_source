'use strict';

function WorldManagerInput() {

    this.right_click_down = function () {
        if (CURRENT_PLAYER.has_input()) {

            // If the player has input and is NOT engaged AND the player menu is not visible then right clicking will make the PlayerMenu show up.

            var currently_looked_at_object = this.current_world.currently_looked_at_object;
            if (is_defined(currently_looked_at_object)) {
                if (!currently_looked_at_object.is_engaged()) {
                    //this.player_menu.toggle_visibility();
                    //if (!MANAGER_WORLD.current_player_menu.is_visible()) {
                    //    MANAGER_WORLD.current_player_menu.set_to_visible();
                    //}
                } else {
                    currently_looked_at_object.disengage();
                }
            } else {
                this.player_menu.toggle_visibility();
                //if (!MANAGER_WORLD.current_player_menu.is_visible()) {
                //    MANAGER_WORLD.current_player_menu.set_to_visible();
                //}
            }
        }
    };

    this.right_click_up = function() {

        //if (MANAGER_WORLD.current_player_menu.is_visible()) {
        //    MANAGER_WORLD.current_player_menu.set_to_invisible();
        //} else {
        //MANAGER_WORLD.current_world.single_right_click();
        //}
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


