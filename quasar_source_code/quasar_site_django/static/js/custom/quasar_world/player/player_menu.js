'use strict';

const SPACE_BETWEEN_MENU_ICONS = 20;
const ONE_SECOND = 1.0;
const ANIMATION_TIME = ONE_SECOND / 4;
const MENU_DISTANCE_FROM_PLAYER = 150;

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

                var icon_label = '';
                switch (icon_type) {
                case ICON_SAVE:
                    icon_label = 'save';
                    break;
                case ICON_EXIT:
                    icon_label = 'exit';
                    break;
                case ICON_MULTIPLAYER:
                    icon_label = 'online';
                    break;
                case ICON_HOME:
                    icon_label = 'home';
                    break;
                case ICON_SETTINGS:
                    icon_label = 'settings';
                    break;
                case ICON_ENTITY_GROUP:
                    icon_label = 'entities';
                    break;
                }
                this.floating_label = new Floating2DText(80, icon_label, TYPE_BUTTON, this.world.scene);

                this.object3D.add(this.icon);

                this.world.add_to_scene(this.object3D);

                this.world.interactive_objects.push(this.icon);
                this.world.interactive_objects.push(this.floating_label);
            }
        }
    },

    set_position_and_normal: function(position, nx, nz) {
        this.y_position = position.y + SPACE_BETWEEN_MENU_ICONS * 2;
        this.object3D.position.set(position.x, this.y_position, position.z);
        this.object3D.lookAt(new THREE.Vector3(position.x + nx * 5, this.y_position, position.z + nz * 5));

        this.normal = new THREE.Vector3(nx, 0, nz);
        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        var horizontal_shift = 50;

        this.floating_label.update_position_and_normal(new THREE.Vector3(this.object3D.position.x + this.left_right.x * horizontal_shift, this.object3D.position.y, this.object3D.position.z + this.left_right.z * horizontal_shift), this.normal);
    },

    update_y_position: function(y_offset) {
        this.object3D.position.y = this.y_position - y_offset;
        this.floating_label.object3D.position.y = this.y_position - y_offset;
    },

    set_to_invisible: function() {
        this.icon.visible = false;
        this.floating_label.set_to_invisible();
    },

    set_to_visible: function() {
        this.icon.visible = true;
        this.floating_label.set_to_visible();
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
        for (var i = 0; i < this.icons.length; i++) {
            this.icons[i].set_to_invisible();
        }
    },

    set_to_visible: function() {
        this.visible = true;
        this.total_delta = 0;

        var pp = CURRENT_PLAYER.get_position();
        var pd = CURRENT_PLAYER.get_direction();

        var start_position = new THREE.Vector3(pp.x + pd.x * MENU_DISTANCE_FROM_PLAYER, pp.y + pd.y * MENU_DISTANCE_FROM_PLAYER, pp.z + pd.z * MENU_DISTANCE_FROM_PLAYER);

        this.icon_create_entity_group.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_save.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_settings.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_home.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_multiplayer.set_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_log_out.set_position_and_normal(start_position, -pd.x, -pd.z);

        for (var i = 0; i < this.icons.length; i++) {
            this.icons[i].set_to_visible();
        }
    },

    is_visible: function() {
        return this.visible;
    },

    update: function(delta) {
        this.total_delta += delta;
        if (this.total_delta >= ANIMATION_TIME) {
            this.percentage = 1.0;
        } else {
            this.percentage = this.total_delta / ANIMATION_TIME;
        }

        for (var i = 0; i < this.icons.length; i++) {
            if (this.icons[i].row !== 0) {
                var this_icons_max_delta = this.time_needed_for_each_row * this.icons[i].row;
                if (this.percentage < this_icons_max_delta) {
                    this.icons[i].update_y_position(this.percentage * this.total_distance);
                } else {
                    this.icons[i].update_y_position(this_icons_max_delta * this.total_distance);
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
