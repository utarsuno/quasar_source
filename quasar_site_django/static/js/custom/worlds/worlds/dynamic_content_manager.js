'use strict';

function DynamicContentManager() {

    this.entity_added = function(entity, world) {

    };

    this.entity_changed = function(entity, world) {

    };

    ///////

    this.load_schedule_content = function() {
        // Load each static world.
        MANAGER_WORLD.world_home.load_dynamic_content();

        // Go through each dynamic world.
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {

                var dynamic_world = this.dynamic_worlds[relative_id];

                if (!dynamic_world.dynamic_content_loaded) {
                    dynamic_world.load_dynamic_content();
                }

                var schedule_entities = this.get_all_schedule_viewable_entities_from_world(dynamic_world);

                for (var e = 0; e < schedule_entities.length; e++) {
                    this.add_entity_to_world_month_views(schedule_entities[e], dynamic_world);
                    this.add_entity_to_world_month_views(schedule_entities[e], MANAGER_WORLD.world_home);
                }
            }
        }
    };

    this.add_entity_to_world_month_views = function(entity, world) {
        if (world.month_view_walls.length > 0) {
            for (var mv = 0; mv < world.month_view_walls.length; mv++) {
                world.month_view_walls[mv].add_viewable_entity(entity);
            }
        }
    };

    this.get_all_schedule_viewable_entities_from_world = function(world) {
        var all_schedule_viewable_entities = [];
        var entity_walls = world.entity_walls;


        // Go through each entity wall in that world.
        for (var ew = 0; ew < entity_walls.length; ew++) {
            var entity_wall_entities = entity_walls[ew].get_all_entities();
            // Go through each entity in that entity wall.
            for (var e = 0; e < entity_wall_entities.length; e++) {
                var entity = entity_wall_entities[e];
                l(entity);
                if (entity.is_schedule_viewable()) {
                    all_schedule_viewable_entities.push(entity);
                }
            }
        }


        //l('The world :');
        //l(world);
        //l('has ' + all_schedule_viewable_entities.length + ' schedule viewable entities');

        return all_schedule_viewable_entities;
    };

}
