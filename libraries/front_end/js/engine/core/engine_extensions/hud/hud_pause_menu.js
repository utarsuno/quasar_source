'use strict';

$_QE.prototype._PauseMenu = function() {
    this.initialize_element_data();
    this._initialize_animation_sequence(this, 0.15);
};

Object.assign(
    $_QE.prototype._PauseMenu.prototype,
    $_QE.prototype.Element.prototype,
    $_QE.prototype.FeatureAnimationSequencePauseMenu.prototype,
    {

    }
);

Object.assign($_QE.prototype,
    {

        _initialize_hud_pause_menu: function() {
            this.pause_background = new $_QE.prototype.DomElementExternal().initialize_dom_element(GLOBAL_ID_PAUSED_BACKGROUND_FILTER);
            this.pause_menu       = new $_QE.prototype.DomElementExternal().initialize_dom_element(GLOBAL_ID_PAUSE_DISPLAY, 'table');
            this.pause_title      = new $_QE.prototype.DomTextExternal().initialize_dom_text(GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE);
            this.pause_sub_title  = new $_QE.prototype.DomTextExternal().initialize_dom_text(GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE);
            this._pause_menu      = new $_QE.prototype._PauseMenu();
        },

        _update_pause_menu: function(delta) {
            this._pause_menu._a_steps[0].parent._update_element_animation(delta);
        },

        pause_menu_show_error: function (title, sub_title) {
            this.pause_menu_set_title_and_sub_title(title, sub_title);
            this._show_pause_menu();
        },

        pause_menu_fade_in: function() {
            this.pause_menu_set_title_and_sub_title('Paused 😴', 'double click to resume');
            this._show_pause_menu();
            this._pause_menu.animation_play_forward_once();
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
            // TODO: On finish, HIDE!
            this._pause_menu.animation_play_reversed_once();
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