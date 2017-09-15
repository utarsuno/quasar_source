'use strict'

function LoginPanel() {
    this.__init__()
}

LoginPanel.prototype = {

    background_plane: null,
    position        : null,
    rotation        : null,

    __init__: function() {

        this.position = new THREE.Vector3(50, 50, 50)
        this.rotation = new THREE.Vector3(0, Math.PI / 2.0, 0)

        this.background_plane = new PlaneAPI(10, 10, this.position, this.rotation)
    },

    set_position: function(x, y, z) {
        this.background_plane.position.x = x
        this.background_plane.position.y = y
        this.background_plane.position.z = z
    },

    set_rotation: function(x, y, z) {
        this.rotation.x = x
        this.rotation.y = y
        this.rotation.z = z
    },

    add_objects_to_scene: function(scene) {
        this.background_plane.create_standard(scene)
    }
}