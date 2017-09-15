'use strict'

function LoginPanel() {

}

LoginPanel.prototype = {

    background_plane: null,
    position        : null,
    rotation        : null,

    __init__: function() {

        this.position = new THREE.Vector3(50, 50, 50)
        this.rotation = new THREE.Vector3(0, Math.PI / 2.0, 0)

        this.background_plane = new PlaneAPI(10, 10)
    },

    set_position: function(vector) {
        this.position.x = vector.x
        this.position.y = vector.y
        this.position.z = vector.z
    },

    set_rotation: function(vector) {
        this.rotation.x = vector.x
        this.rotation.y = vector.y
        this.rotation.z = vector.z
    },

    add_objects_to_scene: function(scene) {
        this.background_plane.create_standard(scene)
    }
}