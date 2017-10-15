'use strict'

function HomeWorld() {
    this.__init__()
}

HomeWorld.prototype = {

    //
    entity_walls: null,

    //
    loaded_entities: null,

    __init__: function() {

        World.call(this)

        this.loaded_entities = false

        this.entity_walls = []
    },

    control_key_down: null,

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
        if (!this.player.is_engaged()) {
            if (event.keyCode === KEY_CODE_9) {
                this.create_entity_wall(this.player.get_position(), 'Default')
            }
        }
    },

    create_entity_wall: function(position, wall_text) {
        var entity_wall = new EntityWall(position, this)
        entity_wall.update_title(wall_text)
        this.entity_walls.push(entity_wall)
        var interactives = entity_wall.get_all_interactive_objects()
        var number_of_interactives = interactives.length
        for (var i = 0; i < number_of_interactives; i++) {
            this.interactive_objects.push(interactives[i])
        }
    },

    load_entity_walls: function() {
        var wall_entities = ENTITY_MANAGER.get_all_entities_of_type(ENTITY_TYPE_WALL)
        var number_of_wall_entities = wall_entities.length
        for (var w = 0; w < number_of_wall_entities; w++) {

            console.log('LOADED THE WALL ENTITY : ')
            console.log(wall_entities[w])

            //var information = JSON.parse(wall_entities[w]['ENTITY_PROPERTY_INFORMATION'])

            var position = wall_entities[w].get_value('ENTITY_PROPERTY_POSITION')

            console.log('POSITION IS : ')
            console.log(position)

            position = position.replace('[', '').replace(']', '')
            position = position.split(',')

            var wall_position = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]))
            //var wall_look_at = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]))

            var title = wall_entities[w].get_value('ENTITY_PROPERTY_NAME')

            console.log('POSITION IS : ' + position)
            console.log('TITLE IS : ' + title)

            this.create_entity_wall(wall_position, title)

            console.log('LOADED THE WALL ENTITY : ')
            console.log(wall_entities[w])
        }
    },

    update: function() {
        // Get the task entities once all entities have been loaded.
        if (!this.loaded_entities) {
            if (ENTITY_MANAGER.loaded()) {
                // Now create the entity walls from the entities.
                this.load_entity_walls()

                this.loaded_entities = true
            }
        }

        this.update_interactive_objects()
    },

    enter_world: function() {
        this.player.disengage()
        this.current_world = true
        this.player.set_position(new THREE.Vector3(0, 100, 0))
    },

    exit_world: function() {
        this.current_world = false
    }
}

