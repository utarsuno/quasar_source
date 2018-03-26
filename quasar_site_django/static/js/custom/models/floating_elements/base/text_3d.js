'use strict';

function Text3D(world, size, text) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.text_size = size;

    this.refresh = function() {
        this.delete_mesh();
        this.create_base_mesh();
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshLambertMaterial({color: this.current_foreground_color});
        this.material.side = THREE.FrontSide;
        this.material.needsUpdate = true;
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.TextGeometry(this.text, {
            size: this.text_size,
            height: 1,
            curveSegments: 2,
            font: GLOBAL_FONT
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this._calculate_dimensions();
        this.object3D.add(this.mesh);
    };

    this._calculate_dimensions = function() {
        var box = new THREE.Box3().setFromObject(this.mesh);
        this.width = box.max.x;
        this.height = box.max.y;
    };

}