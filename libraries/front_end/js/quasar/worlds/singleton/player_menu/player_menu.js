'use strict';

function PlayerMenu() {
    this.__init__();
}

PlayerMenu.prototype = {

    __init__: function() {
        // Inherit.
        MenuActions.call(this);
        this.menu_main     = new AnimatedMenu();
        this.menu_create   = new AnimatedMenu('create', ASSET_ICON_WRENCH);
        this.menu_teleport          = new AnimatedMenu('teleport', ASSET_ICON_TELEPORT);
        this.menu_teleport_personal = new AnimatedMenu('personal', ASSET_ICON_TELEPORT);
        this.menu_teleport_shared   = new AnimatedMenu('shared'  , ASSET_ICON_TELEPORT);
        this.menu_teleport_shared_owned     = new AnimatedMenu('owned', ASSET_ICON_TELEPORT);
        this.menu_teleport_shared_not_owned = new AnimatedMenu('not owner', ASSET_ICON_TELEPORT);
        this.menu_teleport_global   = new AnimatedMenu('global', ASSET_ICON_TELEPORT);
        this.menu_debug = new AnimatedMenu('debug', ASSET_ICON_WRENCH);

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

        this.hide_un_needed_actions(new_world);
    },

    hide_un_needed_actions: function(current_world) {
        if (current_world === MANAGER_WORLD.world_login) {
            this.menu_main.hide_button(this.menu_create.menu_name);
            this.menu_main.hide_button(this.menu_teleport.menu_name);
            this.menu_main.hide_button('logout');
        } else {
            // Un-hide all.
            this.menu_main.unhide_all();
            // Hide teleport to current world.
            // Get teleport to all other worlds.
        }

        // TODO: Fix world teleporting issue.

        // Recalculate row offsets.
        this.menu_main.recalculate_row_offsets();
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

        let player_position = CURRENT_PLAYER.get_position();
        let player_normal   = CURRENT_PLAYER.get_direction();

        //let position_offset = this.menu_main.menu.get_position_offset(player_normal);
        this.menu_main.menu.set_position_offset(player_normal);

        let position_x = player_position.x + this.menu_main.menu._position_offset.x;
        let position_y = player_position.y + this.menu_main.menu._position_offset.y;
        let position_z = player_position.z + this.menu_main.menu._position_offset.z;

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

        this.hide_un_needed_actions(world);
    },

    _create_menu_main: function(world) {
        this.menu_main.create(world);
        let section;
        section = this.menu_main.add_section();
        section.add_button_for_sub_menu(this.menu_create);
        section.add_button_for_sub_menu(this.menu_teleport);
        section.add_button('fullscreen', ASSET_ICON_EXPAND, this.action_fullscreen.bind(this));
        section.add_button_for_sub_menu(this.menu_debug);
        section.add_button('logout', ASSET_ICON_EXIT, this.action_logout.bind(this));
        this.menu_main.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_create: function(world) {
        this.menu_create.create(world);
        let section;
        section = this.menu_create.add_section('Create a...');
        section.add_button('new world'    , ASSET_ICON_PLANET  , this.action_create_new_dynamic_world.bind(this));
        section.add_button('month view'   , ASSET_ICON_CALENDAR, this.action_create_new_month_view.bind(this));
        section.add_button('text'         , ASSET_ICON_TEXT    , this.action_create_new_floating_text.bind(this));
        section.add_button('entity group' , ASSET_ICON_FOLDER  , this.action_create_new_entity_group.bind(this));
        section.add_button('picture'      , ASSET_ICON_PICTURE , this.action_create_new_picture.bind(this));
        section.add_button('YouTube video', ASSET_ICON_VIDEO   , this.action_create_new_video.bind(this));
        this.menu_create.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_debug: function(world) {
        this.menu_debug.create(world);
        let section;
        section = this.menu_debug.add_section();
        section.add_button('none', ASSET_ICON_TEXT, this.action_set_debug_to_none.bind(this));
        section.add_button('fps', ASSET_ICON_TEXT, this.action_set_debug_to_fps.bind(this));
        section.add_button('full', ASSET_ICON_TEXT, this.action_set_debug_to_full.bind(this));
        this.menu_debug.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport: function(world) {
        this.menu_teleport.create(world);
        let section;
        section = this.menu_teleport.add_section();
        section.add_button_for_sub_menu(this.menu_teleport_personal);
        section.add_button_for_sub_menu(this.menu_teleport_shared);
        section.add_button_for_sub_menu(this.menu_teleport_global);
        this.menu_teleport.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_personal: function(world) {
        this.menu_teleport_personal.create(world);
        let section;
        section = this.menu_teleport_personal.add_section();
        section.add_button('settings', ASSET_ICON_GEARS        , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_settings));
        section.add_button('home'    , ASSET_ICON_HOME         , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_home));
        section.add_button('admin'   , ASSET_ICON_ADMIN        , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_admin));
        this.menu_teleport_personal.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _create_menu_teleport_shared: function(world) {
        this.menu_teleport_shared.create(world);
        let section;
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
