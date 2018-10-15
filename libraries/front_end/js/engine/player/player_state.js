'use strict';

const PLAYER_STATE_PAUSED        = 1; // #pre-process_global_constant
const PLAYER_STATE_FULL_CONTROL  = 2; // #pre-process_global_constant
const PLAYER_STATE_TYPING_IN_HUD = 3; // #pre-process_global_constant
const PLAYER_STATE_ENGAGED       = 4; // #pre-process_global_constant

Object.assign($_QE.prototype.Player.prototype, {
    previous_state: null,
    current_state : PLAYER_STATE_PAUSED,

    set_state: function(player_state) {
        this.previous_state = this.current_state;
        this.current_state  = player_state;

        switch(player_state) {
        case PLAYER_STATE_PAUSED:

            //MANAGER_INPUT.reset_movement_controls();
            //CURRENT_PLAYER.fps_controls.reset_velocity();

            if (this.engine.manager_world.player_cursor.in_mouse_action()) {
                this.engine.manager_world.player_cursor.finish_mouse_action();
            }

            // Hide the player menu if visible.

            this.engine.on_pause();

            //if (this.current_state === PLAYER_STATE_PAUSED) {
            //    CURRENT_CLIENT.pause();
            //} else {
            //    CURRENT_CLIENT.show_pause_menu();
            //}

            //MANAGER_AUDIO.pause_background_music();

            break;
        case PLAYER_STATE_TYPING_IN_HUD:
            this.engine.manager_hud.hud_typing.enter_typing_state();
            break;
        case PLAYER_STATE_ENGAGED:
            this.engine.manager_input.reset();
            this.engine.player.reset_velocity();
            break;
        default:
            if (this.previous_state === PLAYER_STATE_PAUSED) {
                //MANAGER_AUDIO.resume_background_music();
                this.engine.resume();
            }
            break;
        }
    },

    is_engaged: function() {
        return this.current_state === PLAYER_STATE_ENGAGED;
    },

    is_paused: function() {
        return this.current_state === PLAYER_STATE_PAUSED;
    },

    has_mouse_movement: function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL;
    },

    has_movement: function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL;
    },

    in_hud_typing_state: function() {
        return this.current_state === PLAYER_STATE_TYPING_IN_HUD;
    },

    has_input: function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL || this.current_state === PLAYER_STATE_ENGAGED || this.current_state === PLAYER_STATE_TYPING_IN_HUD;
    },
});
