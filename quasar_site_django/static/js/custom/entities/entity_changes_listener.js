'use strict';

function EntityChangesListener() {

    this.list_of_entity_event_subscribers_home_world = [];
    this.list_of_entity_event_subscribers_not_from_home_world = [];

    this.add_entity_events_subscriber = function(entity_events_listener) {
        if (entity_events_listener.world === MANAGER_WORLD.world_home) {
            l('ADDED A HOME SUBSCRIBER!');
            this.list_of_entity_event_subscribers_home_world.push(entity_events_listener);
        } else {
            l('ADDED A NON HOME SUBSCRIBER!');
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
        l('Entity on deleted event!');
        l(entity);

        if (!entity.user_created) {
            return;
        }


        l('Printing all the home world subscribers!');
        for (var s = 0; s < this.list_of_entity_event_subscribers_home_world.length; s++) {
            l(this.list_of_entity_event_subscribers_home_world[s]);
        }

        l('Printing all the non home world subscribers!');
        for (s = 0; s < this.list_of_entity_event_subscribers_not_from_home_world.length; s++) {
            l(this.list_of_entity_event_subscribers_not_from_home_world[s]);
        }


        // TODO : Check what subscribers need to remove this entity.

        // TODO : Notify all appropriate subscribers.
    };

    // TODO : ASCII Documentation : Functions for new subscribers created.
    this.add_all_needed_entity_links_for_subscriber = function(subscriber) {
        var entity_ids;

        if (subscriber.world === MANAGER_WORLD.world_home) {
            entity_ids = MANAGER_WORLD.get_all_user_created_entity_ids_from_all_worlds();
        } else {
            entity_ids = MANAGER_WORLD.get_all_user_created_entity_ids_from_world(subscriber.world);
        }

        for (var e = 0; e < entity_ids.length; e++) {
            subscriber.entity_added(this.get_entity_by_id(entity_ids[e]));
        }
    };
}