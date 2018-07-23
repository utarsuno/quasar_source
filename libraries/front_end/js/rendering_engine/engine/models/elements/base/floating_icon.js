'use strict';

$_QE.prototype.FloatingIcon = function(world, icon_type, size, foreground_color) {
    if (is_defined(foreground_color)) {
        $_QE.prototype.FeatureColor.call(this, foreground_color, FLOATING_TEXT_BACKGROUND_TRANSPARENT);
    } else {
        $_QE.prototype.FeatureColor.call(this, COLOR_GREEN, FLOATING_TEXT_BACKGROUND_TRANSPARENT);
    }

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.FeatureSize.call(this, size, size);

    $_QE.prototype.FeatureMaterial.call(this, true, FEATURE_MATERIAL_TYPE_ICON);
    $_QE.prototype.FeatureGeometry.call(this, true, FEATURE_GEOMETRY_TYPE_PLANE);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT);

    this.icon_type = icon_type;

    this.switch_icon = function(icon) {
        if (this.icon_type !== icon) {
            this.material.uniforms['offset'].value = icon;
            this.material.needsUpdate = true;
            this.icon_type = icon;
        }
    };

    this.switch_icon_and_color = function(icon, color) {
        this.material.uniforms['color'].value = color;
        this.material.needsUpdate = true;
        this.switch_icon(icon);
    };

    //////////////

    this.create_icon = function() {
        this.create_material();
        this.create_geometry();
        this.create_mesh();
    };

    /*__   __        __   __      __   __   ___  __       ___    __        __
     /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.current_foreground_color_changed = function() {
        this.material.uniforms['color'].value = this.current_foreground_color;
        this.material.needsUpdate = true;
    };

};
