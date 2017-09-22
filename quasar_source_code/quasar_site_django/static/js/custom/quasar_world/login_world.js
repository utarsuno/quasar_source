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

        // Add the text.

        this.username_label = new Floating2DText(50, 20, 'Username :')
        this.username_label.create(this.scene)
        this.username_field = new Floating2DText(100, 20, '')
        this.username_field.create(this.scene)

        this.password_label = new Floating2DText(50, 20, 'Password :')
        this.password_label.create(this.scene)
        this.password_field = new Floating2DText(100, 20, '')
        this.password_field.create(this.scene)

        var username_position0 = new THREE.Vector3(0, 70, 45)
        var username_position1 = new THREE.Vector3(75, 70, 45)

        var password_position0 = new THREE.Vector3(0, 40, 45)
        var password_position1 = new THREE.Vector3(75, 40, 45)

        this.username_label.update_position_and_look_at(username_position0, new THREE.Vector3(0, 70, 55))
        this.username_field.update_position_and_look_at(username_position1, new THREE.Vector3(75, 70, 55))

        this.password_label.update_position_and_look_at(password_position0, new THREE.Vector3(0, 40, 55))
        this.password_field.update_position_and_look_at(password_position1, new THREE.Vector3(75, 40, 55))


        // Handle key press events.
        document.addEventListener('keypress', this.on_key_press.bind(this), false)
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    update: function() {
        var position = this.player.fps_controls.get_position()
        var direction = this.player.fps_controls.get_direction()

        var raycaster = new THREE.Raycaster(position, direction)

        /*
        var intersects = raycaster.intersectObjects(this.scene.children)
        if (intersects.length > 1) {
            console.log('There are ' + intersects.length + ' intersections!')
        }*/

        this.username_field.active = false
        this.password_field.active = false

        var aa = raycaster.intersectObject(this.username_label.object3d, true)
        if (aa.length > 0) {
            //console.log(aa)
        }

        var bb = raycaster.intersectObject(this.username_field.object3d, true)
        if (bb.length > 0) {
            //console.log(bb)
            this.username_field.active = true
        }

        var cc = raycaster.intersectObject(this.password_label.object3d, true)
        if (cc.length > 0) {
            //console.log(cc)
        }

        var dd = raycaster.intersectObject(this.password_field.object3d, true)
        if (dd.length > 0) {
            //console.log(dd)
            this.password_field.active = true
        }
        //for (var i = 0; i < intersects.length; i++) {
        //    console.log(intersects[i])
        //}
    },

    on_key_press: function(event) {
        var keycode = event.keyCode

        var valid = (keycode > 47 && keycode < 58) || // number keys
        keycode == 32                    || // spacebar
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223)   // [\]' (in order)

        if (valid) {

            var chrCode = keycode - 48 * Math.floor(keycode / 48)
            var chr = String.fromCharCode((96 <= keycode) ? chrCode: keycode)

            if (this.username_field.active) {
                this.username_field.add_character(chr)
            } else if (this.password_field.active) {
                this.password_field.add_character(chr)
            }
        }
    },

    enter_world: function() {
        this.player.look_at(new THREE.Vector3(0, 70, 45))
    },

    exit_world: function() {

    }
}