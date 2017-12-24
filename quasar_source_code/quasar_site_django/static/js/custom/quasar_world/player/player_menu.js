'use strict';

const SPACE_BETWEEN_MENU_ICONS = 20;
const ONE_SECOND = 1.0;

function PlayerMenu(world) {
    this.__init__(world);
}

function MenuIcon(icon_type, world, row) {
    this.__init__(icon_type, world, row);
}

MenuIcon.prototype = {
    __init__: function(icon_type, world, row) {
        this.world = world;
        this.row = row;
        this.object3D = new THREE.Object3D();


        for (var i = 0; i < MANAGER_WORLD.icon_textures.length; i++) {
            if (MANAGER_WORLD.icon_textures[i][1].includes(icon_type)) {
                this.geometry = new THREE.CircleGeometry(10, 32);
                // TODO : Eventually just do FrontSide
                // TODO : Eventually add some transparency.
                this.material = new THREE.MeshBasicMaterial({map: MANAGER_WORLD.icon_textures[i][0], side: THREE.DoubleSide, transparent: true, opacity: .75});
                //var cursor_material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: CURSOR_DEFAULT_OPACITY});
                this.icon = new THREE.Mesh(this.geometry, this.material);

                this.object3D.add(this.icon);

                this.world.add_to_scene(this.object3D);
            }
        }
    },

    set_position_and_normal: function(position, nx, nz) {
        this.y_position = position.y - (this.row - 1) * SPACE_BETWEEN_MENU_ICONS;
        this.object3D.position.set(position.x, this.y_position, position.z);
        this.object3D.lookAt(new THREE.Vector3(position.x + nx * 5, position.y - (this.row - 1) * SPACE_BETWEEN_MENU_ICONS, position.z + nz * 5));
    },

    update_y_position: function(y_offset) {
        this.object3D.position.y = this.y_position - y_offset;
    }
};

PlayerMenu.prototype = {

    world: null,

    __init__: function(world) {
        this.world = world;

        this.visible = false;
        this.total_delta = 0;

        this.time_needed_for_each_row = ONE_SECOND / 5;
        this.total_distance = 5 * SPACE_BETWEEN_MENU_ICONS;
    },

    set_to_invisible: function() {
        this.visible = false;
    },

    set_to_visible: function() {
        this.visible = true;
        this.total_delta = 0;

        var pp = CURRENT_PLAYER.get_position();
        var pd = CURRENT_PLAYER.get_direction();

        var start_position = new THREE.Vector3(pp.x + pd.x * 100, pp.y + pd.y * 100, pp.z + pd.z * 100);

        this.icon_create_entity_group.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_save.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_settings.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_home.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_multiplayer.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_log_out.set_position_and_normal(start_position, -pd.x, -pd.z);
    },

    is_visible: function() {
        return this.visible;
    },

    update: function(delta) {
        this.total_delta += delta;
        if (this.total_delta >= 1.0) {
            this.percentage = 1.0;
        } else {
            this.percentage = this.total_delta / 1.0;
        }

        for (var i = 0; i < this.icons.length; i++) {
            if (this.icons[i].row !== 0) {
                var this_icons_max_delta = this.time_needed_for_each_row * this.icons[i].row;
                if (this.percentage < this_icons_max_delta) {
                    this.icons[i].update_y_position(this.percentage * this.total_distance);
                }
            }
        }
    },

    // This function gets called once per player menu object.
    load_icon_textures: function() {
        this.icon_create_entity_group = new MenuIcon(ICON_ENTITY_GROUP, this.world, 0);
        this.icon_save = new MenuIcon(ICON_SAVE, this.world, 1);
        this.icon_settings = new MenuIcon(ICON_SETTINGS, this.world, 2);
        this.icon_home = new MenuIcon(ICON_HOME, this.world, 3);
        this.icon_multiplayer = new MenuIcon(ICON_MULTIPLAYER, this.world, 4);
        this.icon_log_out = new MenuIcon(ICON_EXIT, this.world, 5);

        this.icons = [this.icon_create_entity_group, this.icon_save, this.icon_settings, this.icon_home, this.icon_multiplayer, this.icon_log_out];
    }

};
