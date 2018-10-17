'use strict';

$_QE.prototype.WallFloating = function(is_base, width, height) {

    $_QE.prototype.WallAbstraction.call(this, is_base, width, height);

    this.set_geometry_type(false, FEATURE_GEOMETRY_TYPE_PLANE);
    this.set_material_type(false, FEATURE_MATERIAL_CANVAS_FANCY);
    this.set_mesh_type(false, FEATURE_MESH_TYPE_DEFAULT);

    this.create_wall_mesh = function() {
        this.create_material();
        this.create_geometry();
        this.create_mesh();
    };

    this.add_title_bar = function(title, icon) {
        $_QE.prototype.FeatureTitleBar.call(this, this);
        this.add_button_close();
        this.add_button_settings();
        this.add_button_help();
        this.add_icon(icon);
        this.add_title(title, false, 0.0, false);
    };

};

Object.assign(
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.FeatureGeometry.prototype,
    $_QE.prototype.FeatureMaterial.prototype,
    $_QE.prototype.FeatureMesh.prototype,

);