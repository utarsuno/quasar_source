'use strict';

function EntityManager() {
    this.__init__();
}

/*

Owner.prototype = {

    home_world: null,

    username: null,
    password: null,

    loading_data: null,

    // POST calls.
    post_load_all_entities        : null,
    post_load_all_public_entities : null,

    all_public_entities_loaded: function(data) {
        var e = get_key_value_list_from_json_dictionary(data);
        for (var i = 0; i < e.length; i++) {
            MANAGER_ENTITY.add_new_entity(e[i][0], e[i][1]);
        }
        MANAGER_ENTITY.link_entities();

        this.loading_public_data = false;
        if (!this.loading_entities_data) {
            this.loading_data = false;
        }
    },

    all_entities_loaded: function(data) {
        var e = get_key_value_list_from_json_dictionary(data);
        for (var i = 0; i < e.length; i++) {
            MANAGER_ENTITY.add_new_entity(e[i][0], e[i][1]);
        }
        MANAGER_ENTITY.link_entities();

        // Once all entities are loaded inform the Player object so that it can login to websockets (player ID is required for login).
        CURRENT_PLAYER.set_player_id(MANAGER_ENTITY.get_owner_entity().get_value('owner_id'));

        this.loading_entities_data = false;
        if (!this.loading_public_data) {
            this.loading_data = false;
        }
    },

    __init__: function(username, password, home_world) {
        this.username   = username;
        this.password   = password;
        this.home_world = home_world;

        this.loading_data = true;
        this.post_load_all_entities = new PostHelper('/get_all_entities');
        this.post_load_all_entities.perform_post({'username': this.username, 'password': this.password}, this.all_entities_loaded.bind(this));

        this.post_load_all_public_entities = new PostHelper('/get_all_public_entities');
        this.post_load_all_public_entities.perform_post({}, this.all_public_entities_loaded.bind(this));
    }

};


 */

