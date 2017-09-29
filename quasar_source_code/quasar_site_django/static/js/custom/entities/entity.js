'use strict'

function Owner(username, password) {
    this.__init__(username, password)
}

// Solution from https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_today_with_n_days_offset(n) {
    var date = new Date()

    var result = new Date(date)
    result.setDate(result.getDate() + n)

    var day   = result.getDate()
    var month = result.getMonth()
    var year  = result.getYear()
    return month + '/' + day + '/' + year
}

Owner.prototype = {

    username: null,
    password: null,

    loading_data: null,
    days_to_load: null,
    days_loaded: null,
    day_entities: null,

    days: null,

    // POST calls.
    load_entity_manager: null,
    get_entities_for_day: null,

    __init__: function(username, password) {
        this.username = username
        this.password = password

        this.loading_data = true

        // Have the server load in the owner's entity manager.
        this.load_entity_manager = new PostHelper('/load_entity_manager')
        this.get_entities_for_day = new PostHelper('/get_entities_for_day')
        this.days = []
        this.days_to_load = 14

        console.log('Performing post with : ' + this.username)

        this.load_entity_manager.perform_post({'username': this.username}, this.entity_manager_load_result.bind(this))

        for (var i = 0; i < this.days_to_load; i++) {
            this.get_entities_for_today_offset_n_days(i)
        }
    },

    get_entities_for_today_offset_n_days: function(n) {
        this.get_entities_for_day.perform_post({'username': this.username, 'day': get_today_with_n_days_offset(n)}, this.entities_loaded_for_day.bind(this))
    },

    entities_loaded_for_day: function(data) {
        this.days_loaded++
        console.log('Got the data')
        console.log(data)
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
