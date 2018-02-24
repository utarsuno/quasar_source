'use strict';

// TODO : All the 2d gui work should be abstracted
// TODO : research the efficiency of updating html text elements

function PausedMenu() {
    this.__init__();
}

PausedMenu.prototype = {

    pause_menu: null,
    background_coloring: null,

    __init__: function() {
        this.background_coloring  = document.getElementById('background_coloring');
        this.pause_menu           = document.getElementById('pause_menu');
        this.pause_title          = document.getElementById('menu_title');
        this.pause_sub_title      = document.getElementById('menu_header');

        // TODO : Change the title once everything has fully loaded.
        //this.pause_title.innerHTML = 'Paused!';
        //this.pause_sub_title.style.display = DISPLAY_SHOW;
    },

    make_visible: function() {
        this.pause_menu.style.display = DISPLAY_SHOW;
        this.background_coloring.id = 'background_coloring';
    },

    make_invisible: function() {
        if (this.currently_displayed) {
            this.pause_menu.style.display = DISPLAY_NONE;
            // TODO : Testing this out.
            //this.button_resume.style.display = DISPLAY_NONE
            //this.button_help_controls.display = DISPLAY_NONE
            //this.button_log_out.display = DISPLAY_NONE
            this.background_coloring.id = 'no_background_coloring';
        }
        this.currently_displayed = false;
    },

    set_text: function(t) {
        if (is_defined(t)) {
            this.pause_title.innerHTML = t;
        } else {
            this.pause_title.innerHTML = '';
        }
    },

    set_sub_text: function(t) {
        if (is_defined(t)) {
            this.pause_sub_title.innerHTML = t;
        } else {
            this.pause_sub_title.innerHTML = '';
        }
    },

    ajax_start: function(title, sub_title) {
        this.set_text(title);
        this.set_sub_text(sub_title);
        this.make_visible();
    },

    ajax_finish: function() {
        this.make_invisible();
    },

    set_to_paused: function() {
        this.set_text('paused');
        this.set_sub_text('double click anywhere to resume');
        this.make_visible();
    }
};
