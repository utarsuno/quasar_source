'use strict'

function EntityEditor(position, look_at, scene) {
    this.__init__(position, look_at, scene)
}

EntityEditor.prototype = {

    close_button: null,
    entity      : null,

    interactive_wall: null,

    __init__: function(position, look_at, scene) {
        this.interactive_wall = new InteractiveWall(400, 300, position, look_at, scene)
    },

    toggle_visibility: function() {
        this.interactive_wall.toggle_visibility()
    },

    set_to_invisible: function() {
        this.interactive_wall.set_to_invisible()
    },

    is_visible: function() {
        return this.interactive_wall.is_visible
    }
}