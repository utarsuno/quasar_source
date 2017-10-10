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


    }
}