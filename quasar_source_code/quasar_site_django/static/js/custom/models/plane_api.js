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
    
    __init__: function(w, h, p, r) {
        this.width    = w
        this.height   = h
        this.position = p
        this.rotation = r

        this.geometry = new THREE.PlaneGeometry(this.width, this.height, 10, 10)
    },

    create_standard: function() {
        this.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.5,
            side: THREE.DoubleSide
        })
        this.create_mesh()
    },

    update_text: function(text) {
        this.dynamic_texture.clear().drawText(text, undefined, 256, 'red')
    },

    create_dynamic_text: function(initial_text) {
        this.is_dynamic_text = true
        if (this.dynamic_texture === null) {
            this.dynamic_texture = new THREEx.DynamicTexture(this.width / 2, this.height / 2)
            this.dynamic_texture.context.font = 'bolder 90px Verdana'
        }
        //dynamic_texture.texture.anisotropy = this.renderer.getMaxAnisotropy()
        this.update_text(initial_text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        this.create_mesh()
    },

    create_mesh: function() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
    }

}

