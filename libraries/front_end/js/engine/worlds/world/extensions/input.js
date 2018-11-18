'use strict';

Object.assign($_QE.prototype.World.prototype, {

    key_down_event_for_interactive_objects: function(event) {
        if (this.currently_looked_at_object != null) {
            if (event.keyCode == KEY_CODE__TAB && this.currently_looked_at_object.flag_is_off(EFLAG_IS_ENGAGED)) {
                this.tab_to_next_interactive_object();
            } else if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_ENGAGED) || this.currently_looked_at_object.flag_is_off(EFLAG_IS_INPUT_PARSEABLE_WITHOUT_ENGAGED_STATE)) {
                this.currently_looked_at_object.parse_key_event(event);
            }
        } else if (event.keyCode == KEY_CODE__TAB) {
            this.tab_to_previous_tab_target();
        }
    },

    /*     __        __   ___     ___       ___      ___  __
     |\/| /  \ |  | /__` |__     |__  \  / |__  |\ |  |  /__`
     |  | \__/ \__/ .__/ |___    |___  \/  |___ | \|  |  .__/ */

    // This gets called on left mouse button up event.
    left_click: function(double_click) {
        //if (CURRENT_CLIENT.is_mobile && MANAGER_INPUT.is_mobile_keyboard_visible()) {
        //    return;
        //}

        // TODO: refactor left_click!

        if (this.currently_looked_at_object != null) {
            if (this.currently_looked_at_object.flag_is_off(EFLAG_IS_ENGAGED)) {
                if (this.currently_looked_at_object.flag_is_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING)) {
                    if (double_click) {
                        this.engage_currently_looked_at_object();
                    } else {
                        //if (QE.manager_world.player_cursor.attached_to !== null) {
                        //    QE.manager_world.player_cursor.get_flag(CURSOR_FLAG_ENGAGED);
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
    },
});
