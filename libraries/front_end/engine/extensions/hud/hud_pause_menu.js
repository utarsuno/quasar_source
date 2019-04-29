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
            this.engine.pause_background.dom_element_set_background_color(QE.COLOR_RGBA_FADE_RANGE[this._get_color_needed(0.5, time)]);
            this.engine.pause_menu.dom_element_set_foreground_color(QE.COLOR_RGBA_FADE_RANGE_PAUSE_TEXT[this._get_color_needed(1.0, time)]);
            this.engine.pause_menu.dom_element_set_background_color(QE.COLOR_RGBA_FADE_RANGE[this._get_color_needed(0.55, time)]);
            this.engine.pause_menu.dom_element_set_border_color(QE.COLOR_RGBA_FADE_RANGE_BORDER[this._get_color_needed(0.77, time)]);
        },

        _initialize_animation_sequence: function(duration_seconds) {
            this.__init__animation_sequence();
            $_QE.prototype.FeatureAnimationStep.call(this, duration_seconds);
            this._add_animation_step(this, duration_seconds);
            this.animation_set_to_completed_state();
        },

        set_to_invisible: function() {
            // Not going to perform extra DOM operations of setting display=none for now.
        },

        set_to_visible: function() {

        },
    }
);

Object.assign($_QE.prototype,
    {

        __init__hud_pause_menu: function() {
            this.pause_background = new $_QE.prototype.DomElement().__init__external(GLOBAL_ID_PAUSED_BACKGROUND_FILTER);
            this.pause_menu       = new $_QE.prototype.DomElement().__init__external(GLOBAL_ID_PAUSE_DISPLAY, 'table');
            this.pause_title      = new $_QE.prototype.DomElementText().__init__(GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE);
            this.pause_sub_title  = new $_QE.prototype.DomElementText().__init__(GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE);
            this._pause_menu      = new $_QE.prototype._PauseMenu(this);
        },

        _update_pause_menu: function(delta) {
            this._pause_menu._update_element_animation(delta);
        },

        pause_menu_show_error: function (title, sub_title) {
            this.pause_menu_set_title_and_sub_title(title, sub_title);
            this._show_pause_menu();
        },

        pause_menu_fade_in: function() {
            this.pause_menu_set_title_and_sub_title('Paused 😴', 'double click to resume');
            this._show_pause_menu();
            this._pause_menu.animation_play_forward(false, false);
        },

        pause_menu_set_sub_title: function(sub_title) {
            this.pause_sub_title.update_text(sub_title);
        },

        pause_menu_set_title_and_sub_title: function(title, sub_title) {
            this.pause_title.update_text(title);
            this.pause_sub_title.update_text(sub_title);
        },

        _show_pause_menu: function() {
            this.pause_menu.show();
            this.pause_background.show();
        },

        pause_menu_fade_out: function() {
            this._pause_menu.animation_play_reverse(false, false);
        },

    }
);

/*
        pause_menu_show: function() {
            this.pause_menu_set_title_and_sub_title('Paused 😴', 'double click to resume');
            this._show_pause_menu();
        },

        _hide_pause_menu: function() {
            this.pause_menu.hide();
            this.pause_background.hide();
        },
 */