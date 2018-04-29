'use strict';

const PLAYER_STATE_PAUSED       = 1; // #pre-process_global_constant
const PLAYER_STATE_LOADING      = 2; // #pre-process_global_constant
const PLAYER_STATE_ENGAGED      = 3; // #pre-process_global_constant
const PLAYER_STATE_FULL_CONTROL = 4; // #pre-process_global_constant
const PLAYER_STATE_TYPING       = 5; // #pre-process_global_constant

function PlayerState() {

    this.previous_state = null;
    this.current_state = PLAYER_STATE_LOADING;

    this.set_state = function(player_state) {
        this.previous_state = this.current_state;
        this.current_state = player_state;

        switch(player_state) {
        case PLAYER_STATE_LOADING:
        case PLAYER_STATE_PAUSED:
            MANAGER_INPUT.reset_movement_controls();
            CURRENT_PLAYER.fps_controls.reset_velocity();

            // Dis-engage any engaged objects.
            var currently_looked_at_object = this.get_currently_looked_at_object();
            if (is_defined(currently_looked_at_object)) {
                if (currently_looked_at_object.is_engaged()) {
                    currently_looked_at_object.disengage();
                }
            }

            // Hide the player menu if visible.

            if (this.current_state === PLAYER_STATE_PAUSED) {
                CURRENT_CLIENT.pause();
            } else {
                CURRENT_CLIENT.show_pause_menu();
            }

            if (player_state === PLAYER_STATE_PAUSED) {
                MANAGER_AUDIO.pause_background_music();
            }

            break;
        case PLAYER_STATE_TYPING:
            CURRENT_CLIENT.show_client_typing();
            break;
        default:
            if (player_state === PLAYER_STATE_ENGAGED) {
                MANAGER_INPUT.reset_movement_controls();
                CURRENT_PLAYER.fps_controls.reset_velocity();
            }

            //l('PREVIOUS STATE WAS :');
            //l(this.previous_state);
            if (this.previous_state === PLAYER_STATE_LOADING || this.previous_state === PLAYER_STATE_PAUSED) {

                if (this.previous_state === PLAYER_STATE_PAUSED) {
                    MANAGER_AUDIO.resume_background_music();
                }

                CURRENT_CLIENT.resume();
            }
            break;
        }
    };

    this.is_engaged = function() {
        return this.current_state === PLAYER_STATE_ENGAGED;
    };

    this.is_paused = function() {
        return this.current_state === PLAYER_STATE_PAUSED;
    };

    this.has_mouse_movement = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL;
    };

    this.has_movement = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL;
    };

    this.in_typing_state = function() {
        return this.current_state === PLAYER_STATE_TYPING;
    };

    this.add_text_and_leave_typing_state = function() {
        CURRENT_CLIENT.add_user_text();

        this.set_state(PLAYER_STATE_FULL_CONTROL);
    };

    this.has_paste_event = function() {
        if (this.current_state === PLAYER_STATE_TYPING) {
            return true;
        } else {
            let currently_looked_at_object = this.get_currently_looked_at_object();
            if (is_defined(currently_looked_at_object)) {
                if (currently_looked_at_object.is_engaged()) {
                    return true;
                }
            }
        }
        return false;
    };

    this.has_input = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL || this.current_state === PLAYER_STATE_ENGAGED || this.current_state === PLAYER_STATE_TYPING; 
    };

    this.currently_loading = function() {
        return this.current_state === PLAYER_STATE_LOADING;
    };

    this.get_currently_looked_at_object = function() {
        if (!is_defined(MANAGER_WORLD.current_world)) {
            return null;
        }
        return MANAGER_WORLD.current_world.currently_looked_at_object;
    };

    this.engaged_with_object = function() {
        let currently_engaged_object = this.get_currently_looked_at_object();
        if (is_defined(currently_engaged_object)) {
            return currently_engaged_object.is_engaged();
        }
        return false;
    };
}
