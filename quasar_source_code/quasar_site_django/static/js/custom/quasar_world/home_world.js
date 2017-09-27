'use strict'

function HomeWorld() {
    this.__init__()
}

HomeWorld.prototype = {
    scene: null,
    player: null,

    hello_message: null,

    got_camera: null,

    __init__: function() {

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


        this.ajax_status = new Floating2DText(400, 30, '', TYPE_TITLE, this.scene)
        this.ajax_status.update_position_and_look_at(new THREE.Vector3(150, 100, 45), new THREE.Vector3(150, 100, 55))
    },

    update: function() {

    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    enter_world: function() {
        if (this.got_camera === false) {
            this.add_to_scene(this.player.fps_controls.get_object())
        }
        if (this.hello_message === null) {
            this.ajax_status.update_text('Welcome back ' + this.player.username)
        }
        this.player.set_position(new THREE.Vector3(130, 90, 300))
    },

    exit_world: function() {
    }
}
