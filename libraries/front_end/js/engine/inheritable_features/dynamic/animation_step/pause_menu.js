'use strict';

$_QE.prototype.FeatureAnimationStepPauseMenu = function(parent, duration) {

    this.parent = parent;

    $_QE.prototype.FeatureAnimationStep.call(this, duration, true);

    this.update_animation_pause_menu = function(delta) {

    };

    this._animate_row_step = function(time) {
        // TODO: Temp.
        let color = Math.floor(THREE.Math.lerp(0.0, 0.5, time) * 100);
        let color2 = Math.floor(THREE.Math.lerp(0.0, 1.0, time) * 100);
        let color3 = Math.floor(THREE.Math.lerp(0.0, 0.55, time) * 100);
        let color4 = Math.floor(THREE.Math.lerp(0.0, 0.77, time) * 100);
        QE.pause_background.dom_element_set_background_color(QE.COLOR_RGBA_FADE_RANGE[color]);
        QE.pause_menu.dom_element_set_foreground_color(QE.COLOR_RGBA_FADE_RANGE_PAUSE_TEXT[color2]);
        QE.pause_menu.dom_element_set_background_color(QE.COLOR_RGBA_FADE_RANGE[color3]);
        QE.pause_menu.dom_element_set_border_color(QE.COLOR_RGBA_FADE_RANGE_BORDER[color4]);
    };


    /*
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
    };*/

};
