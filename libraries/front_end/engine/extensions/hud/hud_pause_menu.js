'use strict';

$_QE.prototype._PauseMenu = function(engine) {
    this.engine = engine;
    this.initialize_element_data();
    this._initialize_animation_sequence(0.15);
};

Object.assign(
    $_QE.prototype._PauseMenu.prototype,
    $_QE.prototype.Element.prototype,
    $_QE.prototype.FeatureAnimationSequence.prototype,
    {
        _get_color_needed: function(max, time) {
            return Math.floor(THREE.Math.lerp(0.0, max, time) * 100);
        },

        _animation_step_set_elapsed_time: function(time) {
            this.engine.pause_background.dom_element_set_background_color(this.engine.COLOR_RGBA_FADE_RANGE[this._get_color_needed(0.5, time)]);
            this.engine.pause_menu.dom_element_set_foreground_color(this.engine.COLOR_RGBA_FADE_RANGE_PAUSE_TEXT[this._get_color_needed(1.0, time)]);
            this.engine.pause_menu.dom_element_set_background_color(this.engine.COLOR_RGBA_FADE_RANGE[this._get_color_needed(0.55, time)]);
            this.engine.pause_menu.dom_element_set_border_color(this.engine.COLOR_RGBA_FADE_RANGE_BORDER[this._get_color_needed(0.77, time)]);
        },

        _initialize_animation_sequence: function(duration_seconds) {
            this.__init__animation_sequence();
            $_QE.prototype.FeatureAnimationStep.call(this, duration_seconds);
            this._add_animation_step(this, duration_seconds);
            this.animation_set_to_completed_state();
        },
    }
);

Object.assign($_QE.prototype,
    {

        pause_menu_show_error: function (title, sub_title) {
            this.pause_title.update_text(title);
            this.pause_sub_title.update_text(sub_title);
            this.pause_menu.show();
            this.pause_background.show();
        },

        pause_menu_fade_in: function() {
            this.pause_title.update_text('Paused 😴');
            this.pause_sub_title.update_text('double click to resume');
            this.pause_menu.show();
            this.pause_background.show();
            this._pause_menu.animation_play_forward(false, false);
        },

        pause_menu_fade_out: function() {
            this._pause_menu.animation_play_reverse(false, false);
        },

    }
);
