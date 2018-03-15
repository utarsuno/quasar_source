'use strict';

function WorldManager() {
    this.__init__();
}

WorldManager.prototype = {

    previous_world : null,
    current_world  : null,

    current_player_menu: null,

    // Static worlds.
    world_login    : null,
    world_home     : null,
    world_settings : null,
    world_admin    : null,

    __init__: function() {
        // Static world objects without static entity.
        this.world_login = new LoginWorld();

        // List of all dynamic worlds.
        this.dynamic_worlds = {};

        // Inherit.
        DynamicContentManager.call(this);
    },

    update: function(delta) {
        if (CURRENT_PLAYER.currently_loading()) {
            return;
        }

        // Since we are not currently loading we can perform an update on the player and the world.
        CURRENT_PLAYER.update(delta);

        // Temp just for fun, rotate the lights in a circle.
        this.current_world.light_delta += delta;
        this.current_world.light_percentage = this.current_world.light_delta / this.current_world.light_delta_cap;
        this.current_world.light_0.position.set(cos(this.current_world.light_percentage) * 1000, 100, sin(this.current_world.light_percentage) * 1000);
        this.current_world.light_1.position.set(cos(this.current_world.light_percentage + TWO_PIE / 4) * 1000, 100, sin(this.current_world.light_percentage + TWO_PIE / 4) * 1000);
        this.current_world.light_2.position.set(cos(this.current_world.light_percentage + (TWO_PIE / 4) * 2) * 1000, 100, sin(this.current_world.light_percentage + (TWO_PIE / 4) * 2) * 1000);
        this.current_world.light_3.position.set(cos(this.current_world.light_percentage + (TWO_PIE / 4) * 3) * 1000, 100, sin(this.current_world.light_percentage + (TWO_PIE / 4) * 3) * 1000);

        // TODO : Double check on what order these should update.

        if (MANAGER_WORLD.current_player_menu.is_visible()) {
            MANAGER_WORLD.current_player_menu.update(delta);
        }

        for (var a = 0; a < this.current_world.root_attachables.length; a++) {
            if (this.current_world.root_attachables[a].has_animation && this.root_attachables[a].requires_animation_update) {
                this.current_world.root_attachables[a].update(delta);

                if (this.current_world.root_attachables[a].hasOwnProperty('update_all_child_animations_recursively')) {
                    this.current_world.root_attachables[a].update_all_child_animations_recursively(delta);
                } else {
                    l('Investigate this?');
                }
            }
        }

        if (!this.current_world.floating_cursor._currently_engaged) {
            this.current_world.update_interactive_objects();
        }

        this.current_world.floating_cursor.update();

        //this.current_world.floating_cursor.update();
    },

    set_current_world: function(world) {
        if (this.current_world !== null) {
            // Before exiting the world make sure to remove the camera reference.
            this.current_world.remove_from_scene(CURRENT_PLAYER.fps_controls.yaw);
            this.current_world.exit_world();

            this.previous_world = this.current_world;
        }
        this.current_world = world;
        this.current_player_menu = this.current_world.player_menu;

        // Before adding the world make sure to add the camera reference.
        this.current_world.add_to_scene(CURRENT_PLAYER.fps_controls.yaw);
        this.current_world.enter_world();
    },

    key_down_event: function(event) {
        this.current_world.key_down_event_for_interactive_objects(event);
    },

    create_world: function(world) {
        // Player menu.
        world.player_menu.create();
        world.player_menu.set_to_invisible();

        // Player floating cursor.
        world.floating_cursor.create();

        // Default skybox.
        var skybox_geometry = new THREE.BoxGeometry(22500, 22500, 22500);
        var skybox_cube = new THREE.Mesh(skybox_geometry, MANAGER_TEXTURE.get_skybox_material());
        skybox_cube.position.set(0, 0, 0);
        world.add_to_scene(skybox_cube);

        // Default hex grid ground.
        var grid = new vg.HexGrid({cellSize: 100});
        grid.generate({size: 10});
        var board = new vg.Board(grid);
        board.generateTilemap({cellSize: 100, tileScale: 0.99});
        world.add_to_scene(board.group);

        // Default lights.
        world.light_delta = 0;
        world.light_delta_cap = 10;
        world.light_radius = 1000;

        world.light_0 = new THREE.PointLight(0xccffcc, .4, 0);
        world.light_0.position.set(5, 100, 5);
        world.add_to_scene(world.light_0);

        world.light_1 = new THREE.PointLight(0xff8579, .4, 0);
        world.light_1.position.set(1000, 100, 0);
        world.add_to_scene(world.light_1);

        world.light_2 = new THREE.PointLight(0xb1ff90, .4, 0);
        world.light_2.position.set(0, 100, 1000);
        world.add_to_scene(world.light_2);

        world.light_3 = new THREE.PointLight(0x84b5ff, .4, 0);
        world.light_3.position.set(500, 100, 500);
        world.add_to_scene(world.light_3);

        world.light = new THREE.AmbientLight(0xffffff, .25); // soft white light
        world.add_to_scene(world.light);

        // Add audio needed for the world.
        MANAGER_AUDIO.set_audio_for_world(world);

        // Now finally create the actual world.
        world.create();
    },

    // TODO : Refactor this!!!
    prepare_for_save: function() {
        l('TODO: REFACTOR SAVING!!!');

        this.world_home.prepare_for_save();
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {
                this.dynamic_worlds[relative_id].prepare_for_save();
            }
        }

        MANAGER_ENTITY.update_server_and_database();
    },

    /*     __   __                  __        __          __
     |    /  \ / _` | |\ |    |    /  \  /\  |  \ | |\ | / _`
     |___ \__/ \__> | | \|    |___ \__/ /~~\ |__/ | | \| \__> */
    all_entities_loaded: function() {
        this.static_worlds_manager_entity = MANAGER_ENTITY.get_entity_of_type(ENTITY_TYPE_STATIC_WORLDS_MANAGER);
        this.dynamic_worlds_manager_entity = MANAGER_ENTITY.get_entity_of_type(ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER);

        this.world_home_entity = this.static_worlds_manager_entity.get_child_entity_with_property_value(ENTITY_PROPERTY_NAME, ENTITY_STATIC_WORLD_HOME);
        this.world_settings_entity = this.static_worlds_manager_entity.get_child_entity_with_property_value(ENTITY_PROPERTY_NAME, ENTITY_STATIC_WORLD_SETTINGS);
        this.world_admin_entity = this.static_worlds_manager_entity.get_child_entity_with_property_value(ENTITY_PROPERTY_NAME, ENTITY_STATIC_WORLD_ADMIN);

        // Create the static worlds needed.
        this.world_home     = new HomeWorld(world_home_entity);
        this.world_settings = new SettingsWorld(world_settings_entity);
        this.world_admin    = new AdminWorld(world_admin_entity);

        this.create_world(this.world_home);
        this.create_world(this.world_settings);
        this.create_world(this.world_admin);

        // Create the dynamic worlds needed.
        // Iterate through the children of this entity. They each are a created world.
        var dynamic_worlds = this.dynamic_worlds_manager_entity.get_children();
        for (var c = 0; c < dynamic_worlds.length; c++) {
            var created_world_entity = dynamic_worlds[c];

            var created_world = new DynamicWorld(created_world_entity);

            // TODO : In the future only create the created worlds on first teleport into them! This will require significant refactoring though.
            this.create_world(created_world);
            this.add_dynamic_world(created_world);
        }

        this.all_dynamic_worlds_loaded();
        this.load_all_dynamic_content();
        //this.load_schedule_content();
        this.link_all_entities_for_notifications();

        // All initial loading is completed so place the player into the home world.
        this.set_current_world(this.world_home);
        GUI_PAUSED_MENU.make_invisible();
        CURRENT_PLAYER.set_state(PLAYER_STATE_FULL_CONTROL);
    },

    /*__                         __           __   __        __   __                           __   ___        ___      ___
     |  \ \ / |\ |  /\   |\/| | /  `    |  | /  \ |__) |    |  \ /__`     |\/|  /\  |\ |  /\  / _` |__   |\/| |__  |\ |  |
     |__/  |  | \| /~~\  |  | | \__,    |/\| \__/ |  \ |___ |__/ .__/     |  | /~~\ | \| /~~\ \__> |___  |  | |___ | \|  |  */
    update_world_name_for_teleport_buttons: function(dynamic_world) {
        this.update_or_add_dynamic_world_to_all_other_dynamic_worlds_teleport_menu(dynamic_world);

        this.world_home.player_menu.update_or_add_personal_teleport_button(dynamic_world);
        this.world_settings.player_menu.update_or_add_personal_teleport_button(dynamic_world);
        this.world_admin.player_menu.update_or_add_personal_teleport_button(dynamic_world);
    },

    all_dynamic_worlds_loaded: function() {
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {

                for (var inner_relative_id in this.dynamic_worlds) {
                    if (this.dynamic_worlds.hasOwnProperty(inner_relative_id)) {
                        if (inner_relative_id !== relative_id) {
                            this.dynamic_worlds[inner_relative_id].player_menu.add_personal_teleport_button(this.dynamic_worlds[relative_id]);
                        }
                    }
                }
            }
        }
    },

    add_dynamic_world_to_static_teleport_menu: function(dynamic_world) {
        this.world_home.player_menu.add_personal_teleport_button(dynamic_world);
        this.world_settings.player_menu.add_personal_teleport_button(dynamic_world);
        this.world_admin.player_menu.add_personal_teleport_button(dynamic_world);
    },

    update_or_add_dynamic_world_to_all_other_dynamic_worlds_teleport_menu: function(dynamic_world) {
        var world_relative_id = (dynamic_world.entity.get_relative_id()).toString();

        // Update all dynamic worlds with the new teleport name.
        for (var relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {
                if (world_relative_id !== relative_id) {

                    this.dynamic_worlds[relative_id].player_menu.update_or_add_personal_teleport_button(dynamic_world);
                }
            }
        }
    },

    add_dynamic_world: function(dynamic_world) {
        this.dynamic_worlds[dynamic_world.entity.get_relative_id()] = dynamic_world;
        this.add_dynamic_world_to_static_teleport_menu(dynamic_world);
    },

    _create_new_dynamic_world: function() {
        // Create a new created world Entity.
        var dynamic_world_entity = new Entity();
        dynamic_world_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_DYNAMIC_WORLD);

        this.dynamic_worlds_manager_entity.add_child(dynamic_world_entity);

        var dynamic_world = new DynamicWorld(dynamic_world_entity);
        this.create_world(dynamic_world);
        this.set_current_world(dynamic_world);
        this.add_dynamic_world(dynamic_world);

        this.update_or_add_dynamic_world_to_all_other_dynamic_worlds_teleport_menu(dynamic_world);

        // Add all other dynamic worlds as a teleport button for this dynamic world.
        var relative_id = dynamic_world_entity.get_relative_id().toString();
        for (var other_relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(other_relative_id)) {
                if (other_relative_id !== relative_id) {
                    dynamic_world.player_menu.update_or_add_personal_teleport_button(this.dynamic_worlds[other_relative_id]);
                }
            }
        }
    },

    create_new_dynamic_world: function() {
        MANAGER_WORLD._create_new_dynamic_world();
    }

};


