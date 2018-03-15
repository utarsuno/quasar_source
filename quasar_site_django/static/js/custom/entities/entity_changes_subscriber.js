'use strict';

function EntityChangesSubscriber(world, adds_own_entities, check_foreign_modified_entities) {

    this.adds_own_entities = adds_own_entities;
    this.check_foreign_modified_entities = check_foreign_modified_entities;

    this.world = world;

    this.add_to_subscribers_list = function() {
        MANAGER_ENTITY.add_entity_events_subscriber(this);
    };

    this.list_of_entity_ids = [];

    this.entity_added = function(entity) {
        if (is_defined(this.on_entity_added_allowed_to_be_added)) {
            if (!this.on_entity_added_allowed_to_be_added(entity)) {
                return;
            }
        }

        if (is_defined(this.on_entity_added)) {
            this.on_entity_added(entity);
        }
        this.list_of_entity_ids.push(entity.get_relative_id());
    };

    /*__   __   __   __   ___  __  ___         __                  __   ___     ___       ___      ___  __
     |__) |__) /  \ |__) |__  |__)  |  \ /    /  ` |__|  /\  |\ | / _` |__     |__  \  / |__  |\ |  |  /__`
     |    |  \ \__/ |    |___ |  \  |   |     \__, |  | /~~\ | \| \__> |___    |___  \/  |___ | \|  |  .__/ */
    this.entity_property_removed = function(entity, property_removed) {
        if (!this.has_entity(entity) && this.check_foreign_modified_entities) {
            if (is_defined(this.on_foreign_entity_property_removed)) {
                this.on_foreign_entity_property_removed(entity, property_removed);
            }
        } else if (this.has_entity(entity)) {
            if (is_defined(this.on_entity_property_removed)) {
                this.on_entity_property_removed(entity, property_removed);
            }
        }
    };

    this.entity_property_set_or_changed = function(entity, property_set_or_changed) {
        if (!this.has_entity(entity) && this.check_foreign_modified_entities) {
            if (is_defined(this.on_foreign_entity_property_set_or_changed)) {
                this.on_foreign_entity_property_set_or_changed(entity, property_set_or_changed);
            }
        } else if (this.has_entity(entity)) {
            if (is_defined(this.on_entity_property_set_or_changed)) {
                this.on_entity_property_set_or_changed(entity, property_set_or_changed);
            }
        }
    };

    /*__   ___       ___ ___    __           ___       ___      ___  __
     |  \ |__  |    |__   |  | /  \ |\ |    |__  \  / |__  |\ |  |  /__`
     |__/ |___ |___ |___  |  | \__/ | \|    |___  \/  |___ | \|  |  .__/ */
    this.entity_deleted = function(entity) {
        if (is_defined(this.on_entity_deleted)) {
            this.on_entity_deleted(entity);
        }

        var remove_index = NOT_FOUND;
        var entity_id = entity.get_relative_id();
        for (var e = 0; e < this.list_of_entity_ids.length; e++) {
            if (this.list_of_entity_ids[e] === entity_id) {
                remove_index = e;
                break;
            }
        }
        if (remove_index === NOT_FOUND) {
            raise_exception_with_full_logging('Entity to remove not found!');
        }
        this.list_of_entity_ids.splice(remove_index, 1);
    };

    /*                        __
     |    | |\ | |__/ | |\ | / _`
     |___ | | \| |  \ | | \| \__> */
    this.link_all_from_entity_events = function() {
        MANAGER_ENTITY.add_all_needed_entity_links_for_subscriber(this);
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.has_entity = function(entity) {
        var entity_id = entity.get_relative_id();
        for (var e = 0; e < this.list_of_entity_ids.length; e++) {
            if (entity_id === this.list_of_entity_ids[e]) {
                return true;
            }
        }
        return false;
    };
}