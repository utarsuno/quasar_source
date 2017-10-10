'use strict'

function Interactive() {

    // Function events.
    this.engage_function    = null
    this.disengage_function = null

    // States.
    this.being_looked_at    = false
    this.being_engaged_with = false

    this.look_away = function() {
        this.being_looked_at = false
        this.state_change_look_at(false)
    }

    this.look_at = function() {
        this.being_looked_at = true
        this.state_change_look_at(true)
    }

    this.disengage = function(player) {
        this.being_engaged_with = false
        this.state_change_engage(false, player)
        if (this.disengage_function !== null) {
            this.disengage_function()
        }
    }

    this.is_engaged = function() {
        return this.being_engaged_with
    }

    this.engage = function(player) {
        this.being_engaged_with = true
        this.state_change_engage(true, player)
        if (this.engage_function !== null) {
            this.engage_function()
        }
    }

    this.set_engage_function = function(engage_function) {
        this.engage_function = engage_function
    }

    this.set_disengage_function = function(disengage_function) {
        this.disengage_function = disengage_function
    }
}
