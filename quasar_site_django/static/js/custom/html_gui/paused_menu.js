'use strict';

function PausedMenu() {
    this.__init__();
}

PausedMenu.prototype = {

    __init__: function() {
        this.background_coloring = new DomElement('background_coloring');
        this.pause_menu          = new DomElement('pause_menu');
        this.pause_menu.set_display_style('table');
        this.pause_title         = new DomElement('menu_title');
        this.pause_sub_title     = new DomElement('menu_header');
    },

    make_visible: function() {
        this.pause_menu.show();
        this.background_coloring.set_id('background_coloring');
    },

    make_invisible: function() {
        this.pause_menu.hide();
        this.background_coloring.set_id('no_background_coloring');
    },

    set_text: function(t) {
        this.pause_title.set_text(t);
    },

    set_sub_text: function(t) {
        this.pause_sub_title.set_text(t);
    },

    set_to_paused: function() {
        this.set_text('paused');
        this.set_sub_text('double click anywhere to resume');
        this.make_visible();
    }
};
