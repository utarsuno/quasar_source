'use strict';

const SPACE_BETWEEN_MENU_ICONS = 20;
const ONE_SECOND = 1.0;
const ANIMATION_TIME = ONE_SECOND / 4;
const MENU_DISTANCE_FROM_PLAYER = 150;

function PlayerMenu(world) {
    this.__init__(world);
}

function MenuIcon(icon_type, world, row, player_menu) {
    this.__init__(icon_type, world, row, player_menu);
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
        // TODO : remove this or refactor
        window.close();
    } else {
        l('TODO : regular log out functionality');
    }
}

function toggle_fullscreen() {
    MANAGER_RENDERER.toggle_fullscreen();
}

MenuIcon.prototype = {

    _display_utility_wall: function(utility_wall_to_display) {
        if (utility_wall_to_display === this.teleport_wall) {
            this.teleport_wall.show();
            this._hide_utility_wall(this.create_wall);
        } else if (utility_wall_to_display === this.create_wall) {
            this.create_wall.show();
            this._hide_utility_wall(this.teleport_wall);
        }
    },

    _hide_utility_wall: function(utility_wall_to_hide) {
        if (is_defined(utility_wall_to_hide)) {
            utility_wall_to_hide.hide();
        }
    },

    /*__   __   ___      ___  ___
     /  ` |__) |__   /\   |  |__
     \__, |  \ |___ /~~\  |  |___ */
    display_create_options: function() {
        this._display_utility_wall(this.create_wall);
    },

    hide_create_options: function() {
        this._hide_utility_wall(this.create_wall);
    },

    /*___  ___       ___  __   __   __  ___
       |  |__  |    |__  |__) /  \ |__)  |
       |  |___ |___ |___ |    \__/ |  \  |  */
    display_teleport_worlds: function() {
        this._display_utility_wall(this.teleport_wall);
    },

    hide_teleport_worlds: function() {
        this._hide_utility_wall(this.teleport_wall);
    },

    __init__: function(icon_type, world, row, player_menu) {
        // Inherit from Attachmentable.
        Attachmentable.call(this);

        this._icon_type = icon_type;
        this._player_menu = player_menu;

        this.function_to_bind = null;
        this.function_look_at_bind = null;
        this.function_look_away_bind = null;

        this.world = world;
        this.row = row;

        var utiltiy_wall_width = 120;
        var icon_width = 16 / utiltiy_wall_width;

        switch (this._icon_type) {
            case ICON_WRENCH:
                this.icon_label = 'create';
                this.function_look_at_bind = this.display_create_options.bind(this);
                //this.function_look_away_bind = this.hide_create_options.bind(this);

                this.create_wall = new FloatingWall(utiltiy_wall_width, 200, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), this.world, false, 0);
                this.create_wall.add_floating_2d_text(0, 1, 'Create a...', TYPE_CONSTANT, 0);


                this.create_wall.add_floating_2d_text(0, icon_width, ICON_INFORMATION, TYPE_ICON, 2);
                var create_floating_2D_text_button = this.create_wall.add_floating_2d_text(icon_width, 1, 'Floating Text', TYPE_BUTTON, 2);
                // TODO : create_floating_2D_text_button.set_engage_function();

                this.create_wall.add_floating_2d_text(0, icon_width, ICON_MENU_LIST, TYPE_ICON, 3);
                var create_entity_wall_button = this.create_wall.add_floating_2d_text(icon_width, 1, 'Entity Group', TYPE_BUTTON, 3);
                // TODO : create_entity_wall_button.set_engage_function();

                this.create_wall.add_floating_2d_text(0, icon_width, ICON_IMPORT, TYPE_ICON, 4);
                var create_floating_picture_button = this.create_wall.add_floating_2d_text(icon_width, 1, 'Picture', TYPE_BUTTON, 4);
                // TODO : create_floating_picture_button.set_engage_function();

                this.create_wall.add_floating_2d_text(0, icon_width, ICON_MOVIE, TYPE_ICON, 5);
                var create_floating_video_button = this.create_wall.add_floating_2d_text(icon_width, 1, 'YouTube Video', TYPE_BUTTON, 5);
                // TODO : create_floating_video_button.set_engage_function();

                this.create_wall.hide();
                break;
            case ICON_SAVE:
                this.icon_label = 'save';
                this.function_to_bind = global_save;
                break;
            case ICON_TELEPORT:
                this.icon_label = 'teleport';
                this.function_look_at_bind = this.display_teleport_worlds.bind(this);
                //this.function_look_away_bind = this.hide_teleport_worlds.bind(this);

                this.teleport_wall = new FloatingWall(utiltiy_wall_width, 200, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), this.world, false, 0);
                // TODO : Need to dynamically load all shared worlds that the player has.
                this.teleport_wall.add_floating_2d_text(0, 1, 'Teleport To...', TYPE_CONSTANT, 0);

                // TODO : Also dynamically only load the worlds that are available.

                this.teleport_wall.add_floating_2d_text(0, icon_width, ICON_SETTINGS, TYPE_ICON, 2);
                var settings_button = this.teleport_wall.add_floating_2d_text(icon_width, 1, 'Settings', TYPE_BUTTON, 2);
                settings_button.set_engage_function(go_to_settings_world);

                this.teleport_wall.add_floating_2d_text(0, icon_width, ICON_HOME, TYPE_ICON, 3);
                var home_button = this.teleport_wall.add_floating_2d_text(icon_width, 1, 'Home', TYPE_BUTTON, 3);
                home_button.set_engage_function(go_to_home_world);

                this.teleport_wall.add_floating_2d_text(0, icon_width, ICON_EXIT, TYPE_ICON, 4);
                var exit_button = this.teleport_wall.add_floating_2d_text(icon_width, 1, 'Exit', TYPE_BUTTON, 4);
                exit_button.set_engage_function(exit_function);

                this.teleport_wall.hide();
                break;
            case ICON_MULTI_PLAYER:
                this.icon_label = 'online';
                break;
            case ICON_FULLSCREEN:
                this.icon_label = 'fullscreen';
                this.function_to_bind = toggle_fullscreen;
                break;
        }

        this.icon = get_new_floating_icon(icon_type, this.world);
        var label = this.icon.add_floating_2D_text();

        // Refactor this so that it's attached to the icon.
        this.floating_label = new Floating2DText(100, this.icon_label, TYPE_BUTTON, this.world);
        this.floating_label.set_engage_function(this.function_to_bind);
        this.floating_label.set_look_at_function(this.function_look_at_bind);
        this.floating_label.set_look_away_function(this.function_look_away_bind);


        this.object3D.add(this.icon);

        this.world.add_to_scene(this.object3D);

        // Inherit from Interactive.
        //Interactive.call(this);
        // Inherit from Visibility.
        //Visibility.call(this);

        this.world.interactive_objects.push(this.floating_label);
    },

    _set_utility_wall_position_and_normal: function(utility_wall, horizontal_shift) {
        if (is_defined(utility_wall)) {
            var player_position = CURRENT_PLAYER.get_position();
            var utility_wall_position = new THREE.Vector3(this.object3D.position.x + this.left_right.x * horizontal_shift * 3 + this.normal.x * 30,
                                                           this.object3D.position.y,
                                                           this.object3D.position.z + this.left_right.z * horizontal_shift * 3 + this.normal.z * 30);
            var utility_wall_look_at = new THREE.Vector3(player_position.x - utility_wall_position.x, 0, player_position.z - utility_wall_position.z);
            utility_wall_look_at.normalize();
            utility_wall.set_position_and_normal(utility_wall_position, utility_wall_look_at, false);
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

        var horizontal_shift = 60;

        this.floating_label.update_position_and_normal(new THREE.Vector3(this.object3D.position.x + this.left_right.x * horizontal_shift, this.object3D.position.y, this.object3D.position.z + this.left_right.z * horizontal_shift), this.normal);

        this._set_utility_wall_position_and_normal(this.teleport_wall, horizontal_shift);
        this._set_utility_wall_position_and_normal(this.create_wall, horizontal_shift);
    },

    update_y_position: function(y_offset) {
        this.object3D.position.y = this.y_position - y_offset;
        this.floating_label.object3D.position.y = this.y_position - y_offset;
    },

};

