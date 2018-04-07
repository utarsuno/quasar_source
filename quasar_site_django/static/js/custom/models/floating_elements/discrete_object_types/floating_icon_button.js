'use strict';

function FloatingIconButton(world, icon_type, size, engage_function) {
    this.__init__(world, icon_type, size, engage_function);
}

FloatingIconButton.prototype = {

    __init__: function(world, icon_type, size, engage_function) {
        // Inherit.
        FloatingElement.call(this, world);
        this.set_to_clickable();

        this.set_engage_function(engage_function);

        this.icon_type = icon_type;
        this.width = size;
        this.height = size;

        this.floating_icon = new FloatingIcon(this.world, icon_type, size);
        this.add_floating_element(null, null, 1, this.floating_icon);

        this.create_base_material();
        this.create_base_mesh();
    },

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
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
    state_change_look_at: function(being_looked_at) {
        l('Floating Icon Button being looked at :');
        l(being_looked_at);
        if (being_looked_at) {
            //this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
            MANAGER_RENDERER.outline_glow.set_hover_object(this.object3D);
        } else {
            //this.set_background_color(this.default_background_color, true);
            MANAGER_RENDERER.outline_glow.remove_hover_object(this.object3D);
        }
    }
};
