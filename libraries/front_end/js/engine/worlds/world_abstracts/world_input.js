'use strict';

$_QE.prototype.WorldInput = function() {

    this.mobile_key_press = function(key) {
        if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.feature_needs_engage_for_parsing_input) {
            this.currently_looked_at_object.add_character(key);
        }
    };

    this.mobile_key_delete = function() {
        if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.feature_needs_engage_for_parsing_input) {
            this.currently_looked_at_object.pop_character();
        }
    };

    this.mobile_keyboard_close = function() {
        if (this.currently_looked_at_object != null) {
            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage();
                this.player.set_state(PLAYER_STATE_FULL_CONTROL);
            }
        }
    };

    this.key_down_event_for_interactive_objects = function(event) {
        if (event.keyCode === KEY_CODE__TAB) {
            this.tab_to_next_interactive_object();
        } else {

            //l('key down for interatives');
            //l(event);
            //l(this.currently_looked_at_object);

            if (this.currently_looked_at_object != null) {
                if (this.currently_looked_at_object.is_engaged() || !this.currently_looked_at_object.feature_needs_engage_for_parsing_input) {
                    this.currently_looked_at_object.parse_key_event(event);
                }

                /*
                else if (event.keyCode === KEY_CODE__ENTER) {
                    if (!this.currently_looked_at_object.is_engaged()) {
                    //    this.currently_looked_at_object.engage();
                    } else {
                        this.currently_looked_at_object.parse_keycode(event);
                    }
                }
                */
            }
        }
    };

    /*___       __      ___       ___      ___
       |   /\  |__)    |__  \  / |__  |\ |  |
       |  /~~\ |__)    |___  \/  |___ | \|  |  */
    this._default_tab_target = null;

    this.set_default_tab_target = function(default_tab_target) {
        this._default_tab_target = default_tab_target;
    };

    // TODO : This needs to be refactored!
    this.tab_to_next_interactive_object = function() {
        /*
        if (this.floating_cursor._currently_engaged) {
            this.floating_cursor.disengage();
        }

        if (is_defined(this.currently_looked_at_object)) {
            let next_tab_target = this.currently_looked_at_object.next_tab_target;
            if (!is_defined(next_tab_target)) {
                next_tab_target = this._default_tab_target;
            }

            if (this.currently_looked_at_object.is_engaged()) {
                this.currently_looked_at_object.disengage();
            }
            this.currently_looked_at_object.look_away();

            //
            this.currently_looked_at_object = next_tab_target;
            this.look_at_currently_looked_at_object(true, true);
            if (this.currently_looked_at_object.maintain_engage_when_tabbed_to) {
                this.currently_looked_at_object.engage();
            } else {
                this.player.set_state(PLAYER_STATE_FULL_CONTROL);
            }
        } else {
            if (is_defined(this._default_tab_target)) {
                this.currently_looked_at_object = this._default_tab_target;
                this.look_at_currently_looked_at_object(true, true);
                //this.floating_cursor.update_position(this.currently_looked_at_object.get_position());
            }
        }
        */
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
            if (!this.currently_looked_at_object.is_engaged()) {
                if (this.currently_looked_at_object.feature_engable_only_from_double_click) {
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

};