'use strict';

$_QE.prototype.FeatureAnimationStep = function(duration, fade, offset_y) {

    this._animation_duration = duration;
    this._animation_fade     = fade;
    this._animation_y_offset = offset_y;
    this._animation_y_end    = 0;
    this._animation_y_start  = 0;

    this._animation_elapsed_time = 0;

    this.animation_pre_start = function() {
        if (this._animation_y_offset != null) {
            let n = this._node_head;
            while (n != null) {
                n._animation_y_end   = n._get_relative_y();
                n._animation_y_start = n._get_relative_y() + this._animation_y_offset;

                if (this._animation_fade) {
                    n._set_opacity(0);
                }

                n = n._node_next;
            }
        }

    };

    this.animation_start = function() {
        this._animation_elapsed_time = 0;
    };

    this.animation_step = function(time) {
        this._animation_elapsed_time += time;
        if (this._animation_elapsed_time >= this._animation_duration) {
            this._animation_elapsed_time = this._animation_duration;
        }

        let t = this._animation_elapsed_time / this._animation_duration;

        //this.get_object().position.y = THREE.Math.lerp(this._animation_y_start, this._animation_y_end, this._animation_elapsed_time / this._animation_duration);
        // TEMPORARY:
        //this.refresh();

        let n = this._node_head;
        while (n != null) {
            n._set_opacity(t);
            n._set_relative_y(t);
            //n._animation_y_end   = n._get_relative_y();
            //n._animation_y_start = n._get_relative_y() + this._animation_y_offset;
            n = n._node_next;
        }
    };

    this.animation_is_done = function() {
        return this._animation_elapsed_time >= this._animation_duration;
    };

    this.animation_terminate_early = function() {
        let n = this._node_head;
        while (n != null) {
            n._set_opacity(1.0);
            //n._set_relative_y(1.0);
            n._reset_relative_y();

            //n._animation_y_end   = n._get_relative_y();
            //n._animation_y_start = n._get_relative_y() + this._animation_y_offset;
            n = n._node_next;
        }

        this._animation_completed    = false;
        this._animation_elapsed_time = 0;
    };

    this.animation_stop = function() {
        this._animation_completed    = true;
        this._animation_elapsed_time = 0;
    };

};
