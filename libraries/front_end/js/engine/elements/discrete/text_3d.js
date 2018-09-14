'use strict';

$_QE.prototype.Text3D = function(size, text, interactive=false) {

    let self        = this;

    this.text_size  = size;
    this._cache_box = new THREE.Box3();

    $_QE.prototype.FloatingElement.call(this);

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_TEXT_CONSTANT, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMaterial.call(this, true, FEATURE_MATERIAL_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT, function() {
        self._cache_box.setFromObject(self.mesh);
        self.width  = self._cache_box.max.x;
        self.height = self._cache_box.max.y;
    });

    //
    $_QE.prototype.FeaturePosition.call(this);
    $_QE.prototype.FeatureNormal.call(this);
    //

    this._on_text_change = function() {
        l('ON TEXT CHANGE EVENT!');

        this.recycle(true, true, false);

        this.recycle_geometry();
        this.recycle_mesh();
        //this.create_material();
        this.create_geometry();
        this.create_mesh();

        if (this._cache_previous_position_center_x != null) {
            this.set_position_center(
                this._cache_previous_position_center_x,
                this._cache_previous_position_center_y,
                this._cache_previous_position_center_z,
                this._cache_previous_position_center_look_at_x,
                this._cache_previous_position_center_look_at_y,
                this._cache_previous_position_center_look_at_z
            );
        }

        this.add_to_world(this.world, false);
        //this.world.add_to_scene(this.mesh);
        //this.world.add_element_root(this);
    };

    this.create = function() {
        this.create_material();
        this.create_geometry();
        this.create_mesh();
    };

    if (!interactive) {
        $_QE.prototype.FeatureText.call(this, text, null, this._on_text_change.bind(this));
    } else {
        $_QE.prototype.FeatureTyping.call(this, text, null, this._on_text_change.bind(this));
        $_QE.prototype.FeatureInteractive.call(this, true);
        $_QE.prototype.FeatureClickable.call(this, true);
    }

};