PlayerMenu.prototype = {

    world: null,

    __init__: function(world) {
        this.world = world;

        this.visible = false;
        this.total_delta = 0;

        // Only used for the initial loading.
        this.current_row = 0;
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

    _add_menu_icon: function(icon, list_of_icons_not_to_load) {
        if (this.current_row === 0) {
            this.icons = [];
        }
        if (!list_of_icons_not_to_load.contains(icon)) {
            this.icons.push(new MenuIcon(icon, this.world, this.current_row, this));
            this.current_row += 1;
        }
    },

    // This function gets called once per player menu object.
    load_icon_textures: function(list_of_icons_not_to_load) {
        this._add_menu_icon(ICON_WRENCH      , list_of_icons_not_to_load);
        this._add_menu_icon(ICON_SAVE        , list_of_icons_not_to_load);
        this._add_menu_icon(ICON_TELEPORT    , list_of_icons_not_to_load);
        this._add_menu_icon(ICON_MULTI_PLAYER, list_of_icons_not_to_load);
        this._add_menu_icon(ICON_FULLSCREEN  , list_of_icons_not_to_load);

        this.time_needed_for_each_row = ONE_SECOND / (this.icons.length);
        this.total_distance = this.icons.length * SPACE_BETWEEN_MENU_ICONS;

        this.set_to_invisible();
    }

};
