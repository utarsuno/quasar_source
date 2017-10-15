'use strict'

function HomeWorld() {
    this.__init__()
}

const GLOBAL_TODOS_POSITION_X = 0
const GLOBAL_TODOS_POSITION_Z = -1000
const GLOBAL_TODOS_POSITION_Y_TOP = 800

HomeWorld.prototype = {
    // POST calls.
    post_get_all_entities: null,

    //
    entity_walls: null,

    //
    loaded_entities: null,

    create_global_task_button_clicked: function() {
        this.entity_task_editor.set_to_visible()
    },

    create_task_clicked: function(data) {
        console.log('SAVE THE ENTITY DATA!!!')
        console.log(data)

        this.global_todos_wall.add_single_text_row(JSON.stringify(data))

        this.entity_task_editor.set_to_invisible()

        // TODO : clear the fields
        // this.entity_task_editor.clear_fields()

        // TODO : later put in a physical save button to avoid consuming server resources.

        // TODO : AJAX save entities
    },

    __init__: function() {

        World.call(this)

        this.loaded_entities = false

        // Going to try to create a plane here.
        var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 10, 10)
        plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
        //var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
        var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
        var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
        this.add_to_scene(plane_mesh)

        var light3 = new THREE.PointLight(0xccffcc, .8, 0)
        light3.position.set(5, 100, 5)
        this.add_to_scene(light3)

        var color1 = '#b9ffd2'
        var color2 = '#090920'
        var light2 = new THREE.HemisphereLight(color1, color2, .5)
        this.add_to_scene(light2)

        var light = new THREE.AmbientLight(0x404040, .2) // soft white light
        this.add_to_scene(light)

        ////////
        this.entity_walls = []

        this.global_todos_wall = new InteractiveWall(256 * 4, 800, new THREE.Vector3(GLOBAL_TODOS_POSITION_X, GLOBAL_TODOS_POSITION_Y_TOP / 2, GLOBAL_TODOS_POSITION_Z), new THREE.Vector3(0, 400, 0), this.scene)
        this.global_todos_wall.add_title('Global Tasks')
        this.global_todos_wall.add_input_button('CREATE TASK', this.create_global_task_button_clicked.bind(this))

        this.global_todos_wall.get_reference_of_world(this)

        this.entity_task_editor = new EntityTaskCreator('CREATE TASK', new THREE.Vector3(GLOBAL_TODOS_POSITION_X, GLOBAL_TODOS_POSITION_Y_TOP - 32, GLOBAL_TODOS_POSITION_Z + 26), new THREE.Vector3(0, GLOBAL_TODOS_POSITION_Y_TOP - 32, 0), this.scene)
        this.entity_task_editor.set_to_invisible()
        this.entity_task_editor.set_create_entity_button_click(this.create_task_clicked.bind(this))
    },

    control_key_down: null,

    key_down_event: function(event) {
        this.key_down_event_for_interactive_objects(event)
        if (event.keyCode === KEY_CODE_9) {
            this.create_entity_wall()
        }
    },

    create_entity_wall: function() {
        var entity_wall = new EntityWall(this.player.get_position(), this)
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

