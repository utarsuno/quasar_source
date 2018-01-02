'use strict';

// TODO : All the 2d gui work should be abstracted
// TODO : research the efficiency of updating html text elements

function PausedMenu() {
    this.__init__();
}

PausedMenu.prototype = {

    pause_menu: null,
    background_coloring: null,

    button_resume: null,
    button_help_controls: null,
    button_log_out: null,

    __init__: function() {

        // The paused menu starts off displayed.
        this.currently_displayed = true;

        this.background_coloring  = document.getElementById('background_coloring');
        this.pause_menu           = document.getElementById('pause_menu');
        this.pause_title          = document.getElementById('menu_title');
        this.pause_sub_title      = document.getElementById('menu_header');
        this.button_resume        = document.getElementById('button_resume');
        this.button_help_controls = document.getElementById('button_help_controls');
        this.button_log_out       = document.getElementById('button_log_out');

        this.button_resume.onclick = function() {
            this.make_invisible();
            GUI_PAUSED_MENU.make_invisible();
            MANAGER_POINTER_LOCK.request_pointer_lock();
            CURRENT_PLAYER.pointer_lock_api.request_pointer_lock();
        }.bind(this);

        this.button_help_controls.onclick = function() {

        }.bind(this);

        this.button_log_out.onclick = function() {
            CURRENT_PLAYER.log_out();
        }.bind(this);

        // TODO : Change the title once everything has fully loaded.
        this.pause_title.innerHTML = 'Paused!';
        this.pause_sub_title.style.display = DISPLAY_SHOW;
    },

    make_visible: function() {
        this.currently_displayed = true;

        this.pause_menu.style.display = DISPLAY_SHOW;
        this.button_resume.style.display = DISPLAY_SHOW;
        this.button_help_controls.style.display = DISPLAY_SHOW;
        if (CURRENT_PLAYER.logged_in) {
            this.button_log_out.style.display = DISPLAY_SHOW;
        }

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

    is_visible: function() {
        return this.currently_displayed;
    }
};

