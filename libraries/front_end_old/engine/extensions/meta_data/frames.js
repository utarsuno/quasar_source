Object.assign($_QE.prototype, {

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

                this.hud_date_time.content_update();
                this.hud_date_time.update();
            }

            if (this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] >= this._cachef[QECACHEF_FPS_PHYSICS]) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] / this._cachef[QECACHEF_FPS_PHYSICS]);

                this._cachef[QECACHEF_ELAPSED_TIME_PHYSICS] -= this._frames_passed * this._cachef[QECACHEF_FPS_PHYSICS];
                while (this._frame_iteration < this._frames_passed) {
                    this.manager_world.physics(this._cachef[QECACHEF_FPS_PHYSICS]);
                    ++this._frame_iteration;

                    // U P D A T E - H U D.
                    this.hud_debug.content_update(this._cachef[QECACHEF_FPS_PHYSICS]);
                    this.manager_world.player_cursor.update();
                    this._pause_menu._update_element_animation(this._cachef[QECACHEF_FPS_PHYSICS]);
                }

                // R E N D E R - H U D.
                this.hud_debug.update();
                //this.hud_date_time.update();
                this.hud_typing.update();
                this.hud_chat.update();
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
        } else {
            // Update the pause menu during pause.
            this._delta = this._delta_clock.getDelta();
            this._cachef[QECACHEF_ELAPSED_TIME_PAUSED] += this._delta;

            if (this._cachef[QECACHEF_ELAPSED_TIME_PAUSED] >= this._cachef[QECACHEF_FPS_PAUSED]) {
                // Reset.
                this._frame_iteration = 0;
                this._frames_passed   = Math.floor(this._cachef[QECACHEF_ELAPSED_TIME_PAUSED] / this._cachef[QECACHEF_FPS_PAUSED]);
                this._cachef[QECACHEF_ELAPSED_TIME_PAUSED] -= this._frames_passed * this._cachef[QECACHEF_FPS_PAUSED];
                while (this._frame_iteration < this._frames_passed) {
                    ++this._frame_iteration;
                    this._pause_menu._update_element_animation(this._cachef[QECACHEF_FPS_PAUSED]);
                }
            }
        }
        this._delta_clock.start();

        // TODO: Set a delay here?
    },

});
