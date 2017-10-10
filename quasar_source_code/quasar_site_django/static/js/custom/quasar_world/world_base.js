'use strict'

function World() {
    this.__init__()
}

World.prototype = {

    interactive_objects: null,

    __init__: function() {
        this.interactive_objects = []
    }
}