'use strict';

$_QE.prototype.FeatureAnimationSequence = function() {};

$_QE.prototype.FeatureAnimationSequence.prototype = {

    _initialize_animation_sequence: function() {
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);

        this._a_steps        = [];
        this._a_duration     = 0.0;
        this._a_elapsed_time = 0.0;
        this._a_current_step = 0;

        this._a_calculated   = false;
    },

    // Temporary parameters until a more flexible design is needed.
    _add_animation_step: function(object, duration, fade, offset_y) {
        l(object);
        object.set_to_animation_step(duration, fade, offset_y);
        this._a_steps.push(object);
        this._a_duration += duration;
    },

    animation_resume: function() {
        //this.flag_set_on(EFLAG_IS_IN_ANIMATION);
    },

    animation_play_reversed_once: function() {
        if (!this.animation_is_finished_reverse()) {
            this._animation_play_reversed();
        }
    },

    _animation_play_reversed: function() {
        if (this.flag_is_on(EFLAG_IS_IN_ANIMATION)) {
            if (this.flag_is_off(EFLAG_IS_IN_REVERSED_ANIMATION)) {
                this.flag_set_on(EFLAG_IS_IN_REVERSED_ANIMATION);
            }
            this._animation_resume();
        } else {
            this._animation_start_reverse();
        }
    },

    //animation_reset

    animation_play_forward_once: function() {
        if (!this.animation_is_finished_forward()) {
            this._animation_play_forward();
        }
    },

    _animation_play_forward: function() {
        if (this.flag_is_on(EFLAG_IS_IN_ANIMATION)) {
            if (this.flag_is_on(EFLAG_IS_IN_REVERSED_ANIMATION)) {
                this.flag_set_off(EFLAG_IS_IN_REVERSED_ANIMATION);
            }
            this._animation_resume();
        } else {
            this._animation_start_forward();
        }
    },

    _animation_resume: function() {

    },

    _animation_start_forward: function() {
        this.flag_set_on(EFLAG_IS_IN_ANIMATION);
        this._a_elapsed_time = 0.0;
        this._a_current_step = 0;

        if (!this._a_calculated) {
            let a;
            for (a = 0; a < this._a_steps.length; a++) {
                this._a_steps[a].animation_step_pre_start();
            }
            this._a_calculated = true;
        }

        this._animation_set_node_opacities(0.0);
        this._a_steps[0].animation_step_start_forward();
    },

    _animation_start_reverse: function() {
        this.flag_set_on(EFLAG_IS_IN_ANIMATION);
        this.flag_set_on(EFLAG_IS_IN_REVERSED_ANIMATION);
        this._a_elapsed_time = this._a_duration;
        this._a_current_step = this._a_steps.length - 1;
        this._animation_set_node_opacities(1.0);
        this._a_steps[this._a_current_step].animation_step_start_reversed(null);
    },

    _animation_set_node_opacities: function(opacity) {
        let n;
        for (n = 0; n < this._a_steps.length; n++) {
            this._a_steps[n].animation_step_set_opacity(opacity);
        }
    },

    animation_step_forward: function(delta) {
        this._a_elapsed_time += delta;
        let excess_time = this._a_steps[this._a_current_step].animation_step_forward(delta);
        if (this._a_steps[this._a_current_step].animation_step_is_completed_for_forward()) {
            this._a_current_step++;
            if (this._a_current_step == this._a_steps.length) {
                this.animation_completed_forward();
            } else {
                this._a_steps[this._a_current_step].animation_step_start_forward(excess_time);
            }
        }
    },

    animation_step_reverse: function(delta) {
        this._a_elapsed_time -= delta;
        let excess_time = this._a_steps[this._a_current_step].animation_step_reverse(delta);
        if (this._a_steps[this._a_current_step].animation_step_is_completed_for_reverse()) {
            this._a_current_step--;
            if (this._a_current_step == -1) {
                this.animation_completed_reverse();
            } else {
                this._a_steps[this._a_current_step].animation_step_start_reversed(excess_time);
            }
        }
    },

    _animation_terminate_early: function() {
        let a;
        for (a = 0; a < this._a_steps.length; a++) {
            this._a_steps[a]._animation_terminate_early();
        }
    },

    animation_stop: function() {
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);
    },

    animation_is_running: function() {
        return this.flag_is_on(EFLAG_IS_IN_ANIMATION);
    },

    animation_completed_forward: function() {
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);
        this._a_current_step = this._a_steps.length - 1;
        this._a_elapsed_time = this._a_duration;
    },

    animation_completed_reverse: function() {
        this.flag_set_off(EFLAG_IS_IN_ANIMATION);
        this.flag_set_off(EFLAG_IS_IN_REVERSED_ANIMATION);
        this._a_current_step = 0;
        this._a_elapsed_time = 0;
    },

    animation_is_finished_forward: function() {
        return this._a_elapsed_time == this._a_duration;
    },

    animation_is_finished_reverse: function() {
        return this._a_elapsed_time == 0;
    },

};
