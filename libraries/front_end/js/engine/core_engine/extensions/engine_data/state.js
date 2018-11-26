'use strict';


Object.assign(
    $_QE.prototype,
    $_QE.prototype.FiniteStateMachine.prototype,
    {
        state_current : null,
        state_previous: null,

        _initialize_state: function(first_state=null) {
            this.state_paused = this.add_state(QEFLAG_STATE_PAUSED,
                this._on_state_exit_paused.bind(this),
                this._on_state_enter_paused.bind(this)
            );

            this.state_running = this.add_state(QEFLAG_STATE_RUNNING,
                this._on_state_exit_running.bind(this),
                this._on_state_enter_running.bind(this)
            );

            if (first_state != null) {
                this.set_state(first_state);
            }
        },

        _on_state_exit_paused: function() {
            // TODO: On pause exit, enable input (depending on player state!)
            // manager_audio.resume_background_music();

            this.pause_menu_fade_out();
            if (this.flag_is_off(QEFLAG_FEATURE_MOBILE)) {
                this.mouse_lock();
            }
        },

        _on_state_enter_paused: function() {
            // MANAGER_AUDIO.pause_background_music();
        },

        _on_state_exit_running: function() {
            this._reset_input_and_movements();
            if (this.manager_world.player_cursor.in_mouse_action()) {
                this.manager_world.player_cursor.finish_mouse_action();
            }
            this.pause_menu_fade_in();
            this._clear_frames();
        },

        _on_state_enter_running: function() {
            // TODO: On running resume.
        },

        _reset_input_and_movements: function() {
            this.reset_inputs();
            this.player.reset_velocity();
        }
    }
);
