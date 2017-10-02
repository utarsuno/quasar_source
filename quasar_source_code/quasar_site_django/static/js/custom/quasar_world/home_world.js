'use strict'

function HomeWorld() {
    this.__init__()
}

HomeWorld.prototype = {
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

        this.button_3d = new Button3D(50, 'Hello Button', this.scene)
        this.button_3d.update_position_and_look_at(new THREE.Vector3(50, 50, 50), new THREE.Vector3(50, 150, 50))

        this.ajax_status = new Floating2DText(400, 30, '', TYPE_TITLE, this.scene)
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
                    var week_title = new Floating2DText(200, 25, 'Current Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90 + 300, z_position), new THREE.Vector3(0, 90 + 300, 0))
                    week += 1
                    this.day_entities[i].push(week_title)
                } else if (week == 1) {
                    var week_title = new Floating2DText(200, 25, 'Next Week', TYPE_TITLE, this.scene)
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

            var day_floating_text = new Floating2DText(150, 25, day_string, TYPE_TITLE, this.scene)
            day_floating_text.update_position_and_look_at(new THREE.Vector3(x_position, 50 + 300, z_position), new THREE.Vector3(0, 50 + 300, 0))
            this.day_entities[i].push(day_floating_text)
            this.y_offsets[i] += 40
        }
    },

    add_entity: function(entity_string, day_index) {
        for (var t = 0; t < this.days.length; t++) {
            if (day_index === this.days[t]) {
                var x_position = Math.cos(this.angle_delta * t) * this.radius
                var z_position = Math.sin(this.angle_delta * t) * this.radius

                var floating_entity = new Floating2DText(256, 32, entity_string, TYPE_STATUS, this.scene)
                floating_entity.update_position_and_look_at(new THREE.Vector3(x_position, 50 + 300 - this.y_offsets[t], z_position), new THREE.Vector3(0, 50 + 300 - this.y_offsets[t], 0))

                this.day_entities[t].push(floating_entity)
                this.y_offsets[t] += 40
            }
        }
    },

    update: function() {

    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    enter_world: function() {
        this.current_world = true
        if (this.got_camera === false) {
            this.add_to_scene(this.player.fps_controls.get_object())
        }
        if (this.hello_message === null) {
            this.ajax_status.update_text('Welcome back ' + this.player.get_username())
        }
        this.player.set_position(new THREE.Vector3(130, 90, 300))
    },

    exit_world: function() {
        this.current_world = false
    }
}

