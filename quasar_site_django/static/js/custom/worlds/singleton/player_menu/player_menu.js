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
    },

    create: function(world) {
        this._create_menu_create(world);
        this._create_menu_teleport_shared_owned(world);
        this._create_menu_teleport_shared_not_owned(world);
        this._create_menu_teleport_shared(world);
        this._create_menu_teleport_global(world);
        this._create_menu_teleport_personal(world);
        this._create_menu_teleport(world);
        this._create_menu_main(world);
    },

    _create_menu_main: function(world) {
        this.menu_main.create(world);
        var section;
        section = this.menu_main.add_section();
        section.add_button_for_sub_menu(this.menu_create, world);
        section.add_button_for_sub_menu(this.menu_teleport, world);
        section.add_button('fullscreen', ICON_FULLSCREEN, this.action_fullscreen);
        section.add_button('debugging', ICON_SETTINGS, this.action_toggle_debugging);
        section.add_button('logout', ICON_EXIT, this.action_logout);
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
    },

    _create_menu_teleport: function(world) {
        this.menu_teleport.create(world);
        var section;
        section = this.menu_teleport.add_section();
        section.add_button_for_sub_menu(this.menu_teleport_personal, world);
        section.add_button_for_sub_menu(this.menu_teleport_shared, world);
        section.add_button_for_sub_menu(this.menu_teleport_global, world);
    },

    _create_menu_teleport_personal: function(world) {
        this.menu_teleport_personal.create(world);
        var section;
        section = this.menu_teleport_personal.add_section();
        section.add_button('settings', ICON_SETTINGS     , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_settings));
        section.add_button('home'    , ICON_HOME         , this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_home));
        section.add_button('admin'   , ICON_SINGLE_PLAYER, this.action_teleport_to_world.bind(this, MANAGER_WORLD.world_admin));
    },

    _create_menu_teleport_shared: function(world) {
        this.menu_teleport_shared.create(world);
        var section;
        section = this.menu_teleport_shared.add_section();
        section.add_button_for_sub_menu(this.menu_teleport_shared_owned, world);
        section.add_button_for_sub_menu(this.menu_teleport_shared_not_owned, world);
    },

    _create_menu_teleport_shared_owned: function(world) {
        this.menu_teleport_shared_owned.create(world);
    },

    _create_menu_teleport_shared_not_owned: function(world) {
        this.menu_teleport_shared_not_owned.create(world);
    },

    _create_menu_teleport_global: function(world) {
        this.menu_teleport_global.create(world);
    }

};
