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

PlayerMenu.prototype = {

    __init__: function(world) {
        this.world                     = world;
        this._sub_menus                = [];
        this._number_of_main_menu_rows = 0;
    },

    set_to_invisible: function() {
        this._player_menu.set_to_invisible();
    },

    set_to_visible: function() {
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        var position_offset = this._player_menu.get_position_offset(player_normal);

        var position_x = player_position.x + position_offset[0];
        var position_y = player_position.y + position_offset[1];
        var position_z = player_position.z + position_offset[2];

        this._player_menu.set_position(position_x, position_y, position_z, false);
        this._player_menu.set_normal(player_position.x - position_x, 0, player_position.z - position_z, true);

        this._player_menu.refresh_position_and_look_at();

        this._player_menu.set_to_visible();

        this._player_menu.restart_all_animations();
    },

    is_visible: function() {
        return this._player_menu.is_visible();
    },

    update: function(delta) {
        this._player_menu.update_all_child_animations_recursively(delta);
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

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        // TODO : Make a better design for the temp values.
        var temp_position = new THREE.Vector3(-10000, -10000, -10000);
        var temp_normal   = new THREE.Vector3(0, 0, 0);
        this._player_menu = new FloatingWall(100, 200, temp_position, temp_normal, this.world);
        //this._player_menu.hide_self_and_all_child_attachments_recursively();
        //this._player_menu.make_base_wall_invisible();

        this._player_menu.set_attachment_horizontal_offset(-30, null);
        this._player_menu.set_attachment_vertical_offset(-30, null);
        this._player_menu.set_attachment_depth_offset(150);

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

    _add_main_menu_icon: function(icon) {
        var utiltiy_wall_width = 120;
        var icon_width = 16 / utiltiy_wall_width;

        var menu_button;
        var sub_menu;
        var utility_wall;

        //var temp_position = new THREE.Vector3(-10000, -10000, -10000);
        //var temp_normal   = new THREE.Vector3(0, 0, 0);

        switch (icon) {
            case ICON_WRENCH:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [18 * this._number_of_main_menu_rows, null], 1, 'create', TYPE_BUTTON);

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
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [18 * this._number_of_main_menu_rows, null], 1, 'fullscreen', TYPE_BUTTON);
                menu_button.set_engage_function(toggle_fullscreen);
                break;
            case ICON_TELEPORT:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [18 * this._number_of_main_menu_rows, null], 1, 'teleport', TYPE_BUTTON);

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
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [18 * this._number_of_main_menu_rows, null], 1, 'online', TYPE_BUTTON);
                break;
            case ICON_SAVE:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width, null, [18 * this._number_of_main_menu_rows, null], 1, 'save', TYPE_BUTTON);
                menu_button.set_engage_function(global_save);
                break;
        }

        menu_button.set_animation_vertical_offset(20 * this._number_of_main_menu_rows, null);
        this._number_of_main_menu_rows += 1;
    },

};
