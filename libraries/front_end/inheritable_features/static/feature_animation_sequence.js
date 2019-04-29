'use strict';

$_QE.prototype.FeatureAnimationSequence = function() {};

$_QE.prototype.FeatureAnimationSequence.prototype = {

    __init__animation_sequence: function() {
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);
        this._a_steps    = [];
        this._a_duration = 0.0;
        this._animation_reset_forward(true);
    },

    _add_animation_step: function(object, duration) {
        this._a_steps.push(object);
        this._a_duration += duration;
    },

    animation_stop: function() {
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);
    },

    animation_close: function() {
        this.animation_stop();
        this.set_to_invisible();
        this._animation_reset_forward(this);
    },

    animation_set_to_completed_state: function() {
        this._animation_completed(true);
    },

    _animation_completed: function(forward) {
        this.flag_set_on(EFLAG_IS_ANIMATION_COMPLETED);
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);
        if (forward) {
            this._animation_reset_reverse(false);
        } else {
            this.flag_set_off(EFLAG_IS_IN_REVERSED_ANIMATION);
            this._animation_reset_forward(false);
            this.set_to_invisible();
        }
    },

    // ------------------------------------------------------------------------------------------------------------
    animation_is_finished_forward: function() {
        return this._a_elapsed_time === this._a_duration && this.flag_is_on(EFLAG_IS_ANIMATION_COMPLETED);
    },
    animation_is_finished_reverse: function() {
        return this._a_elapsed_time === 0 && this.flag_is_on(EFLAG_IS_ANIMATION_COMPLETED);
    },
    // ------------------------------------------------------------------------------------------------------------
    _animation_reset_forward: function(reset_flag) {
        this._a_elapsed_time = 0.0;
        this._a_current_step = 0;
        if (reset_flag) {
            this.flag_set_off(EFLAG_IS_ANIMATION_COMPLETED);
        }
    },
    _animation_reset_reverse: function(reset_flag) {
        this._a_elapsed_time = this._a_duration;
        this._a_current_step = this._a_steps.length - 1;
        if (reset_flag) {
            this.flag_set_off(EFLAG_IS_ANIMATION_COMPLETED);
        }
    },
    // ------------------------------------------------------------------------------------------------------------
    _animation_resume_forward: function() {
        this.flags_set_off(EFLAG_IS_IN_REVERSED_ANIMATION, EFLAG_IS_ANIMATION_COMPLETED);
        this.flag_set_on(EFLAG_IS_IN_ANIMATION);
    },
    _animation_resume_reverse: function() {
        this.flags_set_on(EFLAG_IS_IN_REVERSED_ANIMATION, EFLAG_IS_IN_ANIMATION);
        this.flag_set_off(EFLAG_IS_ANIMATION_COMPLETED);
    },
    // ------------------------------------------------------------------------------------------------------------
    _animation_start_forward: function(reset) {
        if (reset) {
            this._animation_reset_forward(true);
        }
        this._animation_resume_forward();
        if (this._animation_on_start_forward != null) {
            this._animation_on_start_forward();
        }
        this._a_steps[0].animation_step_start_forward();
    },
    _animation_start_reverse: function(reset) {
        if (reset) {
            this._animation_reset_reverse(true);
        }
        this._animation_resume_reverse();
        if (this._animation_on_start_reverse != null) {
            this._animation_on_start_reverse();
        }
        this._a_steps[this._a_current_step].animation_step_start_reversed(null);
    },
    // ------------------------------------------------------------------------------------------------------------
    animation_play_forward: function(reset_if_already_completed=false, force_reset=false) {
        if (force_reset || (reset_if_already_completed && this.animation_is_finished_forward())) {
            this._animation_start_forward(true);
        } else if (!this.animation_is_finished_forward()) {
            if (this.flag_is_on(EFLAG_IS_IN_ANIMATION)) {
                this._animation_resume_forward();
            } else {
                this._animation_start_forward(false);
            }
        }
    },
    animation_play_reverse: function(reset_if_already_completed=false, force_reset=false) {
        if (force_reset || (reset_if_already_completed && this.animation_is_finished_reverse())) {
            this._animation_start_reverse(true);
        } else if (!this.animation_is_finished_reverse()) {
            if (this.flag_is_on(EFLAG_IS_IN_ANIMATION)) {
                this._animation_resume_reverse();
            } else {
                this._animation_start_reverse(false);
            }
        }
    },
    // ------------------------------------------------------------------------------------------------------------
    animation_step_forward: function(delta) {
        if (this.flag_is_off(EFLAG_IS_VISIBLE)) {
            this.set_to_visible();
        }
        this._a_elapsed_time += delta;
        let excess_time = this._a_steps[this._a_current_step]._animation_step_forward(delta);
        if (this._a_steps[this._a_current_step].animation_step_is_finished_forward()) {
            this._a_current_step++;
            if (this._a_current_step === this._a_steps.length) {
                this._animation_completed(true);
            } else {
                this._a_steps[this._a_current_step].animation_step_start_forward(excess_time);
            }
        }
    },
    animation_step_reverse: function(delta) {
        this._a_elapsed_time -= delta;
        let excess_time = this._a_steps[this._a_current_step]._animation_step_reverse(delta);
        if (this._a_steps[this._a_current_step].animation_step_is_finished_reverse()) {
            this._a_current_step--;
            if (this._a_current_step === -1) {
                this._animation_completed(false);
            } else {
                this._a_steps[this._a_current_step].animation_step_start_reversed(excess_time);
            }
        }
    },
    // ------------------------------------------------------------------------------------------------------------
};
