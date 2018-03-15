'use strict';

function DynamicContentManager() {

    this.load_all_dynamic_content = function() {
        MANAGER_WORLD.world_home.load_dynamic_content();

        // Go through each dynamic world.
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {
                var dynamic_world = this.dynamic_worlds[relative_id];
                dynamic_world.load_dynamic_content();
            }
        }
    };

    this.load_schedule_content = function() {
        // Load each static world.
        MANAGER_WORLD.world_home.load_dynamic_content();

        // Add home world entities to any home world month views.
        var se = this.get_all_schedule_viewable_entities_from_world(MANAGER_WORLD.world_home);
        for (var ee = 0; ee < se.length; ee++) {
            this.add_entity_to_world_month_views(MANAGER_WORLD.world_home);
        }

        // Go through each dynamic world.
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {

                var dynamic_world = this.dynamic_worlds[relative_id];

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
        var entity_groups = world.entity_groups;

        // Go through each entity wall in that world.
        for (var ew = 0; ew < entity_groups.length; ew++) {
            var entity_wall_entities = entity_groups[ew].get_all_entities();
            // Go through each entity in that entity wall.
            for (var e = 0; e < entity_wall_entities.length; e++) {
                var entity = entity_wall_entities[e];
                if (entity.is_schedule_viewable()) {
                    all_schedule_viewable_entities.push(entity);
                }
            }
        }

        return all_schedule_viewable_entities;
    };

    /*___      ___   ___              __  ___    ___    __       ___    __        __ 
     |__  |\ |  |  |  |  \ /    |\ | /  \  |  | |__  | /  `  /\   |  | /  \ |\ | /__`
     |___ | \|  |  |  |   |     | \| \__/  |  | |    | \__, /~~\  |  | \__/ | \| .__/*/
    this.get_all_user_created_entity_ids_from_all_worlds = function() {
        var entity_ids = [];
        var home_world_entity_ids = this.get_all_user_created_entity_ids_from_world(this.world_home);
        for (var e = 0; e < home_world_entity_ids.length; e++) {
            entity_ids.push(home_world_entity_ids[e]);
        }

        // Go through each dynamic world now.
        for (var id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(id)) {
                var dynamic_world_entity_ids = this.get_all_user_created_entity_ids_from_world(this.dynamic_worlds[id]);

                for (e = 0; e < dynamic_world_entity_ids.length; e++) {
                    entity_ids.push(dynamic_world_entity_ids[e]);
                }
            }
        }

        return entity_ids;
    };

    this.get_all_user_created_entity_ids_from_world = function(world) {
        // For now only EntityGroups contain the source of all user created entities.

        var entity_groups = world.entity_groups;
        var user_created_entity_ids = [];

        for (var eg = 0; eg < entity_groups.length; eg++) {
            var entity_group_entity_ids = entity_groups[eg].list_of_entity_ids;
            for (var e = 0; e < entity_group_entity_ids.length; e++) {
                user_created_entity_ids.push(entity_group_entity_ids[e]);
            }
        }

        return user_created_entity_ids;
    };

    this.link_all_entities_for_notifications = function() {

    };

}
