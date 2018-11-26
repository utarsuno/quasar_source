'use strict';


Object.assign(
    $_QE.prototype.Player.prototype,
    $_QE.prototype.FiniteStateMachine.prototype,
    {
        previous_state: null,
        current_state : null,

        _initialize_state: function() {
            this.state_teleporting = this.add_state(PLAYER_STATE_TELEPORTING);

            this.state_full_control = this.add_state(PLAYER_STATE_FULL_CONTROL,
                null,
                function() {
                    this.engine._reset_input_and_movements();
                }.bind(this)
            );

            this.state_hud_typing = this.add_state(PLAYER_STATE_HUD_TYPING,
                null,
                function() {
                    this.engine.hud_typing.enter_typing_state();
                }.bind(this)
            );

            this.state_engaged = this.add_state(PLAYER_STATE_ENGAGED);

            this.set_state(this.state_full_control);
        },

        is_engaged: function() {
            return this.is_current_state(PLAYER_STATE_ENGAGED);
        },

        is_teleporting: function() {
            return this.is_current_state(PLAYER_STATE_TELEPORTING);
        },

        has_movement: function() {
            return this.is_current_state(PLAYER_STATE_FULL_CONTROL);
        },

        in_hud_typing_state: function() {
            return this.is_current_state(PLAYER_STATE_HUD_TYPING);
        },

        has_input: function() {
            return this.is_current_state(PLAYER_STATE_FULL_CONTROL) || this.is_current_state(PLAYER_STATE_ENGAGED) || this.is_current_state(PLAYER_STATE_HUD_TYPING);
        },

    }
);
