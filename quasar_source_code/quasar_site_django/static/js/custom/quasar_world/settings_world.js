'use strict'

function SettingsWorld() {
    this.__init__()
}

SettingsWorld.prototype = {

    __init__: function() {

        var position = new THREE.Vector3(900, 500, 1500)
        this.normal = new THREE.Vector3(-.5, 0, -.85)
        this.normal.normalize()
        this.current_entity_editor = new FloatingWall(512, 1024, position, this.normal, this)


        // Inherit world properties.
        World.call(this, 'SettingsWorld')

        var lightr = new THREE.PointLight(0xff8579, .8, 0)
        lightr.position.set(1000, 100, 0)
        this.add_to_scene(lightr)

        var lightg = new THREE.PointLight(0xb1ff90, .8, 0)
        lightg.position.set(0, 100, 1000)
        this.add_to_scene(lightg)

        var lightb = new THREE.PointLight(0x84b5ff, .8, 0)
        lightb.position.set(500, 100, 500)
        this.add_to_scene(lightb)

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