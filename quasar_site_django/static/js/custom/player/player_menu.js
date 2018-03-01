'use strict';

const INDEX_DYNAMIC_WORLD_OBJECT          = 0;
const INDEX_DYNAMIC_WORLD_TELEPORT_BUTTON = 1;

function PlayerMenu(world) {
    this.__init__(world);
}

PlayerMenu.prototype = {

    __init__: function(world) {
        this.world                     = world;
        this._number_of_main_menu_rows = 0;

        this.dynamic_worlds            = {};
    },

    set_to_invisible: function() {
        this._player_menu.hide_self_and_all_child_attachments_recursively();
    },

    set_to_visible: function() {
        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        var position_offset = this._player_menu.get_position_offset(player_normal);

        var position_x = player_position.x + position_offset[0];
        var position_y = player_position.y + position_offset[1];
        var position_z = player_position.z + position_offset[2];

        this._player_menu.set_position(position_x, position_y, position_z, false);
        this._player_menu.set_normal(player_position.x - position_x, 0, player_position.z - position_z, false);

        this._player_menu.restart_all_animations();
        this._player_menu.display_self_and_all_child_attachments_recursively();
        this._player_menu.refresh_position_and_look_at();

        if (is_defined(this.create_wall)) {
            this.create_wall.hide_self_and_all_child_attachments_recursively();
        }
        if (is_defined(this.teleport_wall)) {
            this.teleport_wall.hide_self_and_all_child_attachments_recursively();
        }
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
    _main_menu_button_looked_at: function(sub_menu) {
        if (this.full_screen_button.animation_finished) {
            if (sub_menu === this.teleport_wall) {
                if (is_defined(this.create_wall)) {
                    this.create_wall.hide_self_and_all_child_attachments_recursively();
                }
                this.teleport_wall.display_self_and_all_child_attachments_recursively();
            } else if (sub_menu === this.create_wall) {
                this.teleport_wall.hide_self_and_all_child_attachments_recursively();
                this.create_wall.display_self_and_all_child_attachments_recursively();
            }
        }
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        var temp_position = new THREE.Vector3(0, 0, 0);
        var temp_normal = new THREE.Vector3(0, 0, 0);
        this._player_menu = new FloatingWall(130, 100, temp_position, temp_normal, this.world);
        //this._player_menu.hide_self_and_all_child_attachments_recursively();
        //this._player_menu.make_base_wall_invisible();

        this._player_menu.set_attachment_horizontal_offset(-30, null);
        this._player_menu.set_attachment_vertical_offset(-30, null);
        this._player_menu.set_attachment_depth_offset(200);

        switch(this.world) {
            case MANAGER_WORLD.world_login:
                this._add_main_menu_icon(ICON_FULLSCREEN);
                break;
            case MANAGER_WORLD.world_home:
                this._add_main_menu_icon(ICON_WRENCH);
                this._add_main_menu_icon(ICON_TELEPORT);
                this._add_main_menu_icon(ICON_SAVE);
                this._add_main_menu_icon(ICON_FULLSCREEN);
                break;
            case MANAGER_WORLD.world_settings:
                this._add_main_menu_icon(ICON_WRENCH);
                this._add_main_menu_icon(ICON_TELEPORT);
                this._add_main_menu_icon(ICON_SAVE);
                this._add_main_menu_icon(ICON_FULLSCREEN);
                break;
            case MANAGER_WORLD.world_admin:
                this._add_main_menu_icon(ICON_TELEPORT);
                this._add_main_menu_icon(ICON_FULLSCREEN);
                break;
            default:
                // Default occurs for dynamic worlds.
                this._add_main_menu_icon(ICON_WRENCH);
                this._add_main_menu_icon(ICON_TELEPORT);
                this._add_main_menu_icon(ICON_SAVE);
                this._add_main_menu_icon(ICON_FULLSCREEN);
                break;
        }
    },

    // TODO : REFACTOR THIS
    add_personal_teleport_button: function(dynamic_world) {
        var index_of_settings_world = this.teleport_wall.get_row_with_name(ICON_SETTINGS).row_number + 1;

        var utiltiy_wall_width = 120;
        var icon_width = 16 / utiltiy_wall_width;

        var current_row = this.teleport_wall.add_row(index_of_settings_world);
        current_row.add_2D_element([0, icon_width], ICON_STAR, TYPE_ICON);
        var teleport_button = current_row.add_2D_button([icon_width, 1], dynamic_world.world_name, COLOR_YELLOW, player_action_teleport_to_world.bind(this, dynamic_world));

        this.dynamic_worlds[dynamic_world.entity.get_relative_id()] = [dynamic_world, teleport_button];
    },

    update_or_add_personal_teleport_button: function(dynamic_world) {
        var relative_id = (dynamic_world.entity.get_relative_id()).toString();

        if (relative_id in this.dynamic_worlds) {
            this.dynamic_worlds[relative_id][INDEX_DYNAMIC_WORLD_TELEPORT_BUTTON].update_text(this.dynamic_worlds[relative_id][INDEX_DYNAMIC_WORLD_OBJECT].world_name);
        } else {
            this.add_personal_teleport_button(dynamic_world);
        }
    },

    _add_main_menu_icon: function(icon) {
        var utiltiy_wall_width = 120;
        var icon_width = 16 / utiltiy_wall_width;

        var player_menu_icon_width = 16 / 110;

        var menu_button;
        var menu_icon;
        var sub_menu;

        switch (icon) {
            case ICON_WRENCH:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width - 16, [4, null], [-8, .25], 1, 'create', TYPE_BUTTON);
                menu_icon = this._player_menu.add_floating_2D_text(16, [4, -ONE_FOURTH], [-8, .25], 1, ICON_WRENCH, TYPE_ICON);

                this.create_wall = menu_button.add_floating_wall_attachment(utiltiy_wall_width, 100, [125, null], null, null, false);

                //this.create_wall.manual_visibility = true;

                this.create_wall.add_full_row_2D(null, 'Create a...', TYPE_CONSTANT);

                var current_row;
                current_row = this.create_wall.add_row(null);
                current_row.add_2D_element([0, icon_width], ICON_STAR, TYPE_ICON);
                // TODO : This functionality.
                current_row.add_2D_button([icon_width, 1], 'New World', null, MANAGER_WORLD.create_new_dynamic_world);

                current_row = this.create_wall.add_row(null);
                current_row.add_2D_element([0, icon_width], ICON_MENU_LIST, TYPE_ICON);
                // TODO : This functionality.
                current_row.add_2D_button([icon_width, 1], 'Month View', null, null);

                current_row = this.create_wall.add_row(null);
                current_row.add_2D_element([0, icon_width], ICON_INFORMATION, TYPE_ICON);
                current_row.add_2D_button([icon_width, 1], 'Text', null, null);

                current_row = this.create_wall.add_row(null);
                current_row.add_2D_element([0, icon_width], ICON_INFORMATION, TYPE_ICON);
                current_row.add_2D_button([icon_width, 1], 'Entity Wall', null, player_action_create_entity_wall);

                current_row = this.create_wall.add_row(null);
                current_row.add_2D_element([0, icon_width], ICON_IMPORT, TYPE_ICON);
                current_row.add_2D_button([icon_width, 1], 'Picture', null, player_action_create_picture);

                current_row = this.create_wall.add_row(null);
                current_row.add_2D_element([0, icon_width], ICON_MOVIE, TYPE_ICON);
                current_row.add_2D_button([icon_width, 1], 'YouTube Video', null, null);

                // TODO : REFACTOR
                menu_button.set_look_at_function(this._main_menu_button_looked_at.bind(this, this.create_wall));
                this.create_wall.hide_self_and_all_child_attachments_recursively();
                break;
            case ICON_FULLSCREEN:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width - 16, [4, null], [-8, .25], 1, 'fullscreen', TYPE_BUTTON);
                menu_button.set_engage_function(player_action_toggle_fullscreen);

                menu_icon = this._player_menu.add_floating_2D_text(16, [4, -ONE_FOURTH], [-8, .25], 1, ICON_FULLSCREEN, TYPE_ICON);

                this.full_screen_button = menu_button;

                break;
            case ICON_TELEPORT:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width - 16, [4, null], [-8, .25], 1, 'teleport', TYPE_BUTTON);
                menu_icon = this._player_menu.add_floating_2D_text(16, [4, -ONE_FOURTH], [-8, .25], 1, ICON_TELEPORT, TYPE_ICON);

                this.teleport_wall = menu_button.add_floating_wall_attachment(utiltiy_wall_width, 200, [125, null], null, null, false);

                this.teleport_wall.add_full_row_2D(0, 'Teleport to...', TYPE_CONSTANT);

                var teleport_button;

                // Add an empty row for spacing.
                this.teleport_wall.add_row(null);

                var personal_worlds_title = this.teleport_wall.add_row(null, ICON_SETTINGS);
                personal_worlds_title.add_2D_element([0, 1], 'Personal Worlds', TYPE_CONSTANT)

                var teleport_row;

                // TODO : LOAD ALL PERSONAL WORLDS HERE!!!

                if (this.world !== MANAGER_WORLD.world_settings) {
                    teleport_row = this.teleport_wall.add_row(null);
                    teleport_row.add_2D_element([0, icon_width], ICON_SETTINGS, TYPE_ICON);
                    teleport_row.add_2D_button([icon_width, 1], 'Settings', null, player_action_teleport_to_world.bind(this, MANAGER_WORLD.world_settings));
                }

                if (this.world !== MANAGER_WORLD.world_home) {
                    teleport_row = this.teleport_wall.add_row(null);
                    teleport_row.add_2D_element([0, icon_width], ICON_HOME, TYPE_ICON);
                    teleport_row.add_2D_button([icon_width, 1], 'Home', null, player_action_teleport_to_world.bind(this, MANAGER_WORLD.world_home));
                }

                // Add an empty row for spacing.
                this.teleport_wall.add_row(null);

                this.teleport_wall.add_full_row_2D(null, 'Global Worlds', TYPE_CONSTANT);

                // Add an empty row for spacing.
                this.teleport_wall.add_row(null);

                this.teleport_wall.add_full_row_2D(null, 'Shared Worlds', TYPE_CONSTANT);

                // TODO : LOAD ALL SHARED WORLDS HERE!!!

                // Add an empty row for spacing.
                this.teleport_wall.add_row(null);

                if (is_defined(ENTITY_OWNER)) {
                    //if (ENTITY_OWNER.get_account_type() === ACCOUNT_TYPE_SUDO) {
                        if (this.world !== MANAGER_WORLD.world_admin) {
                            teleport_row = this.teleport_wall.add_row(null);
                            teleport_row.add_2D_element([0, icon_width], ICON_SINGLE_PLAYER, TYPE_ICON);
                            teleport_row.add_2D_button([icon_width, 1], 'Admin', null, player_action_teleport_to_world.bind(this, MANAGER_WORLD.world_admin));
                        }
                    //}
                }

                // Add an empty row for spacing.
                this.teleport_wall.add_row(null);

                teleport_row = this.teleport_wall.add_row(null);
                teleport_row.add_2D_element([0, icon_width], ICON_EXIT, TYPE_ICON);
                teleport_row.add_2D_button([icon_width, 1], 'Logout', TYPE_BUTTON, null, null);

                menu_button.set_look_at_function(this._main_menu_button_looked_at.bind(this, this.teleport_wall));
                this.teleport_wall.hide_self_and_all_child_attachments_recursively();
                break;
            case ICON_SAVE:
                menu_button = this._player_menu.add_floating_2D_text(this._player_menu.width - 16, [4, null], [-8, .25], 1, 'save', TYPE_BUTTON);
                menu_icon = this._player_menu.add_floating_2D_text(16, [4, -ONE_FOURTH], [-8, .25], 1, ICON_SAVE, TYPE_ICON);
                menu_button.set_engage_function(player_action_global_save);
                break;
        }

        menu_button.set_animation_vertical_offset(-18 * this._number_of_main_menu_rows, null);
        menu_button.set_animation_duration(0.25);

        menu_icon.set_animation_vertical_offset(-18 * this._number_of_main_menu_rows, null);
        menu_icon.set_animation_duration(0.25);

        this._number_of_main_menu_rows += 1;
    },

};
