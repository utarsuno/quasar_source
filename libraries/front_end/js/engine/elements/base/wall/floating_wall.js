'use strict';

$_QE.prototype.WallFloating = function(is_base, width, height) {

    $_QE.prototype.WallAbstraction.call(this, is_base, width, height);

    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_PLANE);
    $_QE.prototype.FeatureMaterial.call(this, false, FEATURE_MATERIAL_CANVAS_FANCY);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT);

    // TODO: linked list of rows.

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
        //this.add_row(this);
    };


};
