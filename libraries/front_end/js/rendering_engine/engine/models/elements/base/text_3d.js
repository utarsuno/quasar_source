'use strict';

$_QE.prototype.Text3D = function(world, size, text) {

    $_QE.prototype.FeatureColor.call(this, COLOR_TEXT_CONSTANT, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.FeatureText.call(this, text);

    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMaterial.call(this, true, FEATURE_MATERIAL_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT);

    // Heap optimization.
    this._box = new THREE.Box3();

    this.text_size = size;

    this.refresh = function() {
        this.recycle_geometry();
        this.recycle_mesh();
        this.create_material();
        this.create_geometry();
        this.create_mesh();
    };

    this.on_mesh_created = function() {
        this._box.setFromObject(this.mesh);
        this.width = this._box.max.x;
        this.height = this._box.max.y;
    };

    // Create the Text3D.
    this.create_material();
    this.create_geometry();
    this.create_mesh();
};
