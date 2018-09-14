'use strict';

$_QE.prototype.Text3D = function(create_element, size, text, interactive=false) {

    let me          = this;

    this.text_size  = size;
    this._cache_box = new THREE.Box3();

    $_QE.prototype.FloatingElement.call(this);

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_TEXT_CONSTANT, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMaterial.call(this, true, FEATURE_MATERIAL_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT, function() {
        me._cache_box.setFromObject(me.mesh);
        me.width  = me._cache_box.max.x;
        me.height = me._cache_box.max.y;
    });

    //
    $_QE.prototype.FeaturePosition.call(this);
    $_QE.prototype.FeatureNormal.call(this);
    //

    this.create = function() {
        this.create_material();
        this.create_geometry();
        this.create_mesh();
    };

    if (!interactive) {
        $_QE.prototype.FeatureText.call(this, text);
    }

    if (create_element) {
        this.create();
    }
};


