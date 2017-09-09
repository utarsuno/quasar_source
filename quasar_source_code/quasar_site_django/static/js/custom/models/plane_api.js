'use strict'

function PlaneAPI(w, h, p, r) {
    this.__init__(w, h, p, r)
}

PlaneAPI.prototype = {
    width    : null,
    height   : null,
    position : null,
    rotation : null,

    mesh     : null,
    geometry : null,

    dynamic_texture: null,
    material : null,

    is_dynamic_text: null,

    current_text: null,
    
    __init__: function(w, h, p, r) {
        this.width    = w
        this.height   = h
        this.position = p
        this.rotation = r

        this.geometry = new THREE.PlaneGeometry(this.width, this.height, 10, 10)
    },

    create_standard: function(scene) {
        this.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.5,
            side: THREE.DoubleSide
        })
        this.create_mesh(scene)
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            this.dynamic_texture.clear('transparent').drawText(text, 5, 5, 'black')
            this.current_text = text
            this.dynamic_texture.needsUpdate = true
        }
    },

    create_dynamic_text: function(initial_text, scene) {
        this.is_dynamic_text = true
        if (this.dynamic_texture === null) {
            this.dynamic_texture = new THREEx.DynamicTexture(this.width, this.height)
            this.dynamic_texture.context.font = 'bolder 10px Verdana'
        }
        //dynamic_texture.texture.anisotropy = this.renderer.getMaxAnisotropy()
        this.update_text(initial_text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        this.create_mesh(scene)
    },

    create_mesh: function(scene) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = this.position.x
        this.mesh.position.y = this.position.y
        this.mesh.position.z = this.position.z
        this.mesh.rotation.x = this.rotation.x
        this.mesh.rotation.y = this.rotation.y
        this.mesh.rotation.z = this.rotation.z
        scene.add(this.mesh)
    }

}

