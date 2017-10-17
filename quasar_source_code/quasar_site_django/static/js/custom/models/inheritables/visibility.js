'use strict'

function Visibility() {

    // States.
    this.currently_visible = true

    this.is_visible = function() {
        return this.currently_visible
    }

    this.set_to_visible = function() {
        this.currently_visible = true
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = true
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true
            }
        })
    }

    this.set_to_invisible = function() {
        this.currently_visible = false
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false
            }
        })
    }

    this.toggle_visiblity = function() {
        this.currently_visible = !this.currently_visible
        var local_is_visible = this.currently_visible
        this.object3D.visible = local_is_visible
        this.object3D.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = local_is_visible
            }
        })
    }
}
