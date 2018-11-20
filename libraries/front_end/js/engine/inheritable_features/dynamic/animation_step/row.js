'use strict';

$_QE.prototype.FeatureAnimationStepRow = function(duration, offset_y) {

    $_QE.prototype.FeatureAnimationStep.call(this, duration, true);

    this._animation_y_offset = offset_y;
    this._animation_y_end    = 0;
    this._animation_y_start  = 0;

    this.animation_step_pre_start = function() {
        if (this._animation_y_offset != null) {
            let n = this._node_head;
            while (n != null) {
                n._animation_y_end   = n._get_relative_y();
                n._animation_y_start = n._get_relative_y() + this._animation_y_offset;

                //if (this._animation_fade) {
                //    n._set_opacity(0);
                //}

                n = n._node_next;
            }
        }
    };

    this.animation_step_set_opacity = function(opacity) {
        if (this._animation_fade) {
            this._animate_set_nodes_opacity(opacity);
        }
    };

};
