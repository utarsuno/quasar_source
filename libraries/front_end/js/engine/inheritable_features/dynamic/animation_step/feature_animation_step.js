'use strict';

$_QE.prototype.FeatureAnimationStep = function(duration, fade) {
    this._animation_duration     = duration;
    this._animation_fade         = fade;
    this._animation_elapsed_time = 0;

    this.animation_step_get_percentage_complete = function() {
        return this._animation_elapsed_time / this._animation_duration;
    };

    this.animation_step_set_opacity = function(opacity) {
        if (this._animation_fade) {
            this._animate_set_nodes_opacity(opacity);
        }
    };

    this.animation_step_start_forward = function(time=null) {
        if (time == null) {
            this._animation_elapsed_time = 0;
        } else {
            this._animation_elapsed_time = time;
        }
    };

    this.animation_step_start_reversed = function(time=null) {
        if (time == null) {
            this._animation_elapsed_time = this._animation_duration;
        } else {
            this._animation_elapsed_time = this._animation_duration - time;
        }
    };

    this.animation_step_is_completed_for_forward = function() {
        if (this._animation_elapsed_time >= this._animation_duration) {
            this._animation_elapsed_time = this._animation_duration;
            return true;
        }
        return false;
    };

    this.animation_step_is_completed_for_reverse = function() {
        if (this._animation_elapsed_time <= 0) {
            this._animation_elapsed_time = 0;
            return true;
        }
        return false;
    };

    this.animation_step_forward = function(time) {
        let excess_time = 0.0;
        this._animation_elapsed_time += time;
        if (this._animation_elapsed_time >= this._animation_duration) {
            excess_time = this._animation_elapsed_time - this._animation_duration;
            this._animation_elapsed_time = this._animation_duration;
            this._animate_row_step(1.0);
        } else {
            this._animate_row_step(this._animation_elapsed_time / this._animation_duration);
        }
        return excess_time;
    };

    this.animation_step_reverse = function(time) {
        let excess_time = 0.0;
        this._animation_elapsed_time -= time;
        if (this._animation_elapsed_time <= 0) {
            excess_time = this._animation_elapsed_time * -1;
            this._animation_elapsed_time = 0;
            this._animate_row_step(0);
        } else {
            this._animate_row_step(this._animation_elapsed_time / this._animation_duration);
        }
        return excess_time;
    };

    this.animation_stop = function() {
        //this._animation_completed = true;
    };

};
