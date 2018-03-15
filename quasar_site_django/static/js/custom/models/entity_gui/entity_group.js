'use strict';

function EntityGroup(world, entity) {
    this.__init__(world, entity);
}

EntityGroup.prototype = {

    __init__: function(world, entity) {
        // Subscribe to entity notification events.
        EntityChangesSubscriber.call(this, world, true);

        this.initialize(world, entity);
    },

    _edit_entity: function(entity_relative_id, entity_button) {
        this.wall_entity_editor.edit_entity(entity_relative_id, entity_button);
    },

    /*___      ___   ___         ___       ___      ___  __                     __               __  
     |__  |\ |  |  |  |  \ /    |__  \  / |__  |\ |  |  /__`    |__|  /\  |\ | |  \ |    | |\ | / _` 
     |___ | \|  |  |  |   |     |___  \/  |___ | \|  |  .__/    |  | /~~\ | \| |__/ |___ | | \| \__> */
    on_entity_added: function(entity) {
        // TODO : Move the logic of this line?
        //entity.set_property(ENTITY_PROPERTY_GROUP_NAME, this.entity_wall_title.get_text());

        var entity_name = entity.get_value(ENTITY_PROPERTY_NAME);
        var entity_relative_id = entity.get_relative_id();
        var entity_button = this.entity_wall.add_row(null, entity_relative_id).add_2D_button([0, 1], entity_name, COLOR_YELLOW, null);
        entity_button.set_engage_function(this._edit_entity.bind(this, entity_relative_id, entity_button));

        // Entities that get added to an EntityGroup must set the EntityGroupEntity as its parent.
        entity.add_parent(this.entity_group_entity);

        this.base_wall.refresh_position_and_look_at();
    },

    on_entity_deleted: function(entity) {
        l('ON ENTITY DELETED CALLED!!!');
        this.entity_wall.delete_row_by_name(entity.get_relative_id());
        this.base_wall.refresh_position_and_look_at();
    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    initialize: function(world, entity) {
        var was_loaded = false;

        if (!is_defined(entity)) {
            this.create_new(world);
        } else {
            was_loaded = true;
            this.load_from_entity(world, entity);
        }
        this.base_wall_init_start();

        if (!was_loaded) {
            this.create_new_finalize();
        } else {
            this.load_from_entity_finalize();
        }

        this.wall_entity_editor = new EntityEditor(this, this.base_wall);
        this.wall_entity_editor.set_create_entity_display_button(this.create_new_entity_button);

        this.base_wall.refresh_position_and_look_at();
    },

    create_new: function(world) {
        var data = get_player_blink_spot(1000);

        this.base_wall = new FloatingWall(400, 600, data[0], data[1], world, true);
        this.entity_wall_title = this.base_wall.add_row(-1).add_3D_element('Entity Group', TYPE_INPUT);

        this.base_wall.set_to_saveable(world.entity);
    },

    load_from_entity: function(world, entity) {
        this.entity_group_entity = entity;

        this.base_wall = new FloatingWall(400, 600, null, null, world, true);
        this.base_wall.load_from_entity_data(this.entity_group_entity.get_parent());

        this.entity_wall_title = this.base_wall.get_row_with_index(-1).elements[0];
    },

    base_wall_init_start: function() {
        // Create the standard functionality of the entity wall.
        this.create_new_entity_button = this.base_wall.add_row(0).add_2D_button([0, 1], 'create new entity', COLOR_GREEN, null);

        // TODO : Create a button for deleting the entity wall!!

        this.base_wall.world.root_attachables.push(this.base_wall);

        this.entity_wall = this.base_wall.add_floating_wall_attachment(this.base_wall.width * .8, this.base_wall.height * .8, 0, 0, 5, false);
        this.entity_wall.set_background_color(COLOR_BLACK, true);
    },

    create_new_finalize: function() {
        this.entity_wall.set_to_saveable();
        this.entity_group_entity = this.entity_wall.get_self_entity();
        this.entity_group_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_ENTITY_GROUP);
        this.entity_group_entity.add_parent(this.base_wall.get_self_entity());
    },

    load_from_entity_finalize: function() {
        var number_of_children = this.entity_group_entity.number_of_children();
        for (var e = 0; e < number_of_children; e++) {
            this.entity_group_entity.children[e].user_created = true;
            this.entity_added(this.entity_group_entity.children[e]);
        }
    }
};