'use strict'

function Owner(username, password, home_world) {
    this.__init__(username, password, home_world)
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

    __init__: function(username, password, home_world) {
        this.username = username
        this.password = password
        this.home_world = home_world

        this.loading_data = true

        this.get_entities_for_day = new PostHelper('/get_entities_for_day')
        this.days = []
        this.days_to_load = 14

        // Get the offset so that we start on monday.
        var date = new Date()
        var day_offset = date.getDay()

        for (var i = 0; i < this.days_to_load; i++) {
            this.get_entities_for_today_offset_n_days(i - day_offset + 1)
            console.log(get_today_with_n_days_offset(i - day_offset + 1))
        }
    },

    get_entities_for_today_offset_n_days: function(n) {
        this.get_entities_for_day.perform_post({'username': this.username, 'day': get_today_with_n_days_offset(n)}, this.entities_loaded_for_day.bind(this))
    },

    entities_loaded_for_day: function(data) {
        this.days_loaded++
        data = JSON.parse(data)

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.home_world.add_entity(data[key], key)
            }
        }
    },

}
