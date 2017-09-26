'use strict'

function LoginWorld() {
    this.__init__()
}

LoginWorld.prototype = {

    scene: null,

    player: null,

    username_label: null,
    username_field: null,
    password_label: null,
    password_field: null,

    set_player_look_at: null,

    interactive_objects : null,

    __init__: function() {
        // Create the scene.
        this.scene = new THREE.Scene()

        // Going to try to create a plane here.
        var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
        plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
        //var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
        var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
        var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
        this.add_to_scene(plane_mesh)

        // Add lights.
        /*
        var color1 = '#b9ffd2'
        var color2 = '#090920'
        var light = new THREE.HemisphereLight(color1, color2, .5)
        this.add_to_scene(light)
        */

        var light3 = new THREE.PointLight(0xccffcc, .8, 0)
        light3.position.set(5, 100, 5)
        this.add_to_scene(light3)

        // Login fields.
        this.login_label = new Floating2DText(100, 40, 'Login :', TYPE_TITLE, this.scene)
        this.login_label.update_position_and_look_at(new THREE.Vector3(0, 110, 45), new THREE.Vector3(0, 110, 55))

        this.username_label = new Floating2DText(50, 20, 'Username :', TYPE_LABEL, this.scene)
        this.username_field = new Floating2DText(100, 20, '', TYPE_INPUT_REGULAR, this.scene)

        this.password_label = new Floating2DText(50, 20, 'Password :', TYPE_LABEL, this.scene)
        this.password_field = new Floating2DText(100, 20, '', TYPE_INPUT_PASSWORD, this.scene)

        this.login_button = new Floating2DText(50, 20, 'Login', TYPE_BUTTON, this.scene)

        this.username_label.update_position_and_look_at(new THREE.Vector3(0, 70, 45), new THREE.Vector3(0, 70, 55))
        this.username_field.update_position_and_look_at(new THREE.Vector3(75, 70, 45), new THREE.Vector3(75, 70, 55))

        this.password_label.update_position_and_look_at(new THREE.Vector3(0, 40, 45), new THREE.Vector3(0, 40, 55))
        this.password_field.update_position_and_look_at(new THREE.Vector3(75, 40, 45), new THREE.Vector3(75, 40, 55))

        this.login_button.update_position_and_look_at(new THREE.Vector3(0, 10, 45), new THREE.Vector3(0, 10, 55))

        // Create account fields.


        // Create a list of the interactive floating texts.
        this.interactive_objects = [this.password_field, this.username_field, this.login_button]

        // Handle key press events.
        document.addEventListener('keydown', this.on_key_press.bind(this), false)

        this.set_player_look_at = false
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    update: function() {
        if (this.set_player_look_at) {
            this.player.look_at(new THREE.Vector3(0, 70, 45))
            this.set_player_look_at = false
        }

        //var position = this.player.fps_controls.get_position()
        //var direction = this.player.fps_controls.get_direction()

        var raycaster = new THREE.Raycaster(this.player.fps_controls.get_position(), this.player.fps_controls.get_direction())

        for (var i = 0; i < this.interactive_objects.length; i++) {
            this.interactive_objects[i].look_away()
            var intersections = raycaster.intersectObject(this.interactive_objects[i], true)
            if (intersections.length > 0) {
                this.interactive_objects[i].look_at()
            }
        }
    },

    on_key_press: function(event) {

        //console.log(event)
        var i;

        if (event.keyCode == 220) { // backslash
            if (this.player.is_engaged()) {
                this.player.disengage()
                for (i = 0; i < this.interactive_objects.length; i++) {
                    if (this.interactive_objects[i].being_looked_at) {
                        this.interactive_objects[i].disengage()
                    }
                }
            }
        }

        if (this.username_field.is_engaged()) {
            this.username_field.parse_keycode(event)
        } else if (this.password_field.is_engaged()) {
            this.password_field.parse_keycode(event)
        }

        if (event.keyCode == 69) { // e
            for (i = 0; i < this.interactive_objects.length; i++) {
                this.player.engage()
                if (this.interactive_objects[i].being_looked_at) {
                    this.interactive_objects[i].engage()
                }
            }
        }

    },

    enter_world: function() {
        if (this.player == null) {
            this.set_player_look_at = true
        } else {
            this.player.look_at(new THREE.Vector3(0, 70, 45))
        }
    },

    exit_world: function() {

    }
}