'use strict';

Object.assign($_QE.prototype, {

    set_number_of_frames_for_physics: function(fps) {
        this._cache_floats[ENGINE_FLOAT_FPS_PHYSICS] = 1.0 / fps;
    },

    set_number_of_frames_for_rendering: function(fps) {
        this._cache_floats[ENGINE_FLOAT_FPS_RENDER] = 1.0 / fps;
    },

    set_number_of_frames_for_logic: function(fps) {
        this._cache_floats[ENGINE_FLOAT_FPS_LOGIC] = 1.0 / fps;
    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    _engine_loop: function() {
        requestAnimationFrame(this.engine_main_loop);
        if (this.player.current_state != PLAYER_STATE_PAUSED) {
            this._delta = this._delta_clock.getDelta();
            this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_SECOND]  += this._delta;
            this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_PHYSICS] += this._delta;
            this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_LOGIC]   += this._delta;
            this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_RENDER]  += this._delta;

            if (this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_SECOND] >= 1.0) {
                // Reset.
                this._frames_passed = Math.floor(this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_SECOND]);
                this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_SECOND] -= this._frames_passed;
                this.hud_debug.set_current_frame_count(this._cache_values[ENGINE_CACHE_FRAME_COUNTER]);
                this._cache_values[ENGINE_CACHE_FRAME_COUNTER] = 0;

                this.hud_date_time.refresh();
            }

            if (this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_PHYSICS] >= this._cache_floats[ENGINE_FLOAT_FPS_PHYSICS]) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_PHYSICS] / this._cache_floats[ENGINE_FLOAT_FPS_PHYSICS]);

                this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_PHYSICS] -= this._frames_passed * this._cache_floats[ENGINE_FLOAT_FPS_PHYSICS];
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.physics(this._cache_floats[ENGINE_FLOAT_FPS_PHYSICS]);
                    this._frame_iteration++;
                }

                this.hud_update();
            }

            if (this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_LOGIC] >= this._cache_floats[ENGINE_FLOAT_FPS_LOGIC]) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_LOGIC] / this._cache_floats[ENGINE_FLOAT_FPS_LOGIC]);

                this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_LOGIC] -= this._frames_passed * this._cache_floats[ENGINE_FLOAT_FPS_LOGIC];
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.update(this._cache_floats[ENGINE_FLOAT_FPS_LOGIC]);
                    this._frame_iteration++;
                }
            }

            if (this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_RENDER] >= this._cache_floats[ENGINE_FLOAT_FPS_RENDER]) {
                // Reset.
                this._frames_passed = Math.floor(this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_RENDER] / this._cache_floats[ENGINE_FLOAT_FPS_RENDER]);

                this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_RENDER] -= this._frames_passed * this._cache_floats[ENGINE_FLOAT_FPS_RENDER];
                this.render(this._frames_passed * this._cache_floats[ENGINE_FLOAT_FPS_RENDER]);
                this._cache_values[ENGINE_CACHE_FRAME_COUNTER] += 1;
            }
        }
        this._delta_clock.start();

        // TODO: Set a delay here?
    },

    _clear_frames: function() {
        this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_PHYSICS] = 0.0;
        this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_LOGIC]   = 0.0;
        this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_RENDER]  = 0.0;
        this._cache_floats[ENGINE_FLOAT_ELAPSED_TIME_SECOND]  = 0.0;
        this._cache_values[ENGINE_CACHE_FRAME_COUNTER]        = 0;
    },

    pause_engine: function() {
        this.player.set_state(PLAYER_STATE_PAUSED);
    },

    resume: function() {
        this._hide_pause_menu();
        if (!this.get_flag(CLIENT_FEATURE_MOBILE)) {
            this.mouse_lock();
        }
    },

    on_pause: function() {
        this.pause_menu_show();
        this._clear_frames();
    },

});