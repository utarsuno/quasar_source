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
    days_to_load: null,
    days_loaded: null,
    day_entities: null,

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

        console.log(keys_and_values.constructor.name)
        console.log(keys_and_values.has(ENTITY_PROPERTY_ID))

        console.log(ENTITY_PROPERTY_ID)
        console.log(ENTITY_PROPERTY_ID in keys_and_values)
        console.log(keys_and_values.hasOwnProperty(ENTITY_PROPERTY_ID))

        console.log(ENTITY_PROPERTY_ID in this.keys_and_values)
        console.log(this.keys_and_values.hasOwnProperty(ENTITY_PROPERTY_ID))

        if (this.has_property(ENTITY_PROPERTY_ID)) {
            this.needs_to_be_saved = false
        } else {
            console.log('Assigning a new entity property to the following entity')
            console.log(name)
            console.log(keys_and_values)
            console.log(this)
            console.log(this.has_property(ENTITY_PROPERTY_ID))
            this.keys_and_values.ENTITY_PROPERTY_ID = ENTITY_MANAGER.get_new_entity_id()
            this.needs_to_be_saved = true
        }
        ENTITY_MANAGER.add_entity(this)
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
        console.log('Property name : ' + property_name)
        console.log(this.keys_and_values)
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

    get_properties: function() {
        return this.keys_and_values
    }

}

EntityManager.prototype = {

    entities        : null,
    entities_loaded : null,

    // POST calls.
    post_delete_entity: null,

    __init__: function() {
        this.entities = []
        this.entities_loaded = false

        this.post_delete_entity = new PostHelper('/delete_entity')
    },

    loaded: function() {
        return this.entities_loaded
    },

    entity_deleted_response: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            console.log('Entity deleted!')
        } else {
            console.log('Entity did not get deleted : ' + data)
        }
    },

    delete_entity: function(entity) {

        var entity_to_delete = null
        var index_to_splice = null

        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_value(ENTITY_PROPERTY_ID) === entity.get_value(ENTITY_PROPERTY_ID)) {
                entity_to_delete = this.entities[i]
                index_to_splice = i
            }
        }

        if (entity_to_delete !== null) {
            this.post_delete_entity.perform_post({
                'username': WORLD_MANAGER.player.get_username(),
                'password': WORLD_MANAGER.player.get_password(),
                'ENTITY_PROPERTY_ID': entity_to_delete.get_value(ENTITY_PROPERTY_ID)
            }, this.entity_deleted_response.bind(this))
        }

        if (index_to_splice !== null) {
            this.entities.splice(index_to_splice, 1)
        }
    },

    add_entity: function(entity) {
        this.entities.push(entity)
    },

    add_new_entity: function(entity_name, entity_data) {
        this.entities.push(new Entity(entity_name, entity_data))
    },

    load_entity_from_data: function(entity_data) {

    },

    get_new_entity_id: function() {
        var max_id = -1
        for (var i = 0; i < this.entities.length; i++) {
            var entity_id = parseInt(this.entities[i].get_value(ENTITY_PROPERTY_ID))
            if (entity_id > max_id) {
                max_id = entity_id
            }
        }
        return max_id + 1
    },

    get_all_entities: function() {
        return this.entities
    },

    get_all_entities_of_type: function(entity_type) {
        var type_entities = []
        var number_of_entities = this.entities.length
        console.log('Getting all entities of type : ' + entity_type + ' there are ' + number_of_entities + ' entities.')
        for (var i = 0; i < number_of_entities; i++) {

            console.log(this.entities[i])
            console.log('looking at an entity that has type : ' + this.entities[i].get_value(ENTITY_PROPERTY_TYPE))

            if (this.entities[i].get_value(ENTITY_PROPERTY_TYPE) === entity_type) {
                type_entities.push(this.entities[i])
            }
        }
        return type_entities
    }
}