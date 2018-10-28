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
            this._reset_input_and_movements();

            if (this.engine.manager_world.player_cursor.in_mouse_action()) {
                this.engine.manager_world.player_cursor.finish_mouse_action();
            }

            // Hide the player menu if visible.

            this.engine.on_pause();

            //MANAGER_AUDIO.pause_background_music();

            break;
        case PLAYER_STATE_TYPING_IN_HUD:
            this._resume_if_previous_state_was_paused();
            this.engine.hud_typing.enter_typing_state();
            break;
        case PLAYER_STATE_ENGAGED:
            this._reset_input_and_movements();
            this._resume_if_previous_state_was_paused();
            break;
        case PLAYER_STATE_FULL_CONTROL:
            this._resume_if_previous_state_was_paused();
            break;
        default:
            // TODO: Remove default case?
            if (this.previous_state == PLAYER_STATE_PAUSED) {
                //MANAGER_AUDIO.resume_background_music();
                this.engine.resume();
            }
            break;
        }
    },

    is_engaged: function() {
        return this.current_state == PLAYER_STATE_ENGAGED;
    },

    is_paused: function() {
        return this.current_state == PLAYER_STATE_PAUSED;
    },

    has_mouse_movement: function() {
        return this.current_state == PLAYER_STATE_FULL_CONTROL;
    },

    has_movement: function() {
        return this.current_state == PLAYER_STATE_FULL_CONTROL;
    },

    in_hud_typing_state: function() {
        return this.current_state == PLAYER_STATE_TYPING_IN_HUD;
    },

    has_input: function() {
        return this.current_state == PLAYER_STATE_FULL_CONTROL || this.current_state == PLAYER_STATE_ENGAGED || this.current_state == PLAYER_STATE_TYPING_IN_HUD;
    },

    _reset_input_and_movements: function() {
        this.engine.reset_inputs();
        //this.engine.player.reset_velocity();
        this.reset_velocity();
    },

    _resume_if_previous_state_was_paused: function() {
        if (this.previous_state == PLAYER_STATE_PAUSED) {
            // manager_audio.resume_background_music();
            this.engine.resume();
        }
    },
});
