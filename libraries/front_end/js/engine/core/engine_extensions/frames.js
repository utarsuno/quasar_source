'use strict';

Object.assign($_QE.prototype, {

    set_number_of_frames_for_physics: function(fps) {
        this._cachef[QECACHEF_FPS_PHYSICS] = 1.0 / fps;
    },

    set_number_of_frames_for_rendering: function(fps) {
        this._cachef[QECACHEF_FPS_RENDER] = 1.0 / fps;
    },

    set_number_of_frames_for_logic: function(fps) {
        this._cachef[QECACHEF_FPS_LOGIC] = 1.0 / fps;
    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    _engine_loop: function() {
        requestAnimationFrame(this.engine_main_loop);
        if (this.is_current_state(QEFLAG_STATE_RUNNING)) {
            this._delta = this._delta_clock.getDelta();
            this._cachef[QECACHEF_ELAPSED_TIME_SECOND]  += this._delta;
            this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] += this._delta;
            this._cachef[QECACHEF_ELAPSED_TIME_LOGIC]   += this._delta;
            this._cachef[QECACHEF_ELAPSED_TIME_RENDER]  += this._delta;

            if (this._cachef[QECACHEF_ELAPSED_TIME_SECOND] >= 1.0) {
                // Reset.
                this._frames_passed = Math.floor(this._cachef[QECACHEF_ELAPSED_TIME_SECOND]);
                this._cachef[QECACHEF_ELAPSED_TIME_SECOND] -= this._frames_passed;
                this.hud_debug.set_current_frame_count(this._cachei[QECACHEI_FRAME_COUNTER]);
                this._cachei[QECACHEI_FRAME_COUNTER] = 0;

                this.hud_date_time.refresh();
            }

            if (this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] >= this._cachef[QECACHEF_FPS_PHYSICS]) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] / this._cachef[QECACHEF_FPS_PHYSICS]);

                this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] -= this._frames_passed * this._cachef[QECACHEF_FPS_PHYSICS];
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.physics(this._cachef[QECACHEF_FPS_PHYSICS]);
                    this._frame_iteration++;
                }

                this.hud_update();
            }

            if (this._cachef[QECACHEF_ELAPSED_TIME_LOGIC] >= this._cachef[QECACHEF_FPS_LOGIC]) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._cachef[QECACHEF_ELAPSED_TIME_LOGIC] / this._cachef[QECACHEF_FPS_LOGIC]);

                this._cachef[QECACHEF_ELAPSED_TIME_LOGIC] -= this._frames_passed * this._cachef[QECACHEF_FPS_LOGIC];
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.update(this._cachef[QECACHEF_FPS_LOGIC]);
                    this._frame_iteration++;
                }
            }

            if (this._cachef[QECACHEF_ELAPSED_TIME_RENDER] >= this._cachef[QECACHEF_FPS_RENDER]) {
                // Reset.
                this._frames_passed = Math.floor(this._cachef[QECACHEF_ELAPSED_TIME_RENDER] / this._cachef[QECACHEF_FPS_RENDER]);

                this._cachef[QECACHEF_ELAPSED_TIME_RENDER] -= this._frames_passed * this._cachef[QECACHEF_FPS_RENDER];
                this.render(this._frames_passed * this._cachef[QECACHEF_FPS_RENDER]);
                this._cachei[QECACHEI_FRAME_COUNTER] += 1;
            }
        }
        this._delta_clock.start();

        // TODO: Set a delay here?
    },

    _clear_frames: function() {
        this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] = 0.0;
        this._cachef[QECACHEF_ELAPSED_TIME_LOGIC]   = 0.0;
        this._cachef[QECACHEF_ELAPSED_TIME_RENDER]  = 0.0;
        this._cachef[QECACHEF_ELAPSED_TIME_SECOND]  = 0.0;
        this._cachei[QECACHEI_FRAME_COUNTER]        = 0;
    },

});
