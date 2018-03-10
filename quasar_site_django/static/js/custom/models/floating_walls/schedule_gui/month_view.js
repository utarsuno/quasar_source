'use strict';

function MonthView(world, entity_to_load_from) {
    this.__init__(world, entity_to_load_from);
}

// TODO : Create the various month types.

MonthView.prototype = {

    __init__: function(world, entity_to_load_from) {
        if (is_defined(entity_to_load_from)) {
            this.load_from_entity(world, entity_to_load_from);
        } else {
            this.create_new(world);
        }

        this.add_base_wall_functionality();

        this.base_wall.only_moveable = true;
        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();
    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    add_base_wall_functionality: function() {
        // TODO : Add a settings button/wall.

        // TODO : Load the month.

        // TODO : Load all entity data from the world!!!
    },

    create_new: function(world) {
        var data = get_player_blink_spot(1000);
        this.base_wall = new FloatingWall(2000, 1000, data[0], data[1], world, true);
        this.base_wall.set_to_saveable(world.entity);

        this.month_view_entity = new Entity();
        this.month_view_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_MONTH_VIEW);
        this.month_view_entity.set_property(ENTITY_PROPERTY_MONTH_TYPE, MONTH_TYPE_CURRENT);
        this.month_view_entity.add_parent(this.base_wall.get_self_entity());
    },

    load_from_entity: function(world, entity) {
        this.month_view_entity = entity;

        // Load the base wall.
        this.base_wall = new FloatingWall(2000, 1000, null, null, world, true);
        this.base_wall.load_from_entity_data(this.month_view_entity.get_parent());
    }

};
