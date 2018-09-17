'use strict';

$_QE.prototype.Text3D = function(is_base, size, text, interactive=false) {

    let self        = this;

    this.text_size  = size;
    this._cache_box = new THREE.Box3();

    $_QE.prototype.FloatingElement.call(this, is_base);

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_TEXT_CONSTANT, FLOATING_TEXT_BACKGROUND_TRANSPARENT);

    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_TEXT_3D);
    $_QE.prototype.FeatureMaterial.call(this, true, FEATURE_MATERIAL_TYPE_TEXT_3D);

    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT, function() {

        if (self.is_base) {
            self.re_cache_normal();
        }

        if (self.group != null) {
            self._cache_box.setFromObject(self.group);
        } else {
            self._cache_box.setFromObject(self.mesh);
        }

        // TODO: Check if it needs to be absolute left_right
        let left_right = self.get_left_right();
        let up         = self.get_up();

        if (left_right.x != 0) {
            self.width = (self._cache_box.min.x - self._cache_box.max.x) / left_right.x;
        } else {
            self.width = (self._cache_box.min.z - self._cache_box.max.z) / left_right.z;
        }

        self.height = (self._cache_box.max.y - self._cache_box.min.y) / up.y;
    });

    this._on_text_change = function() {
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

        if (this.group == null) {
            this.add_to_world(this.world, false, false, true);
        } else {
            this.add_to_world(this.world, false, false, false);
        }
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


