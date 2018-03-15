'use strict';

function EntityChangesListener() {

    this.subscribers_home_world = [];
    this.subscribers_other      = [];

    // check_foreign_modified_entities

    this.entity_on_property_removed = function(entity, property_removed) {
        if (!entity.user_created) {
            return;
        }
        for (var s = 0; s < this.subscribers_home_world.length; s++) {
            this.subscribers_home_world[s].entity_property_removed(entity, property_removed);
        }
        for (s = 0; s < this.subscribers_other.length; s++) {
            this.subscribers_other[s].entity_property_removed(entity, property_removed);
        }
    };

    this.entity_on_property_set_or_changed = function(entity, property_set_or_changed) {
        if (!entity.user_created) {
            return;
        }
        for (var s = 0; s < this.subscribers_home_world.length; s++) {
            this.subscribers_home_world[s].entity_property_set_or_changed(entity, property_set_or_changed);
        }
        for (s = 0; s < this.subscribers_other.length; s++) {
            this.subscribers_other[s].entity_property_set_or_changed(entity, property_set_or_changed);
        }
    };

    this.entity_on_created = function(entity) {
        if (!entity.user_created) {
            return;
        }
        for (var s = 0; s < this.subscribers_home_world.length; s++) {
            if (!this.subscribers_home_world[s].adds_own_entities) {
                this.subscribers_home_world[s].entity_added(entity);
            }
        }
        for (s = 0; s < this.subscribers_other.length; s++) {
            if (!this.subscribers_other[s].adds_own_entities) {
                this.subscribers_other[s].entity_added(entity);
            }
        }
    };

    this.entity_on_deleted = function(entity) {
        if (!entity.user_created) {
            return;
        }
        for (var s = 0; s < this.subscribers_home_world.length; s++) {
            if (this.subscribers_home_world[s].has_entity(entity)) {
                this.subscribers_home_world[s].entity_deleted(entity);
            }
        }
        for (s = 0; s < this.subscribers_other.length; s++) {
            if (this.subscribers_other[s].has_entity(entity)) {
                this.subscribers_other[s].entity_deleted(entity);
            }
        }
    };

    /*                        __
     |    | |\ | |__/ | |\ | / _`
     |___ | | \| |  \ | | \| \__> */
    this.add_entity_events_subscriber = function(entity_events_listener) {
        if (entity_events_listener.world === MANAGER_WORLD.world_home) {
            this.subscribers_home_world.push(entity_events_listener);
        } else {
            this.subscribers_other.push(entity_events_listener);
        }
    };

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