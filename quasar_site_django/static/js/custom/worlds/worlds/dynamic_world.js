'use strict';

function DynamicWorld(dynamic_world_entity) {
    this.__init__(dynamic_world_entity);
}

DynamicWorld.prototype = {

    __init__: function(dynamic_world_entity) {
        // Inherit.
        World.call(this, dynamic_world_entity);
        // Inherit.
        WorldInput.call(this);
        // Inherit.
        WorldObjectSavingAndLoading.call(this);

        if (this.entity.has_property(ENTITY_PROPERTY_NAME)) {
            this.world_name = this.entity.get_value(ENTITY_PROPERTY_NAME);
        } else {
            this.world_name = 'New World';
        }

        this.world_name_changed = false;
    },

    button_action_set_to_private: function() {

    },

    button_action_share_with_player: function() {

    },

    world_name_changed_from_input_event: function(name_currently) {
        this.world_name_changed = true;
        this.world_name_changed_event(name_currently);

        MANAGER_WORLD.update_world_name_for_teleport_buttons(this);
    },

    world_name_changed_event: function(name_currently) {
        this.world_name_input.update_text(name_currently);
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
        this.world_wall.set_auto_adjust_height(true);
        this.world_title = this.world_wall.add_row(-1).add_3D_element(this.world_name, TYPE_TITLE);

        var current_row = this.world_wall.add_row(null);
        current_row.add_2D_element([0, ONE_THIRD], 'World Name :', TYPE_CONSTANT);
        this.world_name_input = current_row.add_2D_element([ONE_THIRD, 1], this.world_name, TYPE_INPUT);
        this.world_name_input.set_value_post_changed_function(this.world_name_changed_from_input_event.bind(this));

        // Adding a row for spacing.
        this.world_wall.add_row(null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_2D_button([0, 1], 'Set World To Private', null, null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_2D_button([0, 1], 'Share With Player', null, null);


        this.world_wall.refresh_position_and_look_at();
    },

    enter_world: function() {
        CURRENT_PLAYER.set_position_xyz(0, 100, 0);
    },

    exit_world: function() {
    }

};
