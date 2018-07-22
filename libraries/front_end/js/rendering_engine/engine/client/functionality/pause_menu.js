'use strict';

const COOKIE_KEY_SHOULD_REMEMBER_USERNAME = 'q0'; // #pre-process_global_constant
const COOKIE_KEY_REMEMBERED_USERNAME      = 'q1'; // #pre-process_global_constant

$_QE.prototype.ClientFunctionalityPauseMenu = function() {

    this.pause_background = new $_QE.prototype.DomElement('paused_background_filter', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, false);
    this.pause_menu       = new $_QE.prototype.DomElement('pause_display', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, false);
    this.pause_menu.set_display_style('table');
    this.pause_title      = new $_QE.prototype.DomElement('pause_display_title', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_H1, true);
    this.pause_sub_title  = new $_QE.prototype.DomElement('pause_display_sub_title', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_H5, true);

    this.show_error = function(title, sub_title) {
        this.set_pause_menu_title_and_sub_title(title, sub_title);
        this.show_pause_menu();
    };

    this.show_paused = function() {
        this.set_pause_menu_title_and_sub_title('Paused 😴', 'double click to resume');
        this.show_pause_menu();
    };

    this.set_sub_title = function(sub_title) {
        this.pause_sub_title.update_text(sub_title);
    };

    this.set_pause_menu_title_and_sub_title = function(title, sub_title) {
        this.pause_title.update_text(title);
        this.pause_sub_title.update_text(sub_title);
    };

    this.show_pause_menu = function() {
        this.pause_menu.show();
        this.pause_background.show();
    };

    this.hide_pause_menu = function() {
        this.pause_menu.hide();
        this.pause_background.hide();
    };
};