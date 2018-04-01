'use strict';

function FloatingCheckBox(world, size, checked, on_checked_function) {
    this.__init__(world, size, checked, on_checked_function);
}

FloatingCheckBox.prototype = {

    __init__: function(world, size, checked, on_checked_function) {
        // Inherit.
        FloatingElement.call(this, world);
        this.set_to_clickable();

        this.checked = checked;
        if (!is_defined(this.checked)) {
            this.checked = false;
        }

        this.on_checked_function = on_checked_function;

        this.width = size;
        this.height = size;

        this.icon_checked = new FloatingIcon(this.world, ICON_CHECKMARK, size);
        this.icon_checked.set_current_foreground_color(COLOR_GREEN, true);
        this.icon_not_checked = new FloatingIcon(this.world, ICON_CROSS, size);
        this.icon_not_checked.set_current_foreground_color(COLOR_RED, true);

        this.create_base_material();
        this.create_base_mesh();

        this.add_floating_element(null, null, 1, this.icon_checked);
        this.add_floating_element(null, null, 1, this.icon_not_checked);

        if (this.checked) {
            this.icon_not_checked.set_to_invisible();
        } else {
            this.icon_checked.set_to_invisible();
        }
        this.set_engage_function(this.clicked_on.bind(this));
    },

    create_base_material: function() {
        this.material = new THREE.MeshBasicMaterial({opacity: 0.01, transparent: true, side: THREE.FrontSide});
    },

    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    set_checked_state: function(is_checked) {
        if (is_checked) {
            this.icon_checked.set_to_visible();
            this.icon_not_checked.set_to_invisible();
            this.checked = true;
        } else {
            this.icon_checked.set_to_invisible();
            this.icon_not_checked.set_to_visible();
            this.checked = false;
        }
    },

    clicked_on: function() {
        if (this.checked) {
            this.set_checked_state(false);
        } else {
            this.set_checked_state(true);
        }
        if (is_defined(this.on_checked_function)) {
            this.on_checked_function(this.checked);
        }
    },

    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            //this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
            MANAGER_RENDERER.outline_glow.set_hover_object(this.object3D);
        } else {
            //this.set_background_color(this.default_background_color, true);
            MANAGER_RENDERER.outline_glow.remove_hover_object(this.object3D);
        }
    }
};
