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
        console.log('Entities loaded!!')
        console.log(data)
        var e = get_key_value_list_from_json_dictionary(data)
        for (var i = 0; i < e.length; i++) {
            ENTITY_MANAGER.add_entity(e[i])
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

    name            : null,
    keys_and_values : null,

    __init__: function(name, keys_and_values) {
        this.name            = name
        this.keys_and_values = keys_and_values
    },
    
    has_property: function(property_name) {

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

// Entity properties.
const EP_CLASS_NAME = 'CLASS_NAME'

EntityManager.prototype = {

    entities        : null,
    entities_loaded : null,

    __init__: function() {
        this.entities = []
        this.entities_loaded = false
    },

    loaded: function() {
        return this.entities_loaded
    },

    add_entity: function(entity_data) {
        this.entities.push(new Entity(entity_data[0], entity_data[1]))
    },

    get_all_task_entities: function() {
        var task_entities = []
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].get_value(EP_CLASS_NAME) === ENTITY_TYPE_TASK) {
                task_entities.push(this.entities[i])
            }
        }
        return task_entities
    }
}