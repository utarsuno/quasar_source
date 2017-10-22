'use strict'

function Owner(username, password, home_world) {
    this.__init__(username, password, home_world)
}

function Entity(name, keys_and_values) {
    this.__init__(name, keys_and_values)
}

function EntityManager() {
    this.__init__()
}

Owner.prototype = {

    home_world: null,

    username: null,
    password: null,

    loading_data: null,

    days: null,

    // POST calls.
    post_load_all_entities : null,

    all_entities_loaded: function(data) {
        var e = get_key_value_list_from_json_dictionary(data)
        for (var i = 0; i < e.length; i++) {
            ENTITY_MANAGER.add_new_entity(e[i][0], e[i][1])
        }
        ENTITY_MANAGER.entities_loaded = true
        this.loading_data = false
    },

    __init__: function(username, password, home_world) {
        this.username   = username
        this.password   = password
        this.home_world = home_world

        this.loading_data = true
        this.post_load_all_entities = new PostHelper('/get_all_entities')
        this.post_load_all_entities.perform_post({'username': this.username, 'password': this.password}, this.all_entities_loaded.bind(this))
    }
}

Entity.prototype = {

    name             : null,
    keys_and_values  : null,

    needs_to_be_saved : null,

    __init__: function(name, keys_and_values) {
        this.name            = name
        this.parents         = []
        this.children        = []
        this.keys_and_values = keys_and_values

        // Ensure that various entity properties exist with default values.
        this._ensure_property_exists(ENTITY_PROPERTY_ID, ENTITY_MANAGER.get_new_entity_id())

        this._ensure_property_exists(ENTITY_PROPERTY_NAME, this.name)

        this._ensure_property_exists(ENTITY_PROPERTY_CHILDREN, [])
        this._ensure_property_value_is_not(ENTITY_PROPERTY_CHILDREN, '[]', [])

        this._ensure_property_exists(ENTITY_PROPERTY_PARENTS, [])
        this._ensure_property_value_is_not(ENTITY_PROPERTY_PARENTS, '[]', [])

        this._ensure_property_exists(ENTITY_PROPERTY_TYPE, ENTITY_TYPE_BASE)

        // Anytime an entity is created make sure to double check that the ENTITY_MANAGER object has a reference to it.
        ENTITY_MANAGER.add_entity_if_not_already_added(this)
    },

    _ensure_property_exists: function(property_name, default_value) {
        if (!this.has_property(property_name)) {
            this.set_property(property_name, default_value)
        } else if (this.get_value(property_name) === null || this.get_value(property_name) === undefined) {
            this.set_property(property_name, default_value)
        }
    },

    _ensure_property_value_is_not: function(property_name, bad_value, default_value) {
        if (this.has_property(property_name)) {
            if (this.get_value(property_name) === bad_value) {
                this.set_property(property_name, default_value)
            }
        }
    },

    set_property: function(property_name, property_value) {
        this.keys_and_values[property_name] = property_value
        this.needs_to_be_saved = true
    },

    update_values: function(new_keys_and_values) {
        for (var key in new_keys_and_values) {
            if (new_keys_and_values.hasOwnProperty(key)) {
                this.keys_and_values[key] = new_keys_and_values[key]
            }
        }
        this.needs_to_be_saved = true
    },
    
    has_property: function(property_name) {
        return this.keys_and_values.hasOwnProperty(property_name)
    },

    get_value: function(property_name) {
        return this.keys_and_values[property_name]
    },

    get_name: function() {
        return this.name
    },

    get_properties: function() {
        return this.keys_and_values
    },

    /* __               __       /     __        __   ___      ___           ___      ___   ___    ___  __
      /  ` |__| | |    |  \     /     |__)  /\  |__) |__  |\ |  |     __    |__  |\ |  |  |  |  | |__  /__`
      \__, |  | | |___ |__/    /      |    /~~\ |  \ |___ | \|  |           |___ | \|  |  |  |  | |___ .__/ */

    // TODO : To be even more safe eventually add error reporting for when any logic errors occur (since they shouldn't c:).

    add_child: function(child_entity) {
        var action_occured = false
        // First make sure this entity hasn't already been marked the provided entity as a child.
        if (this.children.indexOf(child_entity) === NOT_FOUND) {
            this.children.push(child_entity)
            action_occured = true
        }
        // Same as above (but cover both id list and object list).
        var child_entity_id = child_entity.get_value(ENTITY_PROPERTY_ID)
        if (this.get_value(ENTITY_PROPERTY_CHILDREN).indexOf(child_entity_id) === NOT_FOUND) {
            this.keys_and_values[ENTITY_PROPERTY_CHILDREN].push(child_entity_id)
            action_occured = true
        }
        if (action_occured) {
            this.needs_to_be_saved = true
            // Since the child reference was added also do a redundant check to make sure that the child has this entity marked as a parent entity.
            child_entity.add_parent(this)
        }
    },

    remove_child: function(child_entity) {
        var index_of_child_id = this.get_value(ENTITY_PROPERTY_CHILDREN).indexOf(child_entity.get_value(ENTITY_PROPERTY_ID))
        var index_of_child_object = this.children.indexOf(child_entity)
        var action_occured = false
        // Check if this entity actually contains the child entity.
        if (index_of_child_id !== NOT_FOUND) {
            this.keys_and_values[ENTITY_PROPERTY_CHILDREN].splice(index_of_child_id, 1)
            action_occured = true
        }
        // Same as above (but cover both id list and object list).
        if (index_of_child_object !== NOT_FOUND) {
            this.children.splice(index_of_child_object, 1)
            action_occured = true
        }
        if (action_occured) {
            this.needs_to_be_saved = true
            // Since the child reference was removed also do a redundant check to make sure that the child has the parent reference to this entity, removed.
            child_entity.remove_parent(this)
        }
    },

    add_parent: function(parent_entity) {
        var action_occured = false
        // First make sure this entity hasn't already marked the provided entity as a parent.
        if (this.parents.indexOf(parent_entity) === NOT_FOUND) {
            this.parents.push(parent_entity)
            action_occured = true
        }
        // Same as above (but cover both id list and object list).
        var parent_entity_id = parent_entity.get_value(ENTITY_PROPERTY_ID)
        if (this.get_value(ENTITY_PROPERTY_PARENTS).indexOf(parent_entity_id) === NOT_FOUND) {
            this.keys_and_values[ENTITY_PROPERTY_PARENTS].push(parent_entity_id)
            action_occured = true
        }
        if (action_occured) {
            this.needs_to_be_saved = true
            // Since the parent reference was added also do a redundant check to make sure that the parent has this entity marked as a child entity.
            parent_entity.add_child(this)
        }
    },

    remove_parent: function(parent_entity) {
        var action_occured = false
        var index_of_parent_id = this.get_value(ENTITY_PROPERTY_PARENTS).indexOf(parent_entity.get_value(ENTITY_PROPERTY_ID))
        var index_of_parent_object = this.parents.indexOf(parent_entity)
        // Check if this entity actually contains the parent entity.
        if (index_of_parent_id !== NOT_FOUND) {
            this.keys_and_values[ENTITY_PROPERTY_PARENTS].splice(index_of_parent_id, 1)
            action_occured = true
        }
        // Same as above (but cover both id list and object list).
        if (index_of_parent_object !== NOT_FOUND) {
            this.parents.splice(index_of_parent_object, 1)
            action_occured = true
        }
        if (action_occured) {
            this.needs_to_be_saved = true
            // Since the parent reference was removed also do a redundant check to make sure that the parent has the child reference to this entity, removed.
            parent_entity.remove_child(this)
        }
    }

}
