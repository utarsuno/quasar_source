'use strict'

function HomeWorld() {
    this.__init__()
}

const GLOBAL_TODOS_POSITION_X = 0
const GLOBAL_TODOS_POSITION_Z = -1000
const GLOBAL_TODOS_POSITION_Y_TOP = 800

HomeWorld.prototype = {
    // World variables.
    interactive_objects: null,
    scene: null,
    player: null,

    hello_message: null,

    // State variables.
    got_camera: null,
    current_world: null,

    //
    day_entities: null,
    y_offsets: null,

    //
    radius: null,
    number_of_segments: null,
    angle_delta: null,

    //
    days: null,


    //
    button_3d: null,

    // TODO : Add a daily todos section.
    // TODO : Add a global todos section.

    // Global todos.
    global_tasks_title: null,
    create_global_task_button: null,


    __init__: function() {

        this.current_world = false

        this.got_camera = false

        this.scene = new THREE.Scene()

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

        /* __        __   __               ___  __   __   __   __
          / _` |    /  \ |__)  /\  |        |  /  \ |  \ /  \ /__`    |  |  /\  |    |
          \__> |___ \__/ |__) /~~\ |___     |  \__/ |__/ \__/ .__/    |/\| /~~\ |___ |___ */

        this.global_tasks_title = new Floating3DText(256, 'Global Tasks', TYPE_TITLE, this.scene)
        this.global_tasks_title.update_position_and_look_at(new THREE.Vector3(GLOBAL_TODOS_POSITION_X, GLOBAL_TODOS_POSITION_Y_TOP, GLOBAL_TODOS_POSITION_Z - 5), new THREE.Vector3(0, GLOBAL_TODOS_POSITION_Y_TOP, 0))

        this.create_global_task_button = new Floating2DText(64, 'Create Entity', TYPE_BUTTON, this.scene)
        this.create_global_task_button.update_position_and_look_at(new THREE.Vector3(GLOBAL_TODOS_POSITION_X, GLOBAL_TODOS_POSITION_Y_TOP - 32, GLOBAL_TODOS_POSITION_Z), new THREE.Vector3(0, GLOBAL_TODOS_POSITION_Y_TOP - 32, 0))


        this.entity_editor = new EntityEditor('Create Task', new THREE.Vector3(GLOBAL_TODOS_POSITION_X, GLOBAL_TODOS_POSITION_Y_TOP - 32, GLOBAL_TODOS_POSITION_Z + 2), new THREE.Vector3(0, GLOBAL_TODOS_POSITION_Y_TOP - 32, 0), this.scene)
        this.entity_editor.set_to_invisible()

        /*
        var wall_position = new THREE.Vector3(1000, 400, 1000)
        var wall_look_at  = new THREE.Vector3(0, 400, 0)
        this.daily_tasks_wall = new InteractiveWall(400, 800, wall_position, wall_look_at, this.scene)

        var wall_position2 = new THREE.Vector3(-1000, 400, -1000)
        var wall_look_at2  = new THREE.Vector3(0, 400, 0)
        this.daily_tasks_wall2 = new InteractiveWall(400, 800, wall_position2, wall_look_at2, this.scene)
        */


        /* __             ___       __        __           __   ___
          /  `  /\  |    |__  |\ | |  \  /\  |__)     /\  |__) |__   /\
          \__, /~~\ |___ |___ | \| |__/ /~~\ |  \    /~~\ |  \ |___ /~~\ */

        this.button_3d = new Button3D(50, 'Hello Button', this.scene)
        this.button_3d.update_position_and_look_at(new THREE.Vector3(50, 50, 50), new THREE.Vector3(50, 150, 50))

        this.ajax_status = new Floating2DText(400, '', TYPE_TITLE, this.scene)
        this.ajax_status.update_position_and_look_at(new THREE.Vector3(150, 100, 45), new THREE.Vector3(150, 100, 55))

        this.day_indexes = []
        this.y_offsets = []
        this.day_entities = []

        this.days = get_list_of_dates_consisting_of_this_and_next_week()
        this.number_of_segments = this.days.length
        for (var d = 0; d < this.days.length; d++) {
            this.y_offsets.push(40)
            this.day_entities.push([])
            this.day_indexes.push(this.days[d])
        }

        this.angle_delta = (Math.PI * 2.0) / this.number_of_segments
        this.radius = 600

        var week = 0

        for (var i = 0; i < this.number_of_segments; i++) {
            var day_string = ''
            var x_position = Math.cos(this.angle_delta * i) * this.radius
            var z_position = Math.sin(this.angle_delta * i) * this.radius
            var day_value = this.day_indexes[i].split('/')[1]
            switch(i % 7) {
            case 0:
                day_string = 'Monday ' + day_value
                if (week == 0) {
                    var week_title = new Floating3DText(256, 'Current Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90 + 300, z_position), new THREE.Vector3(0, 90 + 300, 0))
                    week += 1
                    this.day_entities[i].push(week_title)
                } else if (week == 1) {
                    var week_title = new Floating3DText(256, 'Next Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90 + 300, z_position), new THREE.Vector3(0, 90 + 300, 0))
                    this.day_entities[i].push(week_title)
                }
                break
            case 1:
                day_string = 'Tuesday ' + day_value
                break
            case 2:
                day_string = 'Wednesday ' + day_value
                break
            case 3:
                day_string = 'Thursday ' + day_value
                break
            case 4:
                day_string = 'Friday ' + day_value
                break
            case 5:
                day_string = 'Saturday ' + day_value
                break
            case 6:
                day_string = 'Sunday ' + day_value
                break
            }

            var day_floating_text = new Floating2DText(150, day_string, TYPE_TITLE, this.scene)
            day_floating_text.update_position_and_look_at(new THREE.Vector3(x_position, 50 + 300, z_position), new THREE.Vector3(0, 50 + 300, 0))
            this.day_entities[i].push(day_floating_text)
            this.y_offsets[i] += 40
        }

        this.interactive_objects = [
            this.create_global_task_button
        ]
        var wall_objects = this.entity_editor.interactive_wall.get_all_interactive_objects()
        var wall_objects_length = wall_objects.length
        for (var x = 0; x < wall_objects_length; x++) {
            this.interactive_objects.push(wall_objects[x])
        }
    },

    key_down_event: function(event) {
        var i
        if (event.keyCode == 220) { // backslash
            if (this.player.is_engaged()) {
                for (i = 0; i < this.interactive_objects.length; i++) {
                    if (this.interactive_objects[i].being_looked_at) {
                        this.interactive_objects[i].disengage(this.player)
                    }
                }
            }
        } else if (event.keyCode == 9) { // tab
            // Oh, player.look_at() needs to be working first.
            //if (this.player.is_engaged()) {
            //}

            event.preventDefault()
            event.stopPropagation()
            // Prevent default and prevent
        }

        for (i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i].is_engaged()) {
                this.interactive_objects[i].parse_keycode(event)
            }
        }

        if (event.keyCode == 69) { // e
            for (i = 0; i < this.interactive_objects.length; i++) {
                if (this.interactive_objects[i].being_looked_at) {
                    this.interactive_objects[i].engage(this.player)

                    if (this.interactive_objects[i] === this.create_global_task_button) {

                        this.entity_editor.toggle_visibility()
                        //console.log('Display the entities!')
                    }
                }
            }
        }
    },

    add_entity: function(entity_string, day_index) {
        for (var t = 0; t < this.days.length; t++) {
            if (day_index === this.days[t]) {
                var x_position = Math.cos(this.angle_delta * t) * this.radius
                var z_position = Math.sin(this.angle_delta * t) * this.radius

                var floating_entity = new Floating2DText(256, entity_string, TYPE_STATUS, this.scene)
                floating_entity.update_position_and_look_at(new THREE.Vector3(x_position, 50 + 300 - this.y_offsets[t], z_position), new THREE.Vector3(0, 50 + 300 - this.y_offsets[t], 0))

                this.day_entities[t].push(floating_entity)
                this.y_offsets[t] += 40
            }
        }
    },

    update: function() {
        var raycaster = new THREE.Raycaster(this.player.fps_controls.get_position(), this.player.fps_controls.get_direction())

        for (var i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i] !== this.previously_looked_at) {
                this.interactive_objects[i].look_away()
            }
            if (this.interactive_objects[i].is_visible) {
                var intersections = raycaster.intersectObject(this.interactive_objects[i].object3D, true)
                if (intersections.length > 0) {
                    this.interactive_objects[i].look_at()
                    this.previously_looked_at = this.interactive_objects[i]
                }
            }
        }
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    enter_world: function() {
        if (this.got_camera === false) {
            this.add_to_scene(this.player.fps_controls.get_object())
            this.got_camera = true
        }
        if (this.hello_message === null) {
            this.ajax_status.update_text('Welcome back ' + this.player.get_username())
        }
        this.player.set_position(new THREE.Vector3(130, 90, 300))
    },

    exit_world: function() {
    }
}

