'use strict';


Object.assign(
    $_QE.prototype,
    $_QE.prototype.FiniteStateMachine.prototype,
    {
        state_current : null,
        state_previous: null,

        _initialize_state: function(first_state=null) {
            this.state_paused = this.add_state(QEFLAG_STATE_PAUSED,
                function() {
                    // TODO: On pause exit, enable input (depending on player state!)
                    // manager_audio.resume_background_music();

                    this._hide_pause_menu();
                    if (this.flag_is_off(QEFLAG_FEATURE_MOBILE)) {
                        this.mouse_lock();
                    }
                }.bind(this),

                function() {
                    // TODO: On pause resume.
                    // MANAGER_AUDIO.pause_background_music();
                }.bind(this)
            );

            this.state_running = this.add_state(QEFLAG_STATE_RUNNING,
                function() {
                    // TODO: On running exit.
                    this._reset_input_and_movements();
                    if (this.manager_world.player_cursor.in_mouse_action()) {
                        this.manager_world.player_cursor.finish_mouse_action();
                    }
                    // TODO: Animate with transition!
                    this.pause_menu_show();
                    this._clear_frames();
                }.bind(this),

                function() {
                    // TODO: On running resume.
                }
            );

            if (first_state != null) {
                this.set_state(first_state);
            }
        },

        _reset_input_and_movements: function() {
            this.reset_inputs();
            this.player.reset_velocity();
        }
    }
);
