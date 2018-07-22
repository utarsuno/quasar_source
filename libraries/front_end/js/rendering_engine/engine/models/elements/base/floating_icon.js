'use strict';

$_QE.prototype.FloatingIcon = function(world, icon_type, size, foreground_color) {

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.FeatureSize.call(this, size, size);

    if (is_defined(foreground_color)) {
        this.set_foreground_color(foreground_color);
    }

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

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.create_base_material = function() {
        this.material = QE.manager_icons.get_icon_material(this.icon_type);
    };

    this.create_base_mesh = function() {
        let geometry = QE.manager_heap.get_plane_geometry(this.width, this.height);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.object3D.add(this.mesh);
    };

    /*__   __        __   __      __   __   ___  __       ___    __        __
     /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.current_foreground_color_changed = function() {
        this.material.uniforms['color'].value = this.current_foreground_color;
        this.material.needsUpdate = true;
    };

    //////////////

    this.create_icon = function() {
        this.create_base_material();
        this.create_base_mesh();
    };

};
