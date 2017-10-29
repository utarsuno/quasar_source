'use strict'

function SettingsWorld() {
    this.__init__()
}

SettingsWorld.prototype = {

    previous_world: null,

    __init__: function() {

        // Inherit world properties.
        World.call(this, 'SettingsWorld')

        var position = new THREE.Vector3(500, 500, 700)
        this.normal = new THREE.Vector3(-.5, 0, -.85)
        this.normal.normalize()
        this.profile_editor = new FloatingWall(1024, 512, position, this.normal, this)

        var create_entity_wall_title = this.profile_editor.add_floating_2d_text(512 / 2, 'Edit ur profile kidddooo', TYPE_TITLE, 512 / -4, 2, 0, 0)
        this.profile_editor.add_object_to_remove_later(create_entity_wall_title)

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
        if (!PAUSED_MENU.currently_displayed) {
            this.player.enable_controls()
        }

        this.player.set_position(new THREE.Vector3(0, 10, 0))

        this.previous_world = WORLD_MANAGER.previous_world

    },

    exit_world: function() {
    }
}