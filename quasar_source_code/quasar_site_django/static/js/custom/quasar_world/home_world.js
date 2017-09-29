'use strict'

function HomeWorld() {
    this.__init__()
}

HomeWorld.prototype = {
    scene: null,
    player: null,

    hello_message: null,

    got_camera: null,

    current_world: null,

    //


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

        this.ajax_status = new Floating2DText(400, 30, '', TYPE_TITLE, this.scene)
        this.ajax_status.update_position_and_look_at(new THREE.Vector3(150, 100, 45), new THREE.Vector3(150, 100, 55))


        // Create the 2 week views here.
        // Temporary design testing.

        var number_of_segments = 14
        var angle_delta = (Math.PI * 2.0) / number_of_segments
        var radius = 500

        this.day_titles = []

        var week = 0

        for (var i = 0; i < number_of_segments; i++) {
            var day_string = ''
            var x_position = Math.cos(angle_delta * i) * radius
            var z_position = Math.sin(angle_delta * i) * radius
            switch(i % 7) {
            case 0:
                day_string = 'Monday'
                if (week == 0) {
                    var week_title = new Floating2DText(200, 25, 'Current Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90, z_position), new THREE.Vector3(0, 90, 0))
                    week += 1
                    this.day_titles.push(week_title)
                } else if (week == 1) {
                    var week_title = new Floating2DText(200, 25, 'Next Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90, z_position), new THREE.Vector3(0, 90, 0))
                    this.day_titles.push(week_title)
                }
                break
            case 1:
                day_string = 'Tuesday'
                break
            case 2:
                day_string = 'Wednesday'
                break
            case 3:
                day_string = 'Thursday'
                break
            case 4:
                day_string = 'Friday'
                break
            case 5:
                day_string = 'Saturday'
                break
            case 6:
                day_string = 'Sunday'
                break
            }

            var day_floating_text = new Floating2DText(150, 25, day_string, TYPE_TITLE, this.scene)
            console.log(x_position + '\t' + z_position)

            day_floating_text.update_position_and_look_at(new THREE.Vector3(x_position, 50, z_position), new THREE.Vector3(0, 50, 0))
            this.day_titles.push(day_floating_text)
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

