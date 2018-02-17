'use strict';

function CreatedWorld() {
    this.__init__();
}

CreatedWorld.prototype = {

    __init__: function() {
        this.loaded = false;
    },

    create: function() {
        // Inherit.
        World.call(this);

        MANAGER_WORLD.create_world(this);

        // Add the world label and settings panel.
        this.world_title = 'TODO : this might need to be loaded.';

        this.loaded = true;
    },

    prepare_for_save: function() {
        // TODO :
    },

    enter_world: function() {
        if (!this.loaded) {
            this.create();
        }

        CURRENT_PLAYER.disengage();
        if (!GUI_PAUSED_MENU.currently_displayed) {
            CURRENT_PLAYER.enable_controls();
        }
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);
    },

    exit_world: function() {
    },


};
