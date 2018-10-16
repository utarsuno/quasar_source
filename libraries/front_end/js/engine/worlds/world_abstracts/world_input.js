'use strict';

$_QE.prototype.WorldInput = function() {

    this.key_down_event_for_interactive_objects = function(event) {
        if (this.currently_looked_at_object != null) {
            if (event.keyCode == KEY_CODE__TAB && !this.currently_looked_at_object.get_flag(EFLAG_ENGAGED)) {
                this.tab_to_next_interactive_object();
            } else if (this.currently_looked_at_object.get_flag(EFLAG_ENGAGED) || !this.currently_looked_at_object.get_flag(EFLAG_NEEDS_ENGAGE_FOR_PARSING_INPUT)) {
                this.currently_looked_at_object.parse_key_event(event);
            }
        } else if (event.keyCode == KEY_CODE__TAB) {
            this.tab_to_previous_tab_target();
        }
    };

    /*     __        __   ___     ___       ___      ___  __
     |\/| /  \ |  | /__` |__     |__  \  / |__  |\ |  |  /__`
     |  | \__/ \__/ .__/ |___    |___  \/  |___ | \|  |  .__/ */

    // This gets called on left mouse button up event.
    this.left_click = function(double_click) {
        //if (CURRENT_CLIENT.is_mobile && MANAGER_INPUT.is_mobile_keyboard_visible()) {
        //    return;
        //}

        if (this.currently_looked_at_object != null) {
            if (!this.currently_looked_at_object.get_flag(EFLAG_ENGAGED)) {
                if (this.currently_looked_at_object.get_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK)) {
                    if (double_click) {
                        this.engage_currently_looked_at_object();
                    } else {
                        //if (QE.manager_world.player_cursor.currently_attached_to !== null) {
                        //    QE.manager_world.player_cursor.engage();
                        //}
                    }
                } else {
                    this.engage_currently_looked_at_object();
                }
            }
        }

        // Check if keyboard is needed!
        //if (CURRENT_CLIENT.is_mobile) {
        //    if (is_defined(this.currently_looked_at_object.needs_mobile_keyboard)) {
        //        if (this.currently_looked_at_object.needs_mobile_keyboard) {
        //            MANAGER_INPUT.trigger_mobile_keyboard();
        //        }
        //    }
        //}
    };

};