'use strict'

function Interactive(source_object) {
    this.__init__(source_object)
}

Interactive.prototype = {

    source_object      : null,
    object3D           : null,

    // States.
    being_looked_at    : null,
    being_engaged_with : null,

    __init__: function(source_object) {
        this.source_object      = source_object
        this.object3D           = this.source_object.object3D

        this.being_looked_at    = false
        this.being_engaged_with = false
    }
}