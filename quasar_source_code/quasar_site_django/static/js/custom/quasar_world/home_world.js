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

        World.call(this, 'HomeWorld')

        this.loaded_entities = false

        this.entity_walls = []



        this.players = []
    },

    control_key_down: null,

    //remove_entity: function()

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
        if (!this.player.is_engaged()) {
            if (event.keyCode === KEY_CODE_9) {
                this.create_entity_wall(this.player.get_position(), 'Default')
            }
        }
    },

    create_entity_wall: function(position, wall_text, entity) {
        var entity_wall = new EntityWall(position, this)
        entity_wall.update_title(wall_text)
        entity_wall.set_entity(entity)

        if (is_defined(entity)) {
            for (var ce = 0; ce < entity.children.length; ce++) {
                entity_wall.add_entity(entity.children[ce])
            }
        }

        this.entity_walls.push(entity_wall)
    },

    load_entity_walls: function() {
        var wall_entities = MANAGER_ENTITY.get_all_entities_of_type(ENTITY_TYPE_WALL)
        var number_of_wall_entities = wall_entities.length
        for (var w = 0; w < number_of_wall_entities; w++) {

            l('LOADED THE WALL ENTITY : ')
            l(wall_entities[w])

            //var information = JSON.parse(wall_entities[w]['ENTITY_PROPERTY_INFORMATION'])

            var position = wall_entities[w].get_value(ENTITY_PROPERTY_POSITION)

            position = position.replace('[', '').replace(']', '')
            position = position.split(',')

            var wall_position = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]))
            //var wall_look_at = new THREE.Vector3(parseInt(position[0]), parseInt(position[1]), parseInt(position[2]))

            var title = wall_entities[w].get_value(ENTITY_PROPERTY_NAME)

            this.create_entity_wall(wall_position, title, wall_entities[w])
        }
    },

    update: function() {
        // Get the task entities once all entities have been loaded.
        if (!this.loaded_entities) {
            if (MANAGER_ENTITY.loaded()) {
                // Now create the entity walls from the entities.
                this.load_entity_walls()

                this.loaded_entities = true
            }
        }

        // World function.
        this.update_interactive_objects()

        //
    },

    enter_world: function() {
        this.player.disengage()
        if (!GUI_PAUSED_MENU.currently_displayed) {
            this.player.enable_controls()
        }

        this.player.set_position(new THREE.Vector3(0, 100, 0))
    },

    exit_world: function() {
    },

    // MULTIPLAYER STUFF!!!
    update_player_from_server: function(user_data) {
        var user = user_data[0]
        var position = user_data[1]
        var look_at = user_data[2]

        var player_found = false
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i][0] === user) {
                player_found = true
                this.players[i][1].x = position.x
                this.players[i][1].y = position.y
                this.players[i][1].z = position.z
                this.players[i][1].lookAt(look_at)

                var p_position = new THREE.Vector3(position.x, position.y + 10, position.z)
                var p_look_at = new THREE.Vector3(look_at.x, look_at.y + 10, look_at.z)
                this.players[i][2].x = p_position.x
                this.players[i][2].y = p_position.y
                this.players[i][2].z = p_position.z
                this.players[i][2].lookAt(p_look_at)
            }
        }

        if (!player_found) {

            var player_title = new Floating3DText(100, 'PLAYER NAME', TYPE_TITLE)
            //this.planet_title.update_position_and_look_at(new THREE.Vector3(x, y - 500, z), new THREE.Vector3(0, 0, 0))

            var player_position = new THREE.Vector3(position.x, position.y + 10, position.z)
            var player_look_at = new THREE.Vector3(look_at.x, look_at.y + 10, look_at.z)

            player_title.update_position_and_look_at(player_position, player_look_at)

            this.geometry = new THREE.DodecahedronGeometry(10, 1)

            this.planet_color = 0x8effcb

            this.material = new THREE.MeshBasicMaterial({
                color: 0x8effcb, // '0x8effcb'
                // TODO : Figure out if I should use front side or back side.
                side: THREE.DoubleSide
            })
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.mesh.position.set(position.x, position.y, position.z)

            this.mesh.material.color.setHex(COLOR_TEXT_PLANET)
            player_title.update_just_color(COLOR_TEXT_PLANET)

            var object3D = new THREE.Object3D()
            object3D.add(this.mesh)

            this.add_to_scene(object3D)
            this.add_to_scene(player_title)

            this.players.push([user, object3D, player_title])
        }



    }
}

