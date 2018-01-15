'use strict';

/*
const SPACE_BETWEEN_MENU_ICONS = 20;
const ONE_SECOND = 1.0;
const ANIMATION_TIME = ONE_SECOND / 4;

const MENU_DISTANCE_FROM_PLAYER = 150;
*/

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

    __init__: function(icon_type, world, row, player_menu) {

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

    },

};

/*
        if (world === MANAGER_WORLD.world_login) {
            world.player_menu.load_icon_textures([ICON_WRENCH, ICON_SAVE, ICON_SETTINGS, ICON_HOME, ICON_MULTI_PLAYER, ICON_TELEPORT, ICON_EXIT]);
        } else if (world === MANAGER_WORLD.world_home) {
            world.player_menu.load_icon_textures([ICON_HOME]);
        } else if (world === MANAGER_WORLD.world_settings) {
            world.player_menu.load_icon_textures([ICON_SETTINGS, ICON_ENTITY_GROUP]);
        }

 */


PlayerMenu.prototype = {

    __init__: function(world) {
        this.world = world;

        // TODO : Make a better design for the temp values.
        var temp_position = new THREE.Vector3(-10000, -10000, -10000);
        var temp_normal   = new THREE.Vector3(0, 0, 0);
        this._player_menu = new FloatingWall(100, 200, temp_position, temp_normal, this.world);
        this._player_menu.hide_self_and_all_child_attachments_recursively();
        //this._player_menu.make_base_wall_invisible();

        this._player_menu.set_attachment_horizontal_offset(-30, null);
        this._player_menu.set_attachment_vertical_offset(-30, null);
        this._player_menu.set_attachment_depth_offset(150);

        this._sub_menus = [];
        this._number_of_main_menu_rows = 0;
    },

    set_to_invisible: function() {
        this._player_menu.set_to_invisible();
    },

    set_to_visible: function() {
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        var position_offset = this._player_menu.get_position_offset(player_normal);

        // TODO : Flip the player menu wall normal?

        this._player_menu.set_position(player_position.x + position_offset[0], player_position.y + position_offset[1], player_position.z + position_offset[2], true);

        this._player_menu.set_to_visible();
        this._player_menu.restart_all_animations();
    },

    is_visible: function() {
        return this._player_menu.is_visible();
    },

    update: function(delta) {
        this._player_menu.update_all_child_animations_recursively(delta);
    },

    // This function gets called once per player menu object.
    load_icon_textures: function() {
        if (this.world === MANAGER_WORLD.world_login) {
            this._add_main_menu_icon(ICON_FULLSCREEN);
        } else if (this.world === MANAGER_WORLD.world_home) {
            this._add_main_menu_icon(ICON_WRENCH);
            this._add_main_menu_icon(ICON_TELEPORT);
            this._add_main_menu_icon(ICON_SAVE);
            this._add_main_menu_icon(ICON_FULLSCREEN);
        } else if (this.world === MANAGER_WORLD.world_settings) {
            this._add_main_menu_icon(ICON_WRENCH);
            this._add_main_menu_icon(ICON_TELEPORT);
            this._add_main_menu_icon(ICON_SAVE);
            this._add_main_menu_icon(ICON_FULLSCREEN);
        }
    },

    /*                          ___
     |\/|  /\  | |\ |     |\/| |__  |\ | |  |
     |  | /~~\ | | \|     |  | |___ | \| \__/ */
    _teleport_to_world: function(world) {
        MANAGER_WORLD.set_current_world(world);
    },

    _main_menu_button_looked_at: function(sub_menu) {
        for (var m = 0; m < this._sub_menus.length; m++) {
            if (sub_menu === this._sub_menus[m]) {
                sub_menu.display_self_and_all_child_attachments_recursively();
            } else {
                sub_menu.hide_self_and_all_child_attachments_recursively();
            }
        }
    },

    // Add the icons that appear on the main player menu.
    _add_main_menu_icon: function(icon) {
        var utiltiy_wall_width = 120;
        var icon_width = 16 / utiltiy_wall_width;

        var menu_button;
        var sub_menu;
        var utility_wall;

        switch (icon) {
            case ICON_WRENCH:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [40 * this._number_of_main_menu_rows, null], 1, 'create', TYPE_BUTTON);

                utility_wall = menu_button.add_floating_wall_attachment(utiltiy_wall_width, 200, [200, null], null, null, false);
                utility_wall.add_row_2D_text([0, 1], 0, 'Create a...', TYPE_CONSTANT);

                utility_wall.add_row_2D_text([0, icon_width], 2, ICON_INFORMATION, TYPE_ICON);
                utility_wall.add_row_2D_text([icon_width, 1], 2, 'Text', TYPE_BUTTON);

                utility_wall.add_row_2D_text([0, icon_width], 3, ICON_MENU_LIST, TYPE_ICON);
                utility_wall.add_row_2D_text([icon_width, 1], 3, 'Entity Wall', TYPE_BUTTON);

                utility_wall.add_row_2D_text([0, icon_width], 3, ICON_MENU_LIST, TYPE_ICON);
                utility_wall.add_row_2D_text([icon_width, 1], 3, 'Picture', TYPE_BUTTON);

                utility_wall.add_row_2D_text([0, icon_width], 3, ICON_MENU_LIST, TYPE_ICON);
                utility_wall.add_row_2D_text([icon_width, 1], 3, 'YouTube Video', TYPE_BUTTON);

                this._sub_menus.push(utility_wall);

                menu_button.set_look_at_function(this._main_menu_button_looked_at.bind(this, utility_wall));
                utility_wall.hide_self_and_all_child_attachments_recursively();
                break;
            case ICON_FULLSCREEN:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [40 * this._number_of_main_menu_rows, null], 1, 'fullscreen', TYPE_BUTTON);
                menu_button.set_engage_function(toggle_fullscreen);
                break;
            case ICON_TELEPORT:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [40 * this._number_of_main_menu_rows, null], 1, 'teleport', TYPE_BUTTON);

                utility_wall = menu_button.add_floating_wall_attachment(utiltiy_wall_width, 200, [200, null], null, null, false);
                utility_wall.add_row_2D_text([0, 1], 0, 'Teleport to...', TYPE_CONSTANT);

                var current_button_row = 2;
                var teleport_button;

                if (this.world !== MANAGER_WORLD.world_settings) {
                    utility_wall.add_row_2D_text([0, icon_width], current_button_row, ICON_SETTINGS, TYPE_ICON);
                    teleport_button = utility_wall.add_row_2D_text([icon_width, 1], current_button_row, 'Settings', TYPE_BUTTON);
                    teleport_button.set_engage_function(this._teleport_to_world(MANAGER_WORLD.world_settings));
                    current_button_row += 1;
                }

                if (this.world !== MANAGER_WORLD.world_home) {
                    utility_wall.add_row_2D_text([0, icon_width], current_button_row, ICON_HOME, TYPE_ICON);
                    teleport_button = utility_wall.add_row_2D_text([icon_width, 1], current_button_row, 'Home', TYPE_BUTTON);
                    teleport_button.set_engage_function(this._teleport_to_world(MANAGER_WORLD.world_home));
                    current_button_row += 1;
                }

                utility_wall.add_row_2D_text([0, icon_width], current_button_row, ICON_EXIT, TYPE_ICON);
                utility_wall.add_row_2D_text([icon_width, 1], current_button_row, 'Logout', TYPE_BUTTON);
                // TODO : logout functionality
                current_button_row += 1;

                this._sub_menus.push(utility_wall);

                menu_button.set_look_at_function(this._main_menu_button_looked_at.bind(this, utility_wall));
                utility_wall.hide_self_and_all_child_attachments_recursively();
                break;
            case ICON_MULTI_PLAYER:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [40 * this._number_of_main_menu_rows, null], 1, 'online', TYPE_BUTTON);
                break;
            case ICON_SAVE:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [40 * this._number_of_main_menu_rows, null], 1, 'save', TYPE_BUTTON);
                menu_button.set_engage_function(global_save);
                break;
        }

        menu_button.set_animation_vertical_offset(20 * this._number_of_main_menu_rows, null);
        this._number_of_main_menu_rows += 1;
    },



};
