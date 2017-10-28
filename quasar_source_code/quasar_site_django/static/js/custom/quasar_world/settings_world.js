'use strict'

function SettingsWorld() {
    this.__init__()
}

SettingsWorld.prototype = {

    __init__: function() {

        /*
        var entity_wall = new EntityWall(position, this)
        entity_wall.update_title(wall_text)
        entity_wall.set_entity(entity)

        if (entity !== null && entity !== undefined) {
            for (var ce = 0; ce < entity.children.length; ce++) {
                entity_wall.add_entity(entity.children[ce])
            }
        }

        this.entity_walls.push(entity_wall)
        var interactives = entity_wall.get_all_interactive_objects()
        var number_of_interactives = interactives.length
        for (var i = 0; i < number_of_interactives; i++) {
            this.interactive_objects.push(interactives[i])
        }
        */

        // Inherit world properties.
        World.call(this)
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