'use strict'

function LoginWorld() {
    this.__init__()
}

LoginWorld.prototype = {

    scene: null,

    __init__: function() {
        // Create the scene.
        this.scene = new THREE.Scene()

        // Going to try to create a plane here.
        var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
        plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
        //var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
        var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: false})
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
        var look_at_vector = new THREE.Vector3(0, 50, 0)
        var look_at_vector2 = new THREE.Vector3(0, 20, 0)

        var username_label = new Floating2DText(50, 20, 'Username :')
        username_label.create(this.scene)
        var username_field = new Floating2DText(100, 20, '')
        username_field.create(this.scene)

        var password_label = new Floating2DText(50, 20, 'Password :')
        password_label.create(this.scene)
        var password_field = new Floating2DText(100, 20, '')
        password_field.create(this.scene)

        var username_position0 = new THREE.Vector3(45, 50, 45)
        var username_position1 = new THREE.Vector3(45, 50, 155)

        var password_position0 = new THREE.Vector3(45, 20, 45)
        var password_position1 = new THREE.Vector3(45, 20, 155)

        username_label.update_position_and_look_at(username_position0, look_at_vector)
        username_field.update_position_and_look_at(username_position1, look_at_vector)

        password_label.update_position_and_look_at(password_position0, look_at_vector2)
        password_field.update_position_and_look_at(password_position1, look_at_vector2)
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    }
}