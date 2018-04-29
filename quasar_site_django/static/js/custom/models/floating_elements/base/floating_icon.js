'use strict';

function FloatingIcon(world, icon_type, size, foreground_color, cache) {
    this.__init__(world, icon_type, size, foreground_color, cache);
}

FloatingIcon.prototype = {

    __init__: function(world, icon_type, size, foreground_color, cache) {
        // Inherit.
        FloatingElement.call(this, world);

        this.icon_type = icon_type;
        this.width = size;
        this.height = size;

        if (is_defined(foreground_color)) {
            this.set_foreground_color(foreground_color);
        }

        if (is_defined(cache)) {
            this.cached = cache;
        } else {
            this.cached = false;
        }

        this._current_icon = icon_type;

        this.create_base_material();
        this.create_base_mesh();
    },

    switch_icon: function(icon) {
        if (this._current_icon !== icon) {

            if (this.cached) {
                this._material = MANAGER_HEAP.get_spritesheet_shader_material(this.icon_type, this.get_current_foreground_color());
                this._material.needsUpdate = true;
            } else {
                this.material.uniforms['offset'].value = icon;
                this.material.needsUpdate = true;
            }
            
            this._current_icon = icon;
        }
    },

    switch_icon_and_color: function(icon, color) {
        this.switch_icon(icon);
        this.material.uniforms['color'].value = color;
        this.material.needsUpdate = true;
    },

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    create_base_material: function() {
        if (this.cached) {
            this._material = MANAGER_HEAP.get_spritesheet_shader_material(this.icon_type, this.get_current_foreground_color());
        } else {
            this.material = MANAGER_SPRITESHEET.get_icon_material(this.icon_type);
        }
    },

    create_base_mesh: function() {
        let geometry = MANAGER_HEAP.get_plane_geometry(this.width, this.height);
        if (this.cached) {
            this.mesh = new THREE.Mesh(geometry, this._material);
        } else {
            this.mesh = new THREE.Mesh(geometry, this.material);
        }
        this.object3D.add(this.mesh);
    },

    /*__   __        __   __      __   __   ___  __       ___    __        __
     /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    current_foreground_color_changed: function() {
        this.material.uniforms['color'].value = this.current_foreground_color;
        this.material.needsUpdate = true;
    }
};