'use strict';

Object.assign($_QE.prototype, {
    _engine_frame_counter_render: 0,

    _engine_elapsed_time_physics: 0.0,
    _engine_elapsed_time_render : 0.0,
    _engine_elapsed_time_logic  : 0.0,
    _engine_elapsed_time_second : 0.0,

    // Default settings.
    _engine_time_per_frame_physics: 0.011111111111111112, // FPS is 90 (from 1.0 / 90.0).
    _engine_time_per_frame_render : 0.016666666666666666, // FPS is 60 (from 1.0 / 60.0).
    _engine_time_per_frame_logic  : 0.03333333333333333,  // FPS is 30 (from 1.0 / 30.0).

    set_number_of_frames_for_physics: function(fps) {
        this._engine_time_per_frame_physics = 1.0 / fps;
    },

    set_number_of_frames_for_rendering: function(fps) {
        this._engine_time_per_frame_render = 1.0 / fps;
    },

    set_number_of_frames_for_logic: function(fps) {
        this._engine_time_per_frame_logic = 1.0 / fps;
    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    _engine_loop: function() {
        requestAnimationFrame(this.engine_main_loop);
        if (this.player.current_state != PLAYER_STATE_PAUSED) {
            this._delta = this._delta_clock.getDelta();
            this._engine_elapsed_time_second  += this._delta;
            this._engine_elapsed_time_physics += this._delta;
            this._engine_elapsed_time_logic   += this._delta;
            this._engine_elapsed_time_render  += this._delta;

            if (this._engine_elapsed_time_second >= 1.0) {
                // Reset.
                this._frames_passed = Math.floor(this._engine_elapsed_time_second);
                this._engine_elapsed_time_second -= this._frames_passed;
                this.manager_hud.hud_debug.set_current_frame_count(this._engine_frame_counter_render);
                this._engine_frame_counter_render = 0;
            }

            if (this._engine_elapsed_time_physics >= this._engine_time_per_frame_physics) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._engine_elapsed_time_physics / this._engine_time_per_frame_physics);

                this._engine_elapsed_time_physics -= this._frames_passed * this._engine_time_per_frame_physics;
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.physics(this._engine_time_per_frame_physics);
                    this._frame_iteration++;
                }

                this.manager_hud.update();
            }

            if (this._engine_elapsed_time_logic >= this._engine_time_per_frame_logic) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._engine_elapsed_time_logic / this._engine_time_per_frame_logic);

                this._engine_elapsed_time_logic -= this._frames_passed * this._engine_time_per_frame_logic;
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.update(this._engine_time_per_frame_logic);
                    this._frame_iteration++;
                }
            }

            if (this._engine_elapsed_time_render >= this._engine_time_per_frame_render) {
                // Reset.
                this._frames_passed = Math.floor(this._engine_elapsed_time_render / this._engine_time_per_frame_render);

                this._engine_elapsed_time_render -= this._frames_passed * this._engine_time_per_frame_render;
                this.manager_renderer.render(this._frames_passed * this._engine_time_per_frame_render);
                this._engine_frame_counter_render++;
            }
        }
        this._delta_clock.start();
    },

});