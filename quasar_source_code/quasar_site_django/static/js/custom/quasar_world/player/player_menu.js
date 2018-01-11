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

function global_save() {
    l('PERFORM A GLOBAL SAVE!');

    GUI_TYPING_INTERFACE.add_server_message('Saving changes to the server! TODO : Get a response back!');

    MANAGER_WORLD.world_home.prepare_for_save();

    // Any changes to entities will be saved.
    MANAGER_ENTITY.update_server_and_database();
}

function go_to_settings_world() {
    MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_settings);
}

function go_to_home_world() {
    MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_home);
}

function create_entity_wall() {
    l('Creating entity wall!');
    MANAGER_WORLD.world_home.create_entity_wall_command_entered();
}

function exit_function() {
    if (MANAGER_WORLD.current_world === MANAGER_WORLD.world_login) {
        window.close();
    } else {
        l('TODO : regular log out functionality');
    }
}

function toggle_fullscreen() {
    MANAGER_RENDERER.toggle_fullscreen();
}

MenuIcon.prototype = {
    display_teleport_worlds: function() {
        this.teleport_wall.show();
    },

    hide_teleport_worlds: function() {
        this.teleport_wall.hide();
    },

    select_a_world_to_teleport_to: function() {

    },

    __init__: function(icon_type, world, row) {
        this.world = world;
        this.row = row;
        this.object3D = new THREE.Object3D();


        // width, height, position, normal, world, scalable, color_index


        this.teleport_wall = new FloatingWall(150, 200, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), this.world, false, 0);
        this.teleport_wall.hide();


        this.geometry = new THREE.CircleGeometry(10, 32);
        // TODO : Eventually just do FrontSide
        // TODO : Eventually add some transparency.

        var texture = MANAGER_LOADING.get_texture(TEXTURE_GROUP_ICONS, icon_type);

        this.material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: .75});
        //var cursor_material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: CURSOR_DEFAULT_OPACITY});
        this.icon = new THREE.Mesh(this.geometry, this.material);

        var icon_label = '';
        var function_to_bind = null;
        var function_look_at_bind = null;
        var function_look_away_bind = null;
        switch (icon_type) {
        case ICON_SAVE:
            icon_label = 'save';
            function_to_bind = global_save;
            break;
        case ICON_EXIT:
            icon_label = 'exit';
            l('TODO : Logout');
            break;
        case ICON_MULTIPLAYER:
            icon_label = 'online';
            l('TODO : Go online');
            break;
        case ICON_TELEPORT:
            icon_label = 'teleport';
            function_look_at_bind = this.display_teleport_worlds.bind(this);
            function_look_away_bind = this.hide_teleport_worlds.bind(this);
            function_to_bind = this.select_a_world_to_teleport_to.bind(this);
            break;
        case ICON_HOME:
            icon_label = 'home';
            function_to_bind = go_to_home_world;
            break;
        case ICON_SETTINGS:
            icon_label = 'settings';
            function_to_bind = go_to_settings_world;
            break;
        case ICON_ENTITY_GROUP:
            icon_label = 'entities';
            function_to_bind = create_entity_wall;
            break;
        case ICON_FULLSCREEN:
            icon_label = 'fullscreen';
            function_to_bind = toggle_fullscreen;
            break;
        }
        this.floating_label = new Floating2DText(90, icon_label, TYPE_BUTTON, this.world.scene);
        if (is_defined(function_to_bind)) {
            this.floating_label.set_engage_function(function_to_bind);
        }

        this.object3D.add(this.icon);

        this.world.add_to_scene(this.object3D);

        // Inherit from Interactive.
        //Interactive.call(this);
        // Inherit from Visibility.
        //Visibility.call(this);

        this.world.interactive_objects.push(this.floating_label);
    },

    set_position_and_normal: function(position, nx, nz) {
        this.y_position = position.y + SPACE_BETWEEN_MENU_ICONS * 2;
        this.object3D.position.set(position.x, this.y_position, position.z);
        this.object3D.lookAt(new THREE.Vector3(position.x + nx * 5, this.y_position, position.z + nz * 5));

        this.normal = new THREE.Vector3(nx, 0, nz);
        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        var horizontal_shift = 60;

        this.floating_label.update_position_and_normal(new THREE.Vector3(this.object3D.position.x + this.left_right.x * horizontal_shift, this.object3D.position.y, this.object3D.position.z + this.left_right.z * horizontal_shift), this.normal);

        this.teleport_wall.update_position_and_normal();
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
    },

    set_to_invisible: function() {
        this.visible = false;
        if (is_defined(this.icons)) {
            for (var i = 0; i < this.icons.length; i++) {
                this.icons[i].set_to_invisible();
            }
        }
    },

    set_to_visible: function() {
        if (is_defined(MANAGER_WORLD.current_world.currently_looked_at_object)) {
            return;
        }

        this.visible = true;
        this.total_delta = 0;

        var pp = CURRENT_PLAYER.get_position();
        var pd = CURRENT_PLAYER.get_direction();

        var start_position = new THREE.Vector3(pp.x + pd.x * MENU_DISTANCE_FROM_PLAYER, pp.y + pd.y * MENU_DISTANCE_FROM_PLAYER, pp.z + pd.z * MENU_DISTANCE_FROM_PLAYER);

        for (var i = 0; i < this.icons.length; i++) {
            this.icons[i].set_position_and_normal(start_position, -pd.x, -pd.z);
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


        // TODO : Refactor this!!!!
        if (is_defined(this.icons)) {
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
        }

    },

    // TODO : create this utility function later, especially when there are more icons.
    //_add_menu_icon: function(icon) {
    //},

    // This function gets called once per player menu object.
    load_icon_textures: function(list_of_icons_not_to_load) {

        var current_row = 0;
        this.icons = [];

        if (!list_of_icons_not_to_load.contains(ICON_ENTITY_GROUP)) {
            this.icon_create_entity_group = new MenuIcon(ICON_ENTITY_GROUP, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_create_entity_group);
        }

        if (!list_of_icons_not_to_load.contains(ICON_SAVE)) {
            this.icon_save = new MenuIcon(ICON_SAVE, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_save);
        }

        if (!list_of_icons_not_to_load.contains(ICON_SETTINGS)) {
            this.icon_settings = new MenuIcon(ICON_SETTINGS, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_settings);
        }

        if (!list_of_icons_not_to_load.contains(ICON_HOME)) {
            this.icon_home = new MenuIcon(ICON_HOME, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_home);
        }

        if (!list_of_icons_not_to_load.contains(ICON_MULTIPLAYER)) {
            this.icon_multiplayer = new MenuIcon(ICON_MULTIPLAYER, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_multiplayer);
        }

        if (!list_of_icons_not_to_load.contains(ICON_FULLSCREEN)) {
            this.icon_toggle_fullscreen = new MenuIcon(ICON_FULLSCREEN, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_toggle_fullscreen);
        }

        if (!list_of_icons_not_to_load.contains(ICON_EXIT)) {
            this.icon_log_out = new MenuIcon(ICON_EXIT, this.world, current_row);
            current_row += 1;
            this.icons.push(this.icon_log_out);
        }

        this.time_needed_for_each_row = ONE_SECOND / (this.icons.length);
        this.total_distance = this.icons.length * SPACE_BETWEEN_MENU_ICONS;

        this.set_to_invisible();
    }

};
