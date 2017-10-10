'use strict'

function Owner(username, password, home_world) {
    this.__init__(username, password, home_world)
}

function Entity() {
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
    get_entities_for_day: null,
    load_all_entities   : null,

    __init__: function(username, password, home_world) {
        this.username = username
        this.password = password
        this.home_world = home_world

        this.loading_data = true

        // TODO : Eventually remove this as all entities will already end up being loaded.
        this.get_entities_for_day = new PostHelper('/get_entities_for_day')
        this.days = get_list_of_dates_consisting_of_this_and_next_week()
        for (var i = 0; i < this.days.length; i++) {
            this.get_entities_for_day.perform_post({'username': this.username, 'day': this.days[i]}, this.entities_loaded_for_day.bind(this))
        }



        // TODO : load all entities here

    },

    entities_loaded_for_day: function(data) {
        this.days_loaded++
        data = JSON.parse(data)

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                //console.log('Adding entity [' + key + ']' + '{' + data[key] + '}')
                var d = data[key]
                if (d.length > 0) {
                    for (var i = 0; i < d.length; i++) {
                        this.home_world.add_entity(d[i], key)
                    }
                }

            }
        }
        if (this.days_loaded == this.days.length) {
            this.loading_data = false
        }
    }

}

Entity.prototype = {

    properties: null,

    __init__: function() {

    }

}