'use strict';

$_QE.prototype.Text3D = function(world, size, text) {

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.TextAbstraction.call(this, text);

    // Heap optimization.
    this._box = new THREE.Box3();

    this.text_size = size;

    this.refresh = function() {
        this.delete_mesh();
        this.create_base_mesh();
    };

    this.create_base_material = function() {
        this._material = MANAGER_HEAP.get_text_3D_material(this.current_foreground_color);
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.TextGeometry(this.text, {
            size: this.text_size,
            height: 2,
            curveSegments: 2,
            font: GLOBAL_FONT
        });
        this.mesh = new THREE.Mesh(this.geometry, this._material);
        this._calculate_dimensions();
        this.object3D.add(this.mesh);
    };

    this._calculate_dimensions = function() {
        this._box.setFromObject(this.mesh);
        this.width = this._box.max.x;
        this.height = this._box.max.y;
    };
};
