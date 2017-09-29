'use strict'

function Owner(username, password) {
    this.__init__(username, password)
}

// Solution from https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_today_with_n_days_offset(n) {
    var date = new Date(this.valueOf() + n * 24 * 60 * 60 * 1000)
    var day   = today.getDate()
    var month = today.getMonth()
    var year  = today.getYear()
    return month + '/' + day + '/' + year
}

Owner.prototype = {

    username: null,
    password: null,

    // POST calls.
    load_entity_manager: null,
    get_entities_for_day: null,

    __init__: function(username, password) {
        this.username = username
        this.password = password

        // Have the server load in the owner's entity manager.
        this.load_entity_manager = new PostHelper('/load_entity_manager')
        this.get_entities_for_day = new PostHelper('/get_entities_for_day')

        this.load_entity_manager.perform_post({'username': this.username}, this.entity_manager_load_result.bind(this))
    },

    get_entities_for_today_offset_n_days: function(n) {
        this.get_entities_for_day.perform_post({'date': get_today_with_n_days_offset(n)}, this.entities_loaded_for_day.bind(this))
    },

    entities_loaded_for_day: function(data) {
        // TODO : ...
    },

    entity_manager_load_result: function(data) {
        if (data === SERVER_REPLY_GENERIC_YES) {
            console.log('Loaded entity manager data!')
        } else {
            console.log('Failed to load entity manager data!')
            console.log(data)
        }
    }

}
