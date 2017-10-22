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
        this.keys_and_values = keys_and_values

        if (this.has_property(ENTITY_PROPERTY_ID)) {
            this.needs_to_be_saved = false
        } else {
            this.keys_and_values.ENTITY_PROPERTY_ID = ENTITY_MANAGER.get_new_entity_id()
            this.needs_to_be_saved = true
        }
        //ENTITY_MANAGER.add_entity(this)

        // Ensure children property.
        if (!this.has_property(ENTITY_PROPERTY_CHILDREN)) {
            this.set_property(ENTITY_PROPERTY_CHILDREN, [])
        } else if (this.get_value(ENTITY_PROPERTY_CHILDREN) === '[]' || this.get_value(ENTITY_PROPERTY_CHILDREN) === null || this.get_value(ENTITY_PROPERTY_CHILDREN) === undefined) {
            this.set_property(ENTITY_PROPERTY_CHILDREN, [])
        } else {
            // TODO : Check if IDs need to be converted into Entity object references.
        }

        // Ensure parent property.
        if (!this.has_property(ENTITY_PROPERTY_PARENTS)) {
            this.set_property(ENTITY_PROPERTY_PARENTS, [])
        } else if (this.get_value(ENTITY_PROPERTY_PARENTS) === '[]' || this.get_value(ENTITY_PROPERTY_CHILDREN) === null || this.get_value(ENTITY_PROPERTY_CHILDREN) === undefined) {
            this.set_property(ENTITY_PROPERTY_PARENTS, [])
        } else {
            // TODO : Check if IDs need to be converted into Entity object references.
        }
    },

    set_property: function(property_name, property_value) {
        this.keys_and_values[property_name] = property_value
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
        //console.log('Property name : ' + property_name)
        //console.log(this.keys_and_values)
        return this.keys_and_values.hasOwnProperty(property_name)
        //return property_name in this.keys_and_values
    },

    get_id: function() {
        return this.keys_and_values[ENTITY_PROPERTY_ID]
    },

    get_value: function(property_name) {
        return this.keys_and_values[property_name]
    },

    get_name: function() {
        return this.name
    },

    // Returns the properties of this Entity in a format that the server/database want.
    get_save_properties_as_string: function() {
        var parents_list = this.get_value(ENTITY_PROPERTY_PARENTS)
        var children_list = this.get_value(ENTITY_PROPERTY_CHILDREN)

        var parent_ids = []
        var child_ids  = []
        var i
        for (i = 0; i < parents_list.length; i++) {
            parent_ids.push(parents_list[i].get_value(ENTITY_PROPERTY_ID))
        }
        for (i = 0; i < children_list.length; i++) {
            child_ids.push(children_list[i].get_value(ENTITY_PROPERTY_ID))
        }

        console.log(this.keys_and_values)
        console.log(JSON.stringify(this.keys_and_values))

        console.log(parent_ids)
        console.log(child_ids)

        // TODO : send with ids!!!
        return JSON.stringify(this.keys_and_values)
    },

    get_properties: function() {
        return this.keys_and_values
    },

    /* __               __       /     __        __   ___      ___           ___      ___   ___    ___  __
      /  ` |__| | |    |  \     /     |__)  /\  |__) |__  |\ |  |     __    |__  |\ |  |  |  |  | |__  /__`
      \__, |  | | |___ |__/    /      |    /~~\ |  \ |___ | \|  |           |___ | \|  |  |  |  | |___ .__/ */

    add_child: function(child_entity) {
        // First make sure this entity hasn't already been marked the provided entity as a child.
        if (this.get_value(ENTITY_PROPERTY_CHILDREN).indexOf(child_entity) === -1) {
            this.keys_and_values[ENTITY_PROPERTY_CHILDREN].push(child_entity)
            this.needs_to_be_saved = true
            // Since the child reference was added also do a redundant check to make sure that the child has this entity marked as a parent entity.
            child_entity.add_parent(this)
        }
    },

    remove_child: function(child_entity) {
        var index_of_child = this.get_value(ENTITY_PROPERTY_CHILDREN).indexOf(child_entity)
        // Check if this entity actually contains the child entity.
        if (index_of_child !== -1) {
            this.keys_and_values[ENTITY_PROPERTY_CHILDREN].splice(index_of_child, 1)
            this.needs_to_be_saved = true
            // Since the child reference was removed also do a redundant check to make sure that the child has the parent reference to this entity, removed.
            child_entity.remove_parent(this)
        }
    },

    add_parent: function(parent_entity) {
        // First make sure this entity hasn't already marked the provided entity as a parent.
        if (this.get_value(ENTITY_PROPERTY_PARENTS).indexOf(parent_entity) === -1) {
            this.keys_and_values[ENTITY_PROPERTY_PARENTS].push(parent_entity)
            this.needs_to_be_saved = true
            // Since the parent reference was added also do a redundant check to make sure that the parent has this entity marked as a child entity.
            parent_entity.add_child(this)
        }
    },

    remove_parent: function(parent_entity) {
        var index_of_parent = this.get_value(ENTITY_PROPERTY_PARENTS).indexOf(parent_entity)
        // Check if this entity actually contains the parent entity.
        if (index_of_parent !== -1) {
            this.keys_and_values[ENTITY_PROPERTY_PARENTS].splice(index_of_parent, 1)
            this.needs_to_be_saved = true
            // Since the parent reference was removed also do a redundant check to make sure that the parent has the child reference to this entity, removed.
            parent_entity.remove_child(this)
        }
    }

}
