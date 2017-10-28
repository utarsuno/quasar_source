'use strict'

function SettingsWorld() {
    this.__init__()
}

SettingsWorld.prototype = {

    __init__: function() {

        //this.current_entity_editor = new FloatingWall(512, current_entity_editor_height, position, this.normal, this.world)

        // Inherit world properties.
        World.call(this, 'SettingsWorld')
    },

    update: function() {
        this.update_interactive_objects()
    },

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
    },

    enter_world: function() {
        this.player.disengage()
        this.player.enable_controls()
        this.current_world = true

        this.player.set_position(new THREE.Vector3(0, 0, 0))
    },

    exit_world: function() {
        this.current_world = false
    }
}