function Floating2DText(w, h, text) {
    this.__init__(w, h, text)
}

Floating2DText.prototype = {
    text: null,
    width: null,
    height: null,
    material: null,
    dynamic_texture: null,

    object3d: null,

    __init__: function(w, h, text) {
        this.width    = w
        this.height   = h

        this.text     = text
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            this.dynamic_texture.clear().drawText(text, 5, 5, 'black')
            this.current_text = text
            this.dynamic_texture.needsUpdate = true
        }
    },

    create: function(scene) {
        this.object3d = new THREE.Object3D()
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)
        this.dynamic_texture = new THREEx.DynamicTexture(this.width, this.height)
        this.dynamic_texture.context.font = 'boldest 8px Verdana'
        this.dynamic_texture.texture.anisotropy = renderer_api.renderer.capabilities.getMaxAnisotropy()
        this.update_text(this.text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        this.material.transparent = true
        // TODO : Make this only 1 sided
        this.material.side = THREE.DoubleSide

        // Adds the edge colorings.
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        var geo = new THREE.EdgesGeometry( this.mesh.geometry ) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xFFC0CB, linewidth: 3 } )
        var wireframe = new THREE.LineSegments( geo, mat )
        this.mesh.add(wireframe)

        this.object3d.add(this.mesh)

        scene.add(this.object3d)
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3d.position.x = position_vector.x
        this.object3d.position.y = position_vector.y
        this.object3d.position.z = position_vector.z
        this.object3d.lookAt(look_at_position)
    }
}