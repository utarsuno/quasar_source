'use strict';

$_QE.prototype.FeatureAnimationSequencePauseMenu = function() {};

Object.assign(
    $_QE.prototype.FeatureAnimationSequencePauseMenu.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        _initialize_animation_sequence: function(parent, duration_seconds) {
            this.__init__animation_sequence();
            this._add_animation_step(new $_QE.prototype.FeatureAnimationStepPauseMenu(parent, duration_seconds), duration_seconds);
        },

        _animation_start_forward: function() {
            this.flag_set_on(EFLAG_IS_IN_ANIMATION);
            this._a_elapsed_time = 0.0;
            this._a_current_step = 0;
            this._a_steps[0].animation_step_start_forward();
        },

        _animation_start_reverse: function() {
            this.flag_set_on(EFLAG_IS_IN_ANIMATION);
            this.flag_set_on(EFLAG_IS_IN_REVERSED_ANIMATION);
            this._a_elapsed_time = this._a_duration;
            this._a_current_step = this._a_steps.length - 1;
            this._a_steps[this._a_current_step].animation_step_start_reversed(null);
        },

        _animate_row_step: function(delta) {
            l('TODO: Pause menu: animate row step');
        },
    }
);
