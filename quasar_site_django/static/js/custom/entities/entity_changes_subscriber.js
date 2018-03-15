'use strict';

function EntityChangesSubscriber(world, adds_own_entities) {

    this.adds_own_entities = adds_own_entities;

    this.world = world;
    MANAGER_ENTITY.add_entity_events_subscriber(this);

    this.list_of_entity_ids = [];

    this.entity_changed = function(entity) {
        if (is_defined(this.on_entity_change)) {
            this.on_entity_change(entity);
        }
    };

    this.entity_deleted = function(entity) {
        if (is_defined(this.on_entity_deleted)) {
            this.on_entity_deleted(entity);
        }
        // Remove the entity reference.
        delete this.list_of_entities[entity.get_relative_id()];
    };

    this.entity_added = function(entity) {
        if (is_defined(this.on_entity_added)) {
            this.on_entity_added(entity);
        }
        this.list_of_entity_ids.push(entity.get_relative_id());
    };

    this.has_entity = function(entity) {
        var entity_id = entity;
        for (var e = 0; e < this.list_of_entity_ids.length; e++) {
            if (entity_id === this.list_of_entity_ids[e]) {
                return true;
            }
        }
        return false;
    };

    // TODO : DELETE!
    this.add_entity = function(entity) {
        this.list_of_entities[entity.get_relative_id()] = entity;
    };

    // TODO : DELETE!
    this.get_all_entities = function() {
        var entities = [];
        for (var id in this.list_of_entities) {
            if (this.list_of_entities.hasOwnProperty(id)) {
                entities.push(this.list_of_entities[id]);
            }
        }
        return entities;
    };
}

