'use strict';

$_QE.prototype.FloatingIcon = function(is_base, icon_type, size, foreground_color) {
    if (foreground_color == null) {
        foreground_color = QE.COLOR_GREEN;
    }
    this.icon_type = icon_type;

    // TODO: set is_base
    this.set_colors(foreground_color, FLOATING_TEXT_BACKGROUND_TRANSPARENT);
    this.set_dimensions(size, size);
    this.set_geometry_type(true, FEATURE_GEOMETRY_TYPE_PLANE);
    this.set_material_type(true, FEATURE_MATERIAL_TYPE_ICON);
    this.set_mesh_type(false, FEATURE_MESH_TYPE_DEFAULT);
};

Object.assign(
    $_QE.prototype.FloatingIcon.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureGeometry.prototype,
    $_QE.prototype.FeatureMaterial.prototype,
    $_QE.prototype.FeatureMesh.prototype,
    {
        create: function() {
            this.create_material();
            this.create_geometry();
            this.create_mesh();
            this.material.uniforms['offset'].value = this.icon_type;
            this.set_event(ELEMENT_EVENT_ON_FOREGROUND_COLOR, this.current_foreground_color_changed.bind(this));
            this.trigger_event(ELEMENT_EVENT_ON_FOREGROUND_COLOR);
        },

        /*__   __        __   __      __   __   ___  __       ___    __        __
         /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
         \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
        current_foreground_color_changed: function() {
            this.material.uniforms['color'].value = this.current_foreground_color;
            this.material.needsUpdate = true;
        },

        switch_icon: function(icon) {
            if (this.icon_type !== icon) {
                this.material.uniforms['offset'].value = icon;
                this.material.needsUpdate = true;
                this.icon_type = icon;
            }
        },

        switch_icon_and_color: function(icon, color) {
            this.material.uniforms['color'].value = color;
            this.material.needsUpdate = true;
            this.switch_icon(icon);
        },
    }
);