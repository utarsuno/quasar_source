'use strict';

function FloatingCheckBox(world, size, checked) {
    this.__init__(world, size, checked);
}

FloatingCheckBox.prototype = {

    __init__: function(world, size, checked) {
        // Inherit.
        FloatingElement.call(this, world);

        this.checked = checked;
        if (!is_defined(this.checked)) {
            this.checked = false;
        }

        this.width = size;
        this.height = size;

        this.world.interactive_objects.push(this);
        //this.engable = false;
        this.maintain_engage_when_tabbed_to = false;

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
    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            //this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
            MANAGER_RENDERER.outline_glow.set_hover_object(this.object3D);
        } else {
            //this.set_background_color(this.default_background_color, true);
            MANAGER_RENDERER.outline_glow.remove_hover_object(this.object3D);
        }
    },

    // TODO : Reformat engage / disengage logic.
    state_change_engage: function(being_engaged_with) {
        l('CHECKBOX ENGAGE CHANGE TO : {' + being_engaged_with + '}');
        if (being_engaged_with) {
            //CURRENT_PLAYER.set_state(PLAYER_STATE_ENGAGED);
            MANAGER_RENDERER.outline_glow.set_to_engage_color();
        } else {
            MANAGER_RENDERER.outline_glow.set_to_hover_color();
        }
        //this.color_changed = true;
        //this.refresh();
    }

};
