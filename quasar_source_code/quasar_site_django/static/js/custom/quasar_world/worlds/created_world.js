'use strict';

function CreatedWorld() {
    this.__init__();
}

CreatedWorld.prototype = {

    __init__: function() {
        this.loaded = false;
        
        // Inherit.
        World.call(this);
    },

    create: function() {
        MANAGER_WORLD.create_world(this);

        // Add the world label and settings panel.
        this.world_title = 'TODO : this might need to be loaded.';


        var world_wall_width = 250;
        var world_wall_height = 500;

        var world_wall_position = new THREE.Vector3(500, 500, 500);
        var world_wall_normal = new THREE.Vector3(-500, 0, -500);

        this.world_wall = new FloatingWall(world_wall_width, world_wall_height, world_wall_position, world_wall_normal, this, false);
        this.world_wall.add_full_row_3D(-1, 'TODO : World name here', TYPE_SUPER_TITLE);

        var current_row = this.world_wall.add_row(null);
        current_row.add_2D_element([0, ONE_THIRD], 'World Name :', TYPE_CONSTANT);
        current_row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);

        // Adding a row for spacing.
        current_row = this.world_wall.add_row(null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_2D_button([0, 1], 'Set World To Private', null, null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_2D_button([0, 1], 'Share With Player', null, null);

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
    }

};
