'use strict';

function PlayerMenu() {
    this.__init__();
}

PlayerMenu.prototype = {

    __init__: function() {
        // Inherit.
        MenuActions.call(this);
        this.menu_main     = new AnimatedMenu();
        this.menu_create   = new AnimatedMenu('create', ICON_WRENCH);
        this.menu_teleport          = new AnimatedMenu('teleport', ICON_TELEPORT);
        this.menu_teleport_personal = new AnimatedMenu('personal', ICON_TELEPORT);
        this.menu_teleport_shared   = new AnimatedMenu('shared'  , ICON_TELEPORT);
        this.menu_teleport_shared_owned     = new AnimatedMenu('owned', ICON_TELEPORT);
        this.menu_teleport_shared_not_owned = new AnimatedMenu('not owner', ICON_TELEPORT);
        this.menu_teleport_global   = new AnimatedMenu('global', ICON_TELEPORT);
        this.menu_debug = new AnimatedMenu('debug', ICON_INFORMATION);

        this.currently_visible = false;
    },

    switch_to_new_world: function(old_world, new_world) {
        this.menu_main.switch_to_new_world(old_world, new_world);
        this.menu_create.switch_to_new_world(old_world, new_world);
        this.menu_teleport.switch_to_new_world(old_world, new_world);
        this.menu_teleport_personal.switch_to_new_world(old_world, new_world);
        this.menu_teleport_shared.switch_to_new_world(old_world, new_world);
        this.menu_teleport_shared_owned.switch_to_new_world(old_world, new_world);
        this.menu_teleport_shared_not_owned.switch_to_new_world(old_world, new_world);
        this.menu_teleport_global.switch_to_new_world(old_world, new_world);
        this.menu_debug.switch_to_new_world(old_world, new_world);
    },

    is_currently_visible: function() {
        return this.currently_visible;
    },

    toggle_visibility: function() {
        if (this.currently_visible) {
            this._set_to_invisible();
        } else {
            this._set_to_visible();
        }
    },

    _set_to_invisible: function() {
        this.currently_visible = false;
        this.menu_main.hide();
    },

    _set_to_visible: function() {
        this.currently_visible = true;

        var player_position = CURRENT_PLAYER.get_position();
        var player_normal   = CURRENT_PLAYER.get_direction();

        var position_offset = this.menu_main.menu.get_position_offset(player_normal);

        var position_x = player_position.x + position_offset[0];
        var position_y = player_position.y + position_offset[1];
        var position_z = player_position.z + position_offset[2];

        this.menu_main.menu.set_position(position_x, position_y, position_z, false);
        this.menu_main.menu.set_normal(player_position.x - position_x, 0, player_position.z - position_z, false);

        //this._player_menu.restart_all_animations();

        this.menu_main.show();
    },

    create: function(world) {
        this._create_menu_create(world);
        this._create_menu_teleport_shared_owned(world);
        this._create_menu_teleport_shared_not_owned(world);
        this._create_menu_teleport_shared(world);
        this._create_menu_teleport_global(world);
        this._create_menu_teleport_personal(world);
        this._create_menu_teleport(world);
        this._create_menu_debug(world);
        this._create_menu_main(world);
    },

    _create_menu_main: function(world) {
        this.menu_main.create(world);
        var section;
        section = this.menu_main.add_section();
        section.add_button_for_sub_menu(this.menu_create);
        section.add_button_for_sub_menu(this.menu_teleport);
        section.add_button('fullscreen', ICON_FULLSCREEN, this.action_fullscreen);
        section.add_button_for_sub_menu(this.menu_debug);
        //section.add_button('debugging', ICON_SETTINGS, this.action_toggle_debugging);
        section.add_button('logout', ICON_EXIT, this.action_logout);
        this.menu_main.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_create: function(world) {
        this.menu_create.create(world);
        var section;
        section = this.menu_create.add_section('Create a...');
        section.add_button('new world'    , ICON_STAR       , this.action_create_new_dynamic_world);
        section.add_button('month view'   , ICON_MENU_LIST  , this.action_create_new_month_view);
        section.add_button('text'         , ICON_INFORMATION, this.action_create_new_floating_text);
        section.add_button('entity group' , ICON_INFORMATION, this.action_create_new_entity_group);
        section.add_button('picture'      , ICON_IMPORT     , this.action_create_new_picture);
        section.add_button('YouTube video', ICON_MOVIE      , this.action_create_new_video);
        this.menu_create.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_debug: function(world) {
        this.menu_debug.create(world);
        var section;
        section = this.menu_debug.add_section();
        section.add_button('none', ICON_INFORMATION, this.action_set_debug_to_none);
        section.add_button('fps', ICON_INFORMATION, this.action_set_debug_to_fps);
        section.add_button('full', ICON_INFORMATION, this.action_set_debug_to_full);
        this.menu_debug.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport: function(world) {
        this.menu_teleport.create(world);
        var section;
        section = this.menu_teleport.add_section();
        section.add_button_for_sub_menu(this.menu_teleport_personal);
        section.add_button_for_sub_menu(this.menu_teleport_shared);
        section.add_button_for_sub_menu(this.menu_teleport_global);
        this.menu_teleport.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_personal: function(world) {
        this.menu_teleport_personal.create(world);
        var section;
        section = this.menu_teleport_personal.add_section();
        section.add_button('settings', ICON_SETTINGS     , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_settings));
        section.add_button('home'    , ICON_HOME         , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_home));
        section.add_button('admin'   , ICON_SINGLE_PLAYER, this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_admin));
        this.menu_teleport_personal.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_shared: function(world) {
        this.menu_teleport_shared.create(world);
        var section;
        section = this.menu_teleport_shared.add_section();
        section.add_button_for_sub_menu(this.menu_teleport_shared_owned);
        section.add_button_for_sub_menu(this.menu_teleport_shared_not_owned);
        this.menu_teleport_shared.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_shared_owned: function(world) {
        this.menu_teleport_shared_owned.create(world);
        this.menu_teleport_shared_owned.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_shared_not_owned: function(world) {
        this.menu_teleport_shared_not_owned.create(world);
        this.menu_teleport_shared_not_owned.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_global: function(world) {
        this.menu_teleport_global.create(world);
        this.menu_teleport_global.menu.force_hide_self_and_all_child_attachments_recursively();
    }

};
