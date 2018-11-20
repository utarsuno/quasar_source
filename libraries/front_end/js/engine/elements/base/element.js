'use strict';

$_QE.prototype.Element = function() {};

Object.assign(
    $_QE.prototype.Element.prototype,
    {
        initialize_element_data: function() {
            this.initialize_events_and_flags();
        },

        get_object: function() {
            if (this.group != null) {
                return this.group;
            }
            return this.mesh;
        },

        _update_element_animation: function(delta) {
            if (this.flag_is_on(EFLAG_IS_IN_ANIMATION)) {
                if (this.flag_is_on(EFLAG_IS_IN_REVERSED_ANIMATION)) {
                    this.animation_step_reverse(delta);
                } else {
                    this.animation_step_forward(delta);
                }
            }
        },
    }
);


