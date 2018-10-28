'use strict';

$_QE.prototype.WallFloating = function() {};

Object.assign(
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.WallAbstraction.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.FeatureColor.prototype,
    {
        create_row: function(y_offset, add_raw, row_height=null) {
            let r = new $_QE.prototype.FeatureRow();
            if (this.height == null || this.height == 0 || isNaN(this.height)) {
                l('ERROR. HEIGHT IS BAD!!');
            }
            if (row_height == null) {
                r.create_row(this, this.height, y_offset, add_raw);
            } else {
                r.create_row(this, row_height, y_offset, add_raw);
            }
            return r;
        },

        add_title_bar: function(title, icon=null, use_close=true, use_settings=true, use_help=true) {
            this.title_bar = new $_QE.prototype.FeatureTitleBar(this);
            if (use_close) {
                this.title_bar.add_button_close();
            }
            if (use_settings) {
                this.title_bar.add_button_settings();
            }
            if (use_help) {
                this.title_bar.add_button_help();
            }
            if (icon != null) {
                this.title_bar.add_icon(icon);
            }
            this.title_bar.add_title(title, false);
        },

        create_wall_mesh: function(material_type) {
            this.set_geometry_type(false, FEATURE_GEOMETRY_TYPE_PLANE);
            this.set_material_type(false, material_type);
            this.set_mesh_type(false, FEATURE_MESH_TYPE_DEFAULT);
            this.create_material();
            this.create_geometry();
            this.create_mesh();
        },
    }

);

/*
FloatingWall.prototype = {

    __init__: function (width, height, position, normal, world, scalable, default_background_color) {

        // Inherit from Saveable but set to false by default.
        Saveable.call(this, ENTITY_TYPE_WALL, this.load_completed.bind(this));
        this.saveable = false;
        this.add_save_field(ENTITY_PROPERTY_WIDTH);
        this.add_save_field(ENTITY_PROPERTY_HEIGHT);
        this.add_save_field(ENTITY_PROPERTY_POSITION);
        this.add_save_field(ENTITY_PROPERTY_NORMAL);
        this.add_save_field(ENTITY_PROPERTY_IS_ROOT_ATTACHABLE);
        this.add_save_field(ENTITY_PROPERTY_3D_ROWS);

        return this;
    },

    auto_adjust_height_if_needed: function() {
        if (this.auto_adjust_height) {
            let height_needed = (this._get_max_row_number() + 1) * 16;
            if (this.height !== height_needed) {
                this.set_new_height(height_needed);
                this.refresh_position_and_look_at();
            }
        }
    },

};
 */

