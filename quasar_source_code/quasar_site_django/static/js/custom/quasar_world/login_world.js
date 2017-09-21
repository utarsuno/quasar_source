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
        var plane_material = new THREE.MeshBasicMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
        var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
        this.add_to_scene(plane_mesh)

        // Add lights.
        var color1 = '#b9ffd2'
        var color2 = '#090920'
        var light = new THREE.HemisphereLight(color1, color2, .5)
        this.add_to_scene(light)

        var light3 = new THREE.PointLight(0xccffcc, .8, 0)
        light3.position.set(5, 50, 5)
        this.add_to_scene(light3)

        // Add the text.
        var text_plane = new Floating2DText(200, 50, 'Hello Worlddddddddddd')
        text_plane.create(this.scene)

    },

    add_to_scene: function(object) {
        this.scene.add(object)
    }
}