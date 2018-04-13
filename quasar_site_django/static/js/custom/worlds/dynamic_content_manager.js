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
        // At this point in time all entities and dynamic content has been loaded.
        this.link_entity_notifications_for_month_views_for_world(this.world_home);

        for (var id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(id)) {
                var dynamic_world = this.dynamic_worlds[id];
                this.link_entity_notifications_for_month_views_for_world(dynamic_world);
            }
        }


        // TODO : Complete the rest of this.

    };

    this.link_entity_notifications_for_month_views_for_world = function(world) {
        var month_view_walls = world.month_view_walls;

        for (var mv = 0; mv < month_view_walls.length; mv++) {
            month_view_walls[mv].link_all_from_entity_events();
        }
    };

}