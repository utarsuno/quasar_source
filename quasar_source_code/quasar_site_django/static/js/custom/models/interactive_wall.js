'use strict'

function InteractiveWall(w, h, position, look_at, scene) {
    this.__init__(w, h, position, look_at, scene)
}

InteractiveWall.prototype = {

    width : null,
    height: null,
    position: null,
    look_at : null,
    object_3d: null,
    scene    : null,

    wall: null,

    is_visible: null,

    close_button: null,

    __init__: function(w, h, position, look_at, scene) {
        this.is_visible = true

        this.scene = scene
        this.width = w
        this.height = h
        this.object_3d = new THREE.Object3D()

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height)
        this.object_3d.add(this.wall.mesh)

        // Close button.
        this.close_button = new CheckBox(true, this.scene)
        this.close_button.update_position_and_look_at(position, look_at)


        this.object_3d.position.x = position.x + this.width / 2
        this.object_3d.position.y = position.y
        this.object_3d.position.z = position.z
        this.object_3d.lookAt(new THREE.Vector3(look_at.x + this.width / 2, look_at.y, look_at.z))

        this.scene.add(this.object_3d)
    },

    toggle_visibility: function() {
        this.is_visible = !this.is_visible
        this.object_3d.visible = this.is_visible
    }
}