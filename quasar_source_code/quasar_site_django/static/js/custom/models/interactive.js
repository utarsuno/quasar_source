'use strict'

function Interactive(source_object) {
    this.__init__(source_object)
}

Interactive.prototype = {

    source_object      : null,

    engage_function    : null,
    disengage_function : null,

    // States.
    being_looked_at    : null,
    being_engaged_with : null,

    __init__: function(source_object) {
        this.source_object      = source_object

        this.being_looked_at    = false
        this.being_engaged_with = false
    },

    look_away: function() {
        this.being_looked_at = false
        this.source_object.state_change_look_at(false)
    },

    look_at: function() {
        this.being_looked_at = true
        this.source_object.state_change_look_at(true)
    },

    disengage: function(player) {
        this.being_engaged_with = false
        this.source_object.state_change_engage(false, player)
        if (this.disengage_function !== null) {
            this.disengage_function()
        }
    },

    is_engaged: function() {
        return this.being_engaged_with
    },

    engage: function(player) {
        this.being_engaged_with = true
        this.source_object.state_change_engage(true, player)
        if (this.engage_function !== null) {
            this.engage_function()
        }
    },

    set_engage_function: function(engage_function) {
        this.engage_function = engage_function
    },

    set_disengage_function: function(disengage_function) {
        this.disengage_function = disengage_function
    }
}