'use strict';

function CreatedWorld(created_world_entity, created_world_manager_entity) {
    this.__init__(created_world_entity, created_world_manager_entity);
}

CreatedWorld.prototype = {

    __init__: function(created_world_entity, created_world_manager_entity) {
        // Inherit.
        World.call(this);

        this.entity                       = created_world_entity;
        this.created_world_manager_entity = created_world_manager_entity;

        this.world_name = 'THIS SHOULD BE SET';
        if (is_defined(this.entity)) {
            this.world_name = this.entity.get_value(ENTITY_PROPERTY_NAME);
        }
    },

    get_shared_player_list: function() {
        var shared_player_data = this.created_world_manager_entity.get_value(ENTITY_PROPERTY_SHARED_PLAYERS_LIST);
        // TODO : Finish this function
    },

    button_action_set_to_private: function() {

    },

    button_action_share_with_player: function() {

    },

    world_name_changed: function(name_currently) {
        this.world_title.update_text(name_currently);
        this.world_name = name_currently;
    },

    create: function() {
        // Add the world label and settings panel.

        var world_wall_width = 400;
        var world_wall_height = 300;

        var world_wall_position = new THREE.Vector3(500, 500, 500);
        var world_wall_normal = new THREE.Vector3(-500, 0, -500);

        this.world_wall = new FloatingWall(world_wall_width, world_wall_height, world_wall_position, world_wall_normal, this, false);
        this.world_title = this.world_wall.add_row(-1).add_3D_element('New World', TYPE_TITLE);

        var current_row = this.world_wall.add_row(null);
        current_row.add_2D_element([0, ONE_THIRD], 'World Name :', TYPE_CONSTANT);
        this.world_name_input = current_row.add_2D_element([ONE_THIRD, 1], '', TYPE_INPUT);
        this.world_name_input.set_value_post_changed_function(this.world_name_changed.bind(this));

        // Adding a row for spacing.
        current_row = this.world_wall.add_row(null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_2D_button([0, 1], 'Set World To Private', null, null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_2D_button([0, 1], 'Share With Player', null, null);

        this.world_wall.refresh_position_and_look_at();


    },

    prepare_for_save: function() {
        // TODO :
        l('SAVE THIS CREATED WORLD!!!');

        l('Saving this world name');

        this.entity.set_property(ENTITY_PROPERTY_NAME, this.world_name);
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
