'use strict'

// A Button3D's width will be w=3h

function Button3D(height, text, scene) {
    this.__init__(height, text, scene)
}

Button3D.prototype = {

    object_3D: null,
    height   : null,
    width    : null,

    floating_text: null,
    text     : null,

    scene    : null,

    __init__: function(height, text, scene) {
        this.scene  = scene
        this.height = height
        this.width  = height * 3
        this.text   = text
        this.object_3D = new THREE.Object3D()


        var geometry = new THREE.BoxGeometry(this.height * 2.5, this.width, 3)
        var material = new THREE.MeshBasicMaterial({color: 0xA8BED7})
        var button = new THREE.Mesh(geometry, material)
        scene.add(button)

        this.object_3D.add(button)

        this.floating_text = new Floating2DText(this.width, this.height, this.text, TYPE_TITLE, this.scene)
    },

    set_position_and_look_at: function(position, look_at) {
        this.object_3D.position.x = position.x
        this.object_3D.position.y = position.y
        this.object_3D.position.z = position.z
        this.object_3D.look_at(look_at)
        this.floating_text.update_position_and_look_at(position, look_at)
    }


}
