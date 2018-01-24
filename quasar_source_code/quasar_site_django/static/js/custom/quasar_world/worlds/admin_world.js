'use strict';

function AdminWorld() {
    this.__init__();
}

AdminWorld.prototype = {

    __init__: function () {
        World.call(this);



    },

    create: function() {
    },

    enter_world: function() {
        CURRENT_PLAYER.disengage();
        if (!GUI_PAUSED_MENU.currently_displayed) {
            CURRENT_PLAYER.enable_controls();
        }
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);
    },

    exit_world: function() {
    }
};