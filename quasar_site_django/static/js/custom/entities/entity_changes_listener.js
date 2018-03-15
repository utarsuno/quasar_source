'use strict';

function EntityChangesListener() {

    this.list_of_entity_event_subscribers_home_world = [];
    this.list_of_entity_event_subscribers_not_from_home_world = [];

    this.add_entity_events_subscriber = function(entity_events_listener) {
        if (entity_events_listener.world === MANAGER_WORLD.world_home) {
            this.list_of_entity_event_subscribers_home_world.push(entity_events_listener);
        } else {
            this.list_of_entity_event_subscribers_not_from_home_world.push(entity_events_listener);
        }
    };

    this.entity_on_change = function(entity) {
        if (!entity.user_created) {
            return;
        }

        // TODO : Check if any subscribers need to add or remove this entity.

        // TODO : Notify all appropriate subscribers.
    };

    this.entity_on_created = function(entity) {
        if (!entity.user_created) {
            return;
        }


        // TODO : Check what subscribers need to add this entity.

        // TODO : Notify all appropriate subscribers.
    };

    this.entity_on_deleted = function(entity) {
        if (!entity.user_created) {
            return;
        }

        // TODO : Check what subscribers need to remove this entity.

        // TODO : Notify all appropriate subscribers.
    };

}

