'use strict';

$_QE.prototype.FeatureAnimationSequenceRows = function() {};

Object.assign(
    $_QE.prototype.FeatureAnimationSequenceRows.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        _initialize_animation_sequence: function() {
            this.__init__animation_sequence();
            this._a_calculated = false;
        },

        _add_animation_to_row: function(object, duration, fade, offset_y) {
            object.set_to_animation_step(duration, fade, offset_y);
            this._add_animation_step(object, duration);
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

    }
);
