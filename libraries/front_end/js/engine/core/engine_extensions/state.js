'use strict';

const ENGINE_STATE_PAUSED  = 0; // #pre-process_global_constant
const ENGINE_STATE_ERROR   = 1; // #pre-process_global_constant
const ENGINE_STATE_RUNNING = 2; // #pre-process_global_constant

Object.assign(
    $_QE.prototype,
    {
        state_current : null,
        state_previous: null,

        state_set: function(state) {
            if (this.state_current == state) {
                this.log_warning('Setting state to current state!', this.state_current);
            }

            this.state_previous = this.state_current;
            this.state_current  = state;

            // TODO: Switch statement with needed actions/logic.
        },

        _reset_input_and_movements: function() {
            this.reset_inputs();
            this.player.reset_velocity();
        }
    }
);