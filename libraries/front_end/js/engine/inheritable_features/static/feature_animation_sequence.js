'use strict';

$_QE.prototype.FeatureAnimationSequence = function() {
};

$_QE.prototype.FeatureAnimationSequence.prototype = {

    _initialize_animation_sequence: function() {
        this.set_flag(EFLAG_IN_ANIMATION, false);

        this._animation_steps        = [];
        //this._animation_duration     = 0.0;

        //this._animation_elapsed_time = 0.0;
        this._animation_current_step = 0;
    },

    // Temporary parameters until a more flexible design is needed.
    _add_animation_step: function(object, duration, fade, offset_y) {
        object.set_to_animation_step(duration, fade, offset_y);
        this._animation_steps.push(object);
        //this._animation_duration += duration;
    },

    animation_start: function() {
        this.set_flag(EFLAG_IN_ANIMATION, true);
        //this._animation_elapsed_time = 0.0;

        let a;
        for (a = 0; a < this._animation_steps.length; a++) {
            this._animation_steps[a].animation_pre_start();
        }

        this._animation_current_step = 0;
        this._animation_steps[0].animation_start();
    },

    animation_step: function(delta) {
        let a = this._animation_steps[this._animation_current_step];

        a.animation_step(delta);
        if (a.animation_is_done()) {
            a.animation_stop();
            this._animation_current_step++;
            if (this._animation_current_step == this._animation_steps.length) {
                this.animation_stop();
            } else {
                this._animation_steps[this._animation_current_step].animation_start();
            }
        }
    },

    animation_terminate_early: function() {
        let a;
        for (a = 0; a < this._animation_steps.length; a++) {
            this._animation_steps[a].animation_terminate_early();
        }
        this.animation_stop();
    },

    animation_stop: function() {
        this.set_flag(EFLAG_IN_ANIMATION, false);
        this._animation_current_step = 0;
        //this._animation_elapsed_time = 0;
    },

};
