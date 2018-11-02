'use strict';

$_QE.prototype.Text3D = function(size, text, interactive=false) {
    this.text            = text;
    this.text_size       = size;
    this.initialize_floating_element_data();
    this.set_foreground_color(QE.COLOR_TEAL_LIGHT);
    this.set_dimensions(0, 0);
    this.set_geometry_type(false, FEATURE_GEOMETRY_TYPE_TEXT_3D);
    this.set_material_type(true, FEATURE_MATERIAL_TYPE_TEXT_3D);
    this.set_mesh_type(false, FEATURE_MESH_TYPE_DEFAULT, this._calculate_dimensions.bind(this));

    if (interactive) {
        $_QE.prototype.FeatureTyping.call(this);
    }
    this.set_value_post_changed_event(this._on_text_change.bind(this));
};


Object.assign(
    $_QE.prototype.Text3D.prototype,
    $_QE.prototype.FeatureText.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureColor.prototype,
    {
        constructor: $_QE.prototype.Text3D,

        _calculate_dimensions: function() {
            if (this._cache_box == null) {
                this._cache_box               = new THREE.Box3();
                this._cache_text3d_left_right = new THREE.Vector3();
                this._cache_text3d_up         = new THREE.Vector3();
            }

            if (!this.is_relative()) {
                this.re_cache_normal();
            }

            this._cache_box.setFromObject(this.get_object());

            // TODO: Most likely remove this if statement. It's only covering the side affect of a bug.
            if ((this.attachment_parent != null && this.attachment_parent.get_normal().equals(QE.CACHE_ZERO_VECTOR)) || this.get_left_right() == null) {
                this._cache_text3d_left_right.set(-1, 0, 0);
                this._cache_text3d_up.set(0, 1, 0);
                this.width  = (this._cache_box.min.x - this._cache_box.max.x) / this._cache_text3d_left_right.x;
                this.height = (this._cache_box.max.y - this._cache_box.min.y) / this._cache_text3d_up.y;
            } else {
                this._cache_text3d_left_right = this.get_left_right();
                this._cache_text3d_up         = this.get_up();

                if (this._cache_text3d_left_right.x != 0) {
                    this.width = (this._cache_box.min.x - this._cache_box.max.x) / this._cache_text3d_left_right.x;
                } else {
                    this.width = (this._cache_box.min.z - this._cache_box.max.z) / this._cache_text3d_left_right.z;
                }
                this.height = (this._cache_box.max.y - this._cache_box.min.y) / this._cache_text3d_up.y;
            }
        },

        _on_text_change: function() {
            let world   = this.world;
            let look_at = false;
            let engaged = false;
            if (this.get_flag(EFLAG_ENGAGED)) {
                engaged = true;
                this.world.disengage_from_currently_looked_at_object();
            }
            if (this.get_flag(EFLAG_BEING_LOOKED_AT)) {
                look_at = true;
                this.world.look_away_from_currently_looked_at_object();
            }
            if (this.get_flag(EFLAG_IN_WORLD)) {
                this._remove_from_scene();
            }
            this.recycle_geometry();
            this.recycle_mesh();
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
            if (this.get_flag(EFLAG_IN_WORLD)) {
                this._add_to_scene();
            }
            if (look_at) {
                world.set_new_currently_looked_at_object(this);
            }
            if (engaged) {
                world.engage_currently_looked_at_object(this);
            }
        },

        create: function() {
            this.create_material();
            this.create_geometry();
            this.create_mesh();
        },
    }
);
