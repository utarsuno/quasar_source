'use strict'

// TODO : All the 2d gui work should be abstracted
// TODO : research the efficiency of updating html text elements


var PAUSED_MENU = new PausedMenu()


function PausedMenu() {
    this.__init__()
}

PausedMenu.prototype = {

    button_resume: null,
    button_settings: null,
    button_help_controls: null,
    button_log_out: null,

    __init__: function() {
        // this.x_coordinate = document.getElementById('x_coordinate')

        this.button_resume = document.getElementById('button_resume')

    }
}
