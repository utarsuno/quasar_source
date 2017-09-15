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
            this.dynamic_texture.clear().drawText(text, 10, 10, 'black')
            this.current_text = text
            this.dynamic_texture.needsUpdate = true
        }
    },

    create_dynamic_text: function(initial_text, renderer_api) {
        this.is_dynamic_text = true
        if (this.dynamic_texture === null) {
            this.dynamic_texture = new THREEx.DynamicTexture(this.width, this.height)
            this.dynamic_texture.context.font = 'bolder 10px Verdana'
        }
        this.dynamic_texture.texture.anisotropy = renderer_api.renderer.capabilities.getMaxAnisotropy()
        this.update_text(initial_text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        this.material.transparent = true
        this.material.side = THREE.DoubleSide
        this.create_mesh(renderer_api.scene)
    },

    create_mesh: function(scene) {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = this.position.x
        this.mesh.position.y = this.position.y
        this.mesh.position.z = this.position.z
        this.mesh.rotation.x = this.rotation.x
        this.mesh.rotation.y = this.rotation.y
        this.mesh.rotation.z = this.rotation.z
        this.position = this.mesh.position
        this.rotation = this.mesh.rotation

        var geo = new THREE.EdgesGeometry( this.mesh.geometry ) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xFFC0CB, linewidth: 2 } )
        var wireframe = new THREE.LineSegments( geo, mat )
        this.mesh.add( wireframe )

        scene.add(this.mesh)
    }

}

