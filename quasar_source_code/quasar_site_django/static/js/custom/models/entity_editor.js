'use strict'

function EntityEditor(name, position, look_at, scene) {
    this.__init__(name, position, look_at, scene)
}

EntityEditor.prototype = {

    name: null,

    close_button: null,
    entity      : null,

    interactive_wall: null,

    __init__: function(name, position, look_at, scene) {
        this.name = name
        this.interactive_wall = new InteractiveWall(400, 300, position, look_at, scene)
        this.interactive_wall.add_title(this.name)
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