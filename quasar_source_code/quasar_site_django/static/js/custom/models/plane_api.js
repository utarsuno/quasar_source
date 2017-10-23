'use strict'

function PlaneAPI(w, h) {
    this.__init__(w, h)
}

PlaneAPI.prototype = {
    width    : null,
    height   : null,

    mesh     : null,
    geometry : null,
    material : null,

    scene: null,
    
    __init__: function(w, h) {
        this.width    = w
        this.height   = h
        //this.scene    = scene

        //this.object3d = new THREE.Object3D()
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)

        //this.object3d.add(this.geometry.mesh)

        //this.create(this.scene)
        this.create()
    },

    create: function() {
        this.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.85,
            side: THREE.FrontSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        var geo = new THREE.EdgesGeometry(this.mesh.geometry) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial({color: 0xFFC0CB, linewidth: 2})
        var wireframe = new THREE.LineSegments(geo, mat)
        this.mesh.add(wireframe)

        //scene.add(this.object3d)
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3D.position.x = position_vector.x
        this.object3D.position.y = position_vector.y
        this.object3D.position.z = position_vector.z
        this.object3D.lookAt(look_at_position)
    }

}

