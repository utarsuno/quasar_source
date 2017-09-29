'use strict'

function HomeWorld() {
    this.__init__()
}


// Solution from https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_today_with_n_days_offset(n) {
    var date = new Date()

    var result = new Date(date)
    result.setDate(result.getDate() + n)

    var day   = result.getDate()
    var month = result.getMonth()
    var year  = result.getYear()
    return month + '/' + day + '/' + year
}

HomeWorld.prototype = {
    scene: null,
    player: null,

    hello_message: null,

    got_camera: null,

    current_world: null,

    //
    day_entities: null,

    //
    radius: null,
    number_of_segments: null,
    angle_delta: null,

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

        this.number_of_segments = 14
        this.day_entities = []
        for (var x = 0; x < this.number_of_segments; x++) {
            this.day_entities.push([])
        }
        this.angle_delta = (Math.PI * 2.0) / this.number_of_segments
        this.radius = 500

        this.day_titles = []

        var week = 0

        for (var i = 0; i < this.number_of_segments; i++) {
            var day_string = ''
            var x_position = Math.cos(this.angle_delta * i) * this.radius
            var z_position = Math.sin(this.angle_delta * i) * this.radius
            switch(i % 7) {
            case 0:
                day_string = 'Monday'
                if (week == 0) {
                    var week_title = new Floating2DText(200, 25, 'Current Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90 + 300, z_position), new THREE.Vector3(0, 90 + 300, 0))
                    week += 1
                    this.day_entities[i % 7].push(week_title)
                    this.day_titles.push(week_title)
                } else if (week == 1) {
                    var week_title = new Floating2DText(200, 25, 'Next Week', TYPE_TITLE, this.scene)
                    week_title.update_position_and_look_at(new THREE.Vector3(x_position, 90 + 300, z_position), new THREE.Vector3(0, 90 + 300, 0))
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

            day_floating_text.update_position_and_look_at(new THREE.Vector3(x_position, 50 + 300, z_position), new THREE.Vector3(0, 50 + 300, 0))
            this.day_titles.push(day_floating_text)
        }
    },

    add_entity: function(entity_string, day_index) {

        console.log('Entity string is : ' + entity_string)

        // TODO : Optimize this function lol...
        var day_match = -1;
        for (var i = 0; i < 14; i++) {
            var day_string = get_today_with_n_days_offset(i)
            console.log(day_string + '\t' + day_index + '\t' + (day_string === day_index))
            if (day_string === day_index) {
                day_match = i
                break
            }
        }

        console.log('day match is : ' + day_match)
        console.log('Entity string : ' + entity_string + ' : day index : ' + day_index)

        // Check the number of elements in that day to get the y offset.
        var y_offset = this.day_entities[day_match].length * 40

        var x_position = Math.cos(this.angle_delta * day_match) * this.radius
        var z_position = Math.sin(this.angle_delta * day_match) * this.radius

        var floating_entity = new Floating2DText(512, 32, entity_string, TYPE_STATUS, this.scene)
        floating_entity.update_position_and_look_at(new THREE.Vector3(x_position, 100 - y_offset, z_position), new THREE.Vector3(x_position, 100 - y_offset, z_position))

        this.day_entities[day_match].push(floating_entity)
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

