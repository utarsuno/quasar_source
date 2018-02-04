'use strict';

function EntityManager() {
    this.__init__();
}

EntityManager.prototype = {

    // The user entities.
    entities        : null,

    // POST calls.
    post_delete_entity        : null,
    post_save_entity          : null,
    post_load_user_entities   : null,

    // State booleans.
    user_entities_loaded   : null,
    loading                : null,

    // TODO : Refactor
    delete_all_children_of_entity_that_do_not_have_other_parents: function(parent_entity) {
        for (var c = parent_entity.children.length; c--;) {

            var child_entity = parent_entity.children[c];

            // No matter what the parent reference is getting removed for all children entity.
            child_entity.remove_parent(parent_entity);

            // If the child entity had no other parents then remove it as well.
            // TODO : Eventually also check for any outside references. Perhaps don't enable delete if there are external references.
            if (child_entity.number_of_parents() === 0) {
                this.delete_entity(child_entity);
            }
        }
    },

    entity_deleted_response: function(data) {
        // FOR_DEV_START
        if (data === SERVER_REPLY_GENERIC_YES) {
            l('Entity deleted!');
        } else {
            l('Entity did not get deleted : {|' + data + '|}');
        }
        // FOR_DEV_END
    },

    delete_entity: function(entity) {
        var entity_to_delete = null;
        var index_to_splice = this._get_index_of_entity(entity);
        if (index_to_splice !== NOT_FOUND) {
            entity_to_delete = this.entities[index_to_splice];
        } else {
            raise_exception('Entity to delete was not found!');
        }

        if (entity_to_delete !== null) {
            // TODO : Delete all child entities from the ENTITY_MANAGER if they don't have other parent entities.
            this.delete_all_children_of_entity_that_do_not_have_other_parents(entity_to_delete);

            // TODO : Make sure the server does the same deletion steps that the client does.
            var data = {};
            data[ENTITY_PROPERTY_USERNAME] = ENTITY_OWNER.get_username();
            data[ENTITY_PROPERTY_PASSWORD] = ENTITY_OWNER.get_password();
            data[ENTITY_DEFAULT_PROPERTY_RELATIVE_ID] = entity_to_delete.get_relative_id();
            this.post_delete_entity.perform_post(data, this.entity_deleted_response.bind(this));
        }

        if (index_to_splice !== NOT_FOUND) {
            // Re-calculate the index to splice off as child entities may have been removed thus changing the list order/indexes.
            this.entities.splice(this._get_index_of_entity(entity), 1);
        }
    },

    __init__: function() {
        this.entities = [];
        this.user_entities_loaded = false;
        this.loading = false;

        this.post_delete_entity        = new PostHelper(POST_URL_DELETE_ENTITY);
        this.post_save_entity          = new PostHelper(POST_URL_SAVE_ENTITY);
        this.post_load_user_entities   = new PostHelper(POST_URL_GET_USER_ENTITIES);
    },

    /*        __        __          __      __       ___
        |    /  \  /\  |  \ | |\ | / _`    |  \  /\   |   /\     .
        |___ \__/ /~~\ |__/ | | \| \__>    |__/ /~~\  |  /~~\    .*/

    all_user_entities_loaded: function(data) {
        // FOR_DEV_START
        //l('Got the following data for user entities');
        //l(data);
        //l(typeof(data));
        // FOR_DEV_END
        if (is_string(data)) {
            //l('Data is a string!');
            if (data === '{}') {
                this.user_entities_loaded = true;
                this.all_data_loaded();
                return;
            }

            data = JSON.parse(data);
            data = JSON.parse(data);
        }

        //data = eval(data);

        for (var entity_id_num in data) {
            if (data.hasOwnProperty(entity_id_num)) {
                MANAGER_ENTITY.add_user_entity_from_entity_data(data[entity_id_num]);
            }
        }

        this.user_entities_loaded = true;
        ENTITY_OWNER.set_owner_entity(this.get_owner_entity());
        this.all_data_loaded();
    },

    set_all_entities_to_not_needing_to_be_saved: function() {
        for (var e = 0; e < this.entities.length; e++) {
            this.entities[e].needs_to_be_saved = false;
        }
    },

    all_data_loaded: function() {
        this.link_entities();
        this.set_all_entities_to_not_needing_to_be_saved();
        this.loading = false;

        MANAGER_LOADING.all_entities_loaded();
    },

    load_data: function() {
        this.loading = true;
        var data = {};
        data[ENTITY_PROPERTY_USERNAME] = ENTITY_OWNER.get_username();
        data[ENTITY_PROPERTY_PASSWORD] = ENTITY_OWNER.get_password();
        this.post_load_user_entities.perform_post(data, this.all_user_entities_loaded.bind(this));
    },

    link_entities: function() {
        for (var e = 0; e < this.entities.length; e++) {
            var children_ids = this.entities[e].get_child_ids();
            var parent_ids   = this.entities[e].get_parent_ids();

            for (var c = 0; c < children_ids.length; c++) {
                this.entities[e].add_child(this.get_entity_by_id(children_ids[c]));
            }
            for (var p = 0; p < parent_ids.length; p++) {
                this.entities[e].add_parent(this.get_entity_by_id(parent_ids[p]));
            }
        }
    },

    /*__   ___ ___ ___         __      __       ___
     / _` |__   |   |  | |\ | / _`    |  \  /\   |   /\     .
     \__> |___  |   |  | | \| \__>    |__/ /~~\  |  /~~\    . */
    get_entities_sorted_by_priority: function(list_of_entities) {
        var list_to_return = [];

        // First value to sort by is by completed or not.
        // Second value to sort by is importance.

        for (var i = 0; i < list_of_entities.length; i++) {
            var e = list_of_entities[i];
            e.sort_value = 0;
            if (e.has_property(ENTITY_PROPERTY_COMPLETED)) {
                if (e.get_value(ENTITY_PROPERTY_COMPLETED) === 'yes') {
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
        var max_id = -1;
        for (var i = 0; i < this.entities.length; i++) {
            var entity_id = this.entities[i].get_relative_id();
            if (entity_id > max_id) {
                max_id = entity_id;
            }
        }
        return max_id + 1;
    },

    get_all_entities_of_type: function(entity_type) {
        var entities_to_return = [];
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_type() === entity_type) {
                entities_to_return.push(this.entities[i]);
            }
        }
        return entities_to_return;
    },

    get_all_entities_with_property: function(entity_property) {
        var entities_to_return = [];
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].has_property(entity_property)) {
                entities_to_return.push(this.entities[i]);
            }
        }
        return entities_to_return;
    },

    currently_loading: function() {
        return this.loading;
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

    /*   __   __   ___  __       ___    __        __
        /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`    .
        \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/    .*/

    clear_all: function() {
        this.user_entities_loaded = false;
        this.entities.length = 0;
    },

    add_entity_if_not_already_added: function(entity) {
        for (var j = 0; j < this.entities.length; j++) {
            if (this.entities[j].get_relative_id() === entity.get_relative_id()) {
                return;
            }
        }
        this.entities.push(entity);
    },

    _get_index_of_entity: function(entity) {
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_relative_id() === entity.get_relative_id()) {
                return i;
            }
        }
        return NOT_FOUND;
    },

    delete_entity_by_id: function(entity_id) {
        var entity = this.get_entity_by_id(entity_id);
        if (entity !== null) {
            // Check if this entity has an parent entities. They need to remove reference to it.
            var entity_parents = entity.get_parents();
            for (var p = 0; p < entity_parents.length; p++) {
                entity_parents[p].remove_child(entity);
            }

            this.delete_entity(entity);

        }
        // FOR_DEV_START
        else {
            l('No Entity found for the ID{' + entity_id + '}');
        }
        // FOR_DEV_END
    },

    add_user_entity_from_entity_data: function(entity_data) {
        return new Entity(entity_data);
    },

    add_public_entity_from_entity_data: function(entity_data) {
        return new Entity(entity_data);
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
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_relative_id() === entity_id) {
                return this.entities[i];
            }
        }
        return null;
    },

    /*__                    __      __       ___
     /__`  /\  \  / | |\ | / _`    |  \  /\   |   /\     .
     .__/ /~~\  \/  | | \| \__>    |__/ /~~\  |  /~~\    . */

    save_changes_result: function() {
        // .bind prepends arguments so the first argument is the entity being saved and the second argument is the save result.
        if (arguments[1] === SERVER_REPLY_GENERIC_YES) {
            arguments[0].needs_to_be_saved = false;
        } else {
            // FOR_DEV_START
            l('Error saving entity : ');
            l(arguments[0]);
            // FOR_DEV_END
        }
    },

    update_server_and_database: function() {
        var username = ENTITY_OWNER.get_username();
        var password = ENTITY_OWNER.get_password();

        for (var e = 0; e < this.entities.length; e++) {
            if (this.entities[e].needs_to_be_saved) {
                var data = {};
                data[ENTITY_PROPERTY_USERNAME] = username;
                data[ENTITY_PROPERTY_PASSWORD] = password;
                // TODO : Make save_data into a global constant of some sort.
                data[ENTITY_POST_SAVE_DATA] = JSON.stringify(this.entities[e].get_all_properties());
                this.post_save_entity.perform_post(data, this.save_changes_result.bind(this, this.entities[e]));
            }
        }
    }
};