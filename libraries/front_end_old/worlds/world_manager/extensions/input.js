Object.assign($_QE.prototype.WorldManager.prototype, {

    on_wheel_event: function(direction) {
        if (this.player_cursor.flag_is_on(CURSOR_STATE_MOVE)) {
            this.player_cursor.on_wheel_event(direction);
        }
    },

    left_click_up: function(is_double_click) {
        if (this.player_cursor.is_in_action()) {
            this.player_cursor.finish_action();
        }
        if (this.player.has_input()) {
            this.current_world.left_click(is_double_click);
        }
    },

    left_click_down: function() {
        if (this.engine.is_current_state(QEFLAG_STATE_RUNNING)) {
            if (this.player_cursor.attached_to != null) {
                this.player_cursor.on_left_click_down();
            }
        }
    },

    middle_click_down: function() {
        l('TODO: Middle click down!');
    },

    middle_click_up: function() {
        l('TODO: Middle click up!');
        /*if (this.client.has_pointer_lock) {
            this.client.mouse_release();
        } else {
            this.client.mouse_lock();
        }*/
    },

    right_click_down: function () {
        if (this.player.has_input()) {
            if (this.current_world.is_current_object_set_and_engaged()) {
                this.current_world.disengage_from_currently_looked_at_object();
            } else if (this.current_world.currently_looked_at_object == null) {
                if (!this.player_menu.is_open) {
                    this.player_menu.open();
                }
            }
        }
    },

    right_click_up: function() {
    },

    key_down_event: function(event) {
        if (this.player.in_hud_typing_state()) {
            QE.hud_typing.parse_key_event(event);
        } else if (this.player.has_input()) {
            if (event.keyCode === KEY_CODE__ENTER) {
                if (this.current_world.currently_looked_at_object == null) {
                    this.player.set_state(PLAYER_STATE_HUD_TYPING);
                } else {
                    this.current_world.key_down_event_for_interactive_objects(event);
                }
            } else {
                this.current_world.key_down_event_for_interactive_objects(event);
            }
        }
    },

});
