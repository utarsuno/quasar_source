'use strict';

Object.assign($_QE.prototype.HUDManager.prototype, {
    pause_background: new $_QE.prototype.DomElement(GLOBAL_ID_PAUSED_BACKGROUND_FILTER, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV),
    pause_menu      : new $_QE.prototype.DomElement(GLOBAL_ID_PAUSE_DISPLAY, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV),
    //pause_menu.set_display_style('table'),
    pause_title     : new $_QE.prototype.DomElementText(GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_H1),
    pause_sub_title : new $_QE.prototype.DomElementText(GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_H5),

    show_error: function(title, sub_title) {
        this.set_pause_menu_title_and_sub_title(title, sub_title);
        this.show_pause_menu();
    },

    show_paused: function() {
        this.set_pause_menu_title_and_sub_title('Paused 😴', 'double click to resume');
        this.show_pause_menu();
    },

    set_sub_title: function(sub_title) {
        this.pause_sub_title.update_text(sub_title);
    },

    set_pause_menu_title_and_sub_title: function(title, sub_title) {
        this.pause_title.update_text(title);
        this.pause_sub_title.update_text(sub_title);
    },

    show_pause_menu: function() {
        this.pause_menu.show();
        this.pause_background.show();
    },

    hide_pause_menu: function() {
        this.pause_menu.hide();
        this.pause_background.hide();
    },
});
