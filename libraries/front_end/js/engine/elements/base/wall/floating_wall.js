'use strict';

$_QE.prototype.WallFloating = function() {};

Object.assign(
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.WallAbstraction.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.FeatureGeometry.prototype,
    $_QE.prototype.FeatureMaterial.prototype,
    $_QE.prototype.FeatureMesh.prototype,
    {
        add_title_bar: function(title, icon) {
            this.title_bar = new $_QE.prototype.FeatureTitleBar(this);
            this.title_bar.add_button_close();
            this.title_bar.add_button_settings();
            this.title_bar.add_button_help();
            this.title_bar.add_icon(icon);
            this.title_bar.add_title(title, false);
        },

        create_wall_mesh: function() {
            this.set_geometry_type(false, FEATURE_GEOMETRY_TYPE_PLANE);
            this.set_material_type(false, FEATURE_MATERIAL_CANVAS_FANCY);
            this.set_mesh_type(false, FEATURE_MESH_TYPE_DEFAULT);
            this.create_material();
            this.create_geometry();
            this.create_mesh();
        },
    }

);