EntityManager.prototype = {

    // The user entities.
    entities        : null,
    public_entities : null,

    // POST calls.
    post_delete_entity        : null,
    post_save_entity          : null,
    post_load_user_entities   : null,
    post_load_public_entities : null,

    // State booleans.
    user_entities_loaded   : null,
    public_entities_loaded : null,
    loading                : null,

    all_public_entities_loaded: function(data) {
        // DELETE_FOR_PROD_START
        l('Got the following data for public entities');
        l(data);
        // DELETE_FOR_PROD_END

        MANAGER_ENTITY.add_public_entity_from_entity_data(data);

        this.public_entities_loaded = true;
        if (this.user_entities_loaded) {
            this.all_data_loaded();
        }
    },

    all_user_entities_loaded: function(data) {
        // DELETE_FOR_PROD_START
        l('Got the following data for user entities');
        l(data);
        // DELETE_FOR_PROD_END

        MANAGER_ENTITY.add_user_entity_from_entity_data(data);

        this.user_entities_loaded = true;

        this.set_owner_entity();

        if (this.public_entities_loaded) {
            this.all_data_loaded();
        }
    },

    all_data_loaded: function() {
        MANAGER_ENTITY.link_entities();
        this.loading = false;
    },

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
        if (data === SERVER_REPLY_GENERIC_YES) {
            l('Entity deleted!');
        } else {
            l('Entity did not get deleted : {|' + data + '|}');
        }
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
            this.post_delete_entity.perform_post({
                'username': CURRENT_PLAYER.get_username(),
                'password': CURRENT_PLAYER.get_password(),
                'ENTITY_PROPERTY_ID': entity_to_delete.get_relative_id()
            }, this.entity_deleted_response.bind(this));
        }

        if (index_to_splice !== NOT_FOUND) {
            // Re-calculate the index to splice off as child entities may have been removed thus changing the list order/indexes.
            this.entities.splice(this._get_index_of_entity(entity), 1);
        }
    },

    __init__: function() {
        this.entities = [];
        this.user_entities_loaded = false;
        this.public_entities_loaded = false;
        this.loading = false;

        this.post_delete_entity        = new PostHelper('/delete_entity');
        this.post_save_entity          = new PostHelper('/save_entity');
        this.post_load_user_entities   = new PostHelper('/get_user_entities');
        this.post_load_public_entities = new PostHelper('/get_public_entities');
    },

    /*        __        __          __      __       ___
        |    /  \  /\  |  \ | |\ | / _`    |  \  /\   |   /\     .
        |___ \__/ /~~\ |__/ | | \| \__>    |__/ /~~\  |  /~~\    .*/

    set_owner_entity: function() {
        // TODO : This function!!!



        // Once all entities are loaded inform the Player object so that it can login to websockets (player ID is required for login).
        //CURRENT_PLAYER.set_player_id(MANAGER_ENTITY.get_owner_entity().get_value('owner_id'));
    },

    load_data: function() {
        this.loading = true;
        this.post_load_user_entities.perform_post({'username': ENTITY_OWNER.get_username(), 'password': ENTITY_OWNER.get_password()}, this.all_user_entities_loaded.bind(this));
        this.post_load_public_entities.perform_post({}, this.all_public_entities_loaded.bind(this));
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

    /*   __   ___ ___ ___         __      __       ___
        / _` |__   |   |  | |\ | / _`    |  \  /\   |   /\     .
        \__> |___  |   |  | | \| \__>    |__/ /~~\  |  /~~\    .*/
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

    currently_loading: function() {
        return this.loading;
    },

    is_property_user_modifiable: function(property) {
        switch(property) {
        case ENTITY_DEFAULT_PROPERTY_CHILD_IDS:
        case ENTITY_DEFAULT_PROPERTY_TYPE: // TODO : Maybe don't include type for this.
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
        this.public_entities_loaded = false;
        this.entities.length = 0;
    },

    add_entity_if_not_already_added: function(entity) {
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_relative_id() === entity.get_relative_id()) {
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
            this.delete_entity(entity);
        } else {
            l('No Entity found for the ID{' + entity_id + '}');
        }
    },

    add_user_entity_from_entity_data: function(entity_data) {
        var new_entity = new Entity(entity_data);
        this.entities.push(new_entity);
        return new_entity;
    },

    add_public_entity_from_entity_data: function(entity_data) {
        var new_public_entity = new Entity(entity_data);
        this.entities.push(new_public_entity);
        return new_public_entity;
    },

    get_all_entities: function() {
        return this.entities;
    },

    get_owner_entity: function() {
        return this.get_all_entities_of_type(ENTITY_TYPE_OWNER)[0];
    },

    get_entity_by_id: function(entity_id) {
        //console.log('Trying to get entity by id match : Looking for ' + entity_id)
        var match_found_ONLY_FOR_DEBUGGING = false;
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_relative_id() === entity_id) {
                match_found_ONLY_FOR_DEBUGGING = true;
                return this.entities[i];
            }
        }
        if (!match_found_ONLY_FOR_DEBUGGING) {
            l('MATCH NOT FOUND FOR :');
            l(entity_id);
            throw_exception('Entity ID match not found!');
        }
        return null;
    },

    /*   __                    __      __       ___
        /__`  /\  \  / | |\ | / _`    |  \  /\   |   /\     .
        .__/ /~~\  \/  | | \| \__>    |__/ /~~\  |  /~~\    .*/

    save_changes_result: function() {
        // .bind prepends arguments so the first argument is the entity being saved and the second argument is the save result.
        if (arguments[1] === SERVER_REPLY_GENERIC_YES) {
            arguments[0].needs_to_be_saved = false;
        } else {
            l('Error saving entity : ');
            l(arguments[0]);
        }
    },

    update_server_and_database: function() {
        var username = ENTITY_OWNER.get_username();
        var password = ENTITY_OWNER.get_password();

        for (var e = 0; e < this.entities.length; e++) {
            if (this.entities[e].needs_to_be_saved) {
                this.post_save_entity.perform_post({'username': username, 'password': password, 'save_data': JSON.stringify(this.entities[e].get_all_properties())}, this.save_changes_result.bind(this, this.entities[e]));
            }
        }
    }
};