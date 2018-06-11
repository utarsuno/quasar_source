'use strict';

function EntityManager() {
    this.__init__();
}

EntityManager.prototype = {

    // The user entities.
    entities: null,

    __init__: function() {
        this.entities = [];
        this.relative_ids_to_delete = [];
        this.highest_deleted_relative_id = -1;
        // Hold a list of all objects that require entity change notifications.
        EntityChangesListener.call(this);
    },

    logout: function() {
        this.entities.length               = 0;
        this.subscribers_home_world.length = 0;
        this.subscribers_other.length      = 0;
    },

    /*     __        __          __      __       ___
     |    /  \  /\  |  \ | |\ | / _`    |  \  /\   |   /\     .
     |___ \__/ /~~\ |__/ | | \| \__>    |__/ /~~\  |  /~~\    .*/
    set_all_entities_to_not_needing_to_be_saved: function() {
        for (let e = 0; e < this.entities.length; e++) {
            this.entities[e].needs_to_be_saved = false;
        }
    },

    link_entities: function() {
        for (let e = 0; e < this.entities.length; e++) {
            let children_ids = this.entities[e].get_child_ids();
            let parent_ids   = this.entities[e].get_parent_ids();

            for (let c = 0; c < children_ids.length; c++) {
                // Temporary debugging.
                if (!is_defined(this.get_entity_by_id(children_ids[c]))) {
                    l('WARNING! ID does not exist?');
                    l(this.get_entity_by_id(children_ids[c]));
                } else {
                    this.entities[e].add_child(this.get_entity_by_id(children_ids[c]));
                }
            }
            for (let p = 0; p < parent_ids.length; p++) {
                this.entities[e].add_parent(this.get_entity_by_id(parent_ids[p]));
            }
        }
    },

    /*__   ___ ___ ___         __      __       ___
     / _` |__   |   |  | |\ | / _`    |  \  /\   |   /\     .
     \__> |___  |   |  | | \| \__>    |__/ /~~\  |  /~~\    . */
    get_entities_sorted_by_priority: function(list_of_entities) {
        let list_to_return = [];

        // First value to sort by is by completed or not.
        // Second value to sort by is importance.

        let i;
        for (i = 0; i < list_of_entities.length; i++) {
            let e = list_of_entities[i];
            e.sort_value = 0;
            if (e.has_property(ENTITY_PROPERTY_COMPLETED)) {
                if (e.get_value(ENTITY_PROPERTY_COMPLETED) === ENTITY_PROPERTY_COMPLETED_VALUE_YES) {
                    e.sort_value += 2000;
                } else {
                    e.sort_value += 1000;
                }
            }
            if (e.has_property(ENTITY_PROPERTY_IMPORTANCE)) {
                e.sort_value += e.get_value(ENTITY_PROPERTY_IMPORTANCE) * 100;
            }
            list_to_return.push(e);
        }

        return list_to_return.sort(function(a, b) {
            return b.sort_value - a.sort_value;
        });
    },

    get_new_entity_id: function() {
        let max_id = -1;
        for (let i = 0; i < this.entities.length; i++) {
            let entity_id = this.entities[i].get_relative_id();
            if (entity_id > max_id) {
                max_id = entity_id;
            }
        }

        let highest_deleted_id = this.get_highest_deleted_relative_id();
        if (max_id + 1 <= highest_deleted_id) {
            return highest_deleted_id + 1;
        }
        return max_id + 1;
    },

    get_entity_of_type: function(entity_type) {
        let entity_matches = this.get_all_entities_of_type(entity_type);

        if (entity_matches.length > 1) {
            raise_exception_with_full_logging('More than one entity found with type : ' + entity_type);
        } else if (entity_matches === 0) {
            raise_exception_with_full_logging('No entities found with type : ' + entity_type);
        }

        return entity_matches[0];
    },

    get_all_entities_of_type: function(entity_type) {
        let entities_to_return = [];
        let i;
        for (i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_type() === entity_type) {
                entities_to_return.push(this.entities[i]);
            }
        }
        return entities_to_return;
    },

    get_all_entities_with_property: function(entity_property) {
        let entities_to_return = [];
        let i;
        for (i = 0; i < this.entities.length; i++) {
            if (this.entities[i].has_property(entity_property)) {
                entities_to_return.push(this.entities[i]);
            }
        }
        return entities_to_return;
    },

    is_property_user_modifiable: function(property) {
        switch(property) {
        case ENTITY_DEFAULT_PROPERTY_CHILD_IDS:
        case ENTITY_DEFAULT_PROPERTY_TYPE:
        case ENTITY_DEFAULT_PROPERTY_PARENT_IDS:
        case ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
            return false;
        default:
            return true;
        }
    },

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`    .
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/    .*/
    add_entity_if_not_already_added: function(entity) {
        for (var j = 0; j < this.entities.length; j++) {
            if (this.entities[j].get_relative_id() === entity.get_relative_id()) {
                return;
            }
        }
        this.entities.push(entity);
        // Since an entity was added make sure all appropriate objects get a link to on_change events.
        this.entity_on_created(entity);
    },

    _get_index_of_entity: function(entity) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_relative_id() === entity.get_relative_id()) {
                return i;
            }
        }
        return NOT_FOUND;
    },

    add_user_entity_from_entity_data: function(entity_data) {
        //l('Adding the following entity data');
        //l(entity_data);
        let entity = new Entity(entity_data);
        entity.exists_on_server_side = true;
        return entity;
    },

    get_all_entities: function() {
        return this.entities;
    },

    get_owner_entity: function() {
        // FOR_DEV_START
        if (!is_defined(this.get_all_entities_of_type(ENTITY_TYPE_OWNER)[0])) {
            raise_exception_with_full_logging('Owner Entity not found!');
        }
        // FOR_DEV_END
        return this.get_all_entities_of_type(ENTITY_TYPE_OWNER)[0];
    },

    get_entity_by_id: function(entity_id) {
        //console.log('Trying to get entity by id match : Looking for ' + entity_id)
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_relative_id() === entity_id) {
                return this.entities[i];
            }
        }
        //raise_exception_with_full_logging('No entity found with ID of {' + entity_id + '}');
    },

    /*__   ___       ___ ___  ___
     |  \ |__  |    |__   |  |__
     |__/ |___ |___ |___  |  |___ */
    get_deleted_relative_ids: function() {
        return this.relative_ids_to_delete;
    },

    clear_deleted_entity_ids: function() {
        this.relative_ids_to_delete.length = 0;
    },

    get_highest_deleted_relative_id: function() {
        return this.highest_deleted_relative_id;
    },

    has_deleted_relative_ids: function() {
        return this.relative_ids_to_delete.length > 0;
    },

    delete_entity_by_id: function(entity_id) {
        let entity = this.get_entity_by_id(entity_id);
        if (entity !== null) {
            // Check if this entity has any parent entities. They need to remove references to it.
            let entity_parents = entity.get_parents();
            for (let p = 0; p < entity_parents.length; p++) {
                entity_parents[p].remove_child(entity);
            }
            // Check if this entity has children entities. They all need to be deleted.
            let entity_children = entity.get_children();
            for (let c = 0; c < entity_children.length; c++) {
                this.delete_entity_by_id(entity_children[c].get_relative_id());
            }
            this.delete_entity(entity);
        } else {
            raise_exception_with_full_logging('No Entity found for the ID{' + entity_id + '}');
        }
    },

    delete_entity: function(entity) {
        let entity_to_delete = null;
        let index_to_splice = this._get_index_of_entity(entity);
        if (index_to_splice !== NOT_FOUND) {
            entity_to_delete = this.entities[index_to_splice];
        } else {
            raise_exception_with_full_logging('Entity to delete was not found!');
        }

        if (entity_to_delete !== null) {
            // Notify all entity event subscribers that the entity was deleted.
            this.entity_on_deleted(entity_to_delete);

            let relative_id = entity_to_delete.get_relative_id();
            if (relative_id > this.highest_deleted_relative_id) {
                this.highest_deleted_relative_id = relative_id;
            }
            if (entity_to_delete.exists_on_server_side) {
                this.relative_ids_to_delete.push(relative_id);
            }
        }

        if (index_to_splice !== NOT_FOUND) {
            this.entities.splice(index_to_splice, 1);
        }
    }
};