'use strict';

function EntityChangesSubscriber(world, adds_own_entities) {

    this.adds_own_entities = adds_own_entities;

    this.world = world;
    MANAGER_ENTITY.add_entity_events_subscriber(this);

    this.list_of_entities = {};

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
        // Add the entity reference.
        // TODO :
    };

    this.has_entity = function(entity) {
        return entity.get_relative_id() in this.list_of_entities;
    };

    this.add_entity = function(entity) {
        this.list_of_entities[entity.get_relative_id()] = entity;
    };

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

