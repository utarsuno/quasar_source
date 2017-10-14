'use strict'

function Interactive() {

    // Settings.
    this.needs_engage_for_parsing_input = true

    // Function events.
    this.engage_function    = null
    this.disengage_function = null
    this.look_at_function   = null
    this.look_away_function = null

    // States.
    this.being_looked_at    = false
    this.being_engaged_with = false

    // Next table target pointer.
    this.next_tab_target    = null

    this.look_away = function() {
        this.being_looked_at = false
        this.state_change_look_at(false)
        if (this.look_away_function !== null) {
            this.look_away_function()
        }
    }

    this.look_at = function() {
        this.being_looked_at = true
        this.state_change_look_at(true)
        if (this.look_at_function !== null) {
            this.look_at_function()
        }
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

    this.set_look_at_function = function(look_at_function) {
        this.look_at_function = look_at_function
    }

    this.set_look_away_function = function(look_away_function) {
        this.look_away_function = look_away_function
    }

    this.set_next_tab_target = function(tab_target) {
        this.next_tab_target = tab_target
    }
}
