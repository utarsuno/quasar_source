'use strict';

const COLORS = get_color_range_list(COLOR_FLOATING_WALL_BASE, COLOR_FLOATING_WALL_TOP, 8);

function FloatingWall(width, height, position, normal, world, scalable, default_background_color) {
    this.__init__(width, height, position, normal, world, scalable, default_background_color);
}

FloatingWall.prototype = {

    load_completed: function() {
        this.dimensions_changed();
    },

    __init__: function (width, height, position, normal, world, scalable, default_background_color) {
        // Inherit.
        FloatingWallAbstract.call(this, width, height, position, normal, world);

        this.auto_adjust_height = false;

        this.create_base_mesh();

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.scalable = scalable;
        if (!is_defined(this.scalable)) {
            this.scalable = false;
        }

        this.set_to_interactive();
        this.engable = false;
        if (!this.scalable) {
            this.only_used_for_blocking_input = true;
        }

        if (is_defined(default_background_color)) {
            this.default_background_color = default_background_color;
        } else {
            this.default_background_color = COLOR_FLOATING_WALL_BASE;
        }
        this.set_background_color(this.default_background_color, true);

        // Inherit from Saveable but set to false by default.
        Saveable.call(this, ENTITY_TYPE_WALL, this.load_completed.bind(this));
        this.saveable = false;
        this.add_save_field(ENTITY_PROPERTY_WIDTH);
        this.add_save_field(ENTITY_PROPERTY_HEIGHT);
        this.add_save_field(ENTITY_PROPERTY_POSITION);
        this.add_save_field(ENTITY_PROPERTY_NORMAL);
        this.add_save_field(ENTITY_PROPERTY_IS_ROOT_ATTACHABLE);
        this.add_save_field(ENTITY_PROPERTY_3D_ROWS);
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

    set_auto_adjust_height: function(auto_adjust) {
        this.auto_adjust_height = auto_adjust;
    },

    make_base_wall_invisible: function() {
        this.manual_visibility = true;
        this.object3D.userData.manual_visibility = true;
        this._make_base_wall_visible = false;
        if (is_defined(this.mesh)) {
            this.mesh.userData.manual_visibility = true;
            this.mesh.visible = false;
        }
    },

    make_base_wall_visible: function() {
        this.manual_visibility = true;
        this.object3D.userData.manual_visibility = true;
        this._make_base_wall_visible = true;
        if (is_defined(this.mesh)) {
            this.mesh.userData.manual_visibility = true;
            this.mesh.visible = true;
        }
    },

    create_base_mesh: function() {
        // Check if the there is an existing wall that needs to be fully cleaned up.
        // TODO : Refactor this!!!
        //this.resource_cleanup();

        if (!is_defined(this.material)) {
            this.material = new THREE.MeshBasicMaterial({
                // TODO : THE COLOR IS TEMPORARY!!!
                color: COLORS[0],
                //transparent: true,
                //opacity: 0.85,
                side: THREE.DoubleSide
            });
        }

        // Now re-create the base wall.
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        //if (!this._make_base_wall_visible) {
        //    this.mesh.visible = false;
        //}
        this.object3D.add(this.mesh);
    },

    /*     __   __       ___  ___                         ___  __
     |  | |__) |  \  /\   |  |__     \  /  /\  |    |  | |__  /__`
     \__/ |    |__/ /~~\  |  |___     \/  /~~\ |___ \__/ |___ .__/ */
    set_background_color: function(c) {
        if (is_list(c)) {
            c = c[COLOR_HEX_INDEX];
        }
        //l('Setting floating wall background color to : ' + c);
        this.material.color.setHex(c);
        this.material.needsUpdate = true;
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */

    // TODO : Perhaps add a border glow? Learn the 3rd party line api

    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            this.set_background_color(COLOR_FLOATING_WALL_HIGHLIGHT);
        } else {
            this.set_background_color(this.default_background_color);
        }
    },

    state_change_engage: function(being_engaged_with) {
        l('TODO : Floating wall state engage changed!')
    }

};