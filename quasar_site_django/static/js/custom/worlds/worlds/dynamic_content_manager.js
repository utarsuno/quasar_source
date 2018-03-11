'use strict';

function DynamicContentManager() {

    this.entity_added = function(entity, world) {

    };

    this.entity_changed = function(entity, world) {

    };

    ///////

    this.load_schedule_content = function() {
        // Go through each dynamic world.
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {
                l('Fetching schedule entities from world');
                l(this.dynamic_worlds[relative_id]);
                var schedule_entities = this.get_all_schedule_viewable_entities_from_world(this.dynamic_worlds[relative_id]);

                for (var e = 0; e < schedule_entities.length; e++) {
                    this.add_entity_to_world_month_views(schedule_entities[e], this.dynamic_worlds[e]);
                    this.add_entity_to_world_month_views(schedule_entities[e], MANAGER_WORLD.world_home);
                }
            }
        }
    };

    this.add_entity_to_world_month_views = function(entity, world) {
        if (world.month_view_walls.length > 0) {
            for (var mv = 0; mv < world.month_view_walls.length; mv++) {
                l('Adding entity to month view walls:');
                l(entity);
                world.month_view_walls.add_viewable_entity(entity);
            }
        }
    };

    this.get_all_schedule_viewable_entities_from_world = function(world) {
        var all_schedule_viewable_entities = [];
        var entity_walls = world.entity_walls;

        // Go through each entity wall in that world.
        for (var ew = 0; ew < entity_walls.length; e++) {
            var entity_wall_entities = entity_walls[ew].get_all_entities();
            // Go through each entity in that entity wall.
            for (var e = 0; e < entity_wall_entities.length; e++) {
                var entity = entity_wall_entities[e];
                if (entity.is_schedule_viewable()) {
                    all_schedule_viewable_entities.push(entity);
                }
            }
        }

        l('The world :');
        l(world);
        l('has ' + all_schedule_viewable_entities.length + ' schedule viewable entities');

        return all_schedule_viewable_entities;
    };

}


/*
    entity_added: function(entity, world) {

    },

    entity_changed: function(entity, wordl) {

    },

    load_schedule_content: function() {

    }

 */

