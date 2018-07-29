'use strict';

const PLAYER_STATE_PAUSED       = 1; // #pre-process_global_constant
const PLAYER_STATE_FULL_CONTROL = 2; // #pre-process_global_constant
const PLAYER_STATE_TYPING       = 3; // #pre-process_global_constant
const PLAYER_STATE_ENGAGED      = 4; // #pre-process_global_constant

$_QE.prototype.PlayerState = function() {
    this.previous_state = null;
    this.current_state  = PLAYER_STATE_PAUSED;

    // Gets set by application objects.
    this.player_typing_input_handler = null;

    this.set_state = function(player_state) {
        this.previous_state = this.current_state;
        this.current_state = player_state;

        switch(player_state) {
        case PLAYER_STATE_PAUSED:

            //MANAGER_INPUT.reset_movement_controls();
            //CURRENT_PLAYER.fps_controls.reset_velocity();

            if (QE.manager_world.player_cursor.in_mouse_action()) {
                QE.manager_world.player_cursor.finish_mouse_action();
            }

            // Hide the player menu if visible.

            this.engine.client.show_paused();


            //if (this.current_state === PLAYER_STATE_PAUSED) {
            //    CURRENT_CLIENT.pause();
            //} else {
            //    CURRENT_CLIENT.show_pause_menu();
            //}

            if (player_state === PLAYER_STATE_PAUSED) {
                //MANAGER_AUDIO.pause_background_music();
            }

            break;
        case PLAYER_STATE_TYPING:
            QE.application.enter_typing_state();
            //QE.update_needed_for_colors = true;
            //CURRENT_CLIENT.show_client_typing();
            break;
        default:
            if (player_state === PLAYER_STATE_ENGAGED) {
                //MANAGER_INPUT.reset_movement_controls();
                this.engine.player.reset_velocity();
            }

            //l('PREVIOUS STATE WAS :');
            //l(this.previous_state);
            if (this.previous_state === PLAYER_STATE_PAUSED) {
                //MANAGER_AUDIO.resume_background_music();

                this.engine.client.resume();
            }
            break;
        }
    };

    // Check status.
    this.has_paste_event = function() {
        return this.current_state === PLAYER_STATE_TYPING || this.current_state === PLAYER_STATE_ENGAGED;
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

    this.has_input = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL || this.current_state === PLAYER_STATE_ENGAGED || this.current_state === PLAYER_STATE_TYPING;
    };

    // Input handlers.
    this.on_paste_event = function(text) {
        if (this.current_state === PLAYER_STATE_TYPING) {
            if (this.player_typing_input_handler !== null) {
                this.player_typing_input_handler.on_paste_event(text);
            }
        } else {

        }
    };
};
