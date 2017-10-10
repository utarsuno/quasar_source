'use strict'

function InteractiveWall(w, h, position, look_at, scene) {
    this.__init__(w, h, position, look_at, scene)
}

// TODO : NOTE : Only works in a single orientation. At some point this class will go through heavy refactoring.
InteractiveWall.prototype = {

    width : null,
    height: null,
    position: null,
    look_at : null,
    object3D: null,
    scene    : null,

    wall: null,

    is_visible: null,

    close_button: null,

    __init__: function(w, h, position, look_at, scene) {
        this.is_visible = true

        this.scene = scene
        this.width = w
        this.height = h
        this.object3D = new THREE.Object3D()

        // Base wall.
        this.wall = new PlaneAPI(this.width, this.height)
        this.object3D.add(this.wall.mesh)

        // Close button.
        this.close_button = new CheckBox(true, this.scene)
        var close_button_position = new THREE.Vector3(position.x + this.width - this.close_button.width, position.y + this.height / 2 - this.close_button.height / 2, position.z + 1)
        var close_button_look_at = new THREE.Vector3(look_at.x + this.width - this.close_button.width, look_at.y + this.height / 2 - this.close_button.height / 2, look_at.z)
        this.close_button.update_position_and_look_at(close_button_position, close_button_look_at)

        this.object3D.add(this.close_button.floating_2d_text.object3D)

        this.object3D.position.x = position.x + this.width / 2
        this.object3D.position.y = position.y
        this.object3D.position.z = position.z
        this.object3D.lookAt(new THREE.Vector3(look_at.x + this.width / 2, look_at.y, look_at.z))

        this.scene.add(this.object3D)
    },

    set_to_invisible: function() {
        this.is_visible = false
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false
        this.object3D.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false
            }
        })
    },

    toggle_visibility: function() {
        this.is_visible = !this.is_visible
        var local_is_visible = this.is_visible
        this.object3D.visible = this.is_visible
        this.object3D.traverse ( function (child) {
            if (child instanceof THREE.Mesh) {
                child.visible = local_is_visible
            }
        })
    },

    get_all_interactive_objects: function() {
        var list_of_interactive_objects = []
        list_of_interactive_objects.push(this.close_button.floating_2d_text)
        return list_of_interactive_objects
    }
}