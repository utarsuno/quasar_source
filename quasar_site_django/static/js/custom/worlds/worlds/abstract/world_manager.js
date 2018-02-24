'use strict';

function WorldManager() {
    this.__init__();
}

WorldManager.prototype = {
    previous_world : null,
    current_world  : null,

    current_player_menu: null,

    // Pre-defined worlds.
    world_login    : null,
    world_home     : null,
    world_settings : null,

    world_global   : null,

    world_admin    : null,

    __init__: function() {
        this.world_login = new LoginWorld();
        this.world_home = new HomeWorld();
        this.world_settings = new SettingsWorld();
        this.world_admin = new AdminWorld();

        this.created_worlds = [];
    },

    add_created_world: function(created_world, add_to_teleport_menu) {
        // TODO : Only print this for dev mode.
        l('Adding a created world!');
        this.created_worlds.push(created_world);
        if (add_to_teleport_menu) {
            this.add_world_to_teleport_menu(created_world);
        }
    },

    all_created_worlds_loaded: function() {
        for (var w = 0; w < this.created_worlds.length; w++) {
            for (var v = 0; v < this.created_worlds.length; v++) {
                if (w !== v) {
                    this.created_worlds[w].player_menu.add_personal_teleport_button(this.created_worlds[v]);
                }
            }
        }
    },

    //this.world_home.add_css_scene();

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
            }
            if (this.current_world.root_attachables[a].hasOwnProperty('update_all_child_animations_recursively')) {
                this.current_world.root_attachables[a].update_all_child_animations_recursively(delta);
            } else {
                l('Investigate this?');
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
        this.current_floating_cursor = this.current_world.floating_cursor;
        this.current_player_menu = this.current_world.player_menu;

        // Before adding the world make sure to add the camera reference.
        this.current_world.add_to_scene(CURRENT_PLAYER.fps_controls.yaw);
        this.current_world.enter_world();
    },

    key_down_event: function(event) {
        this.current_world.key_down_event_for_interactive_objects(event);
    },

    add_to_all_scenes: function(object) {
        this.world_login.add_to_scene(object);
        this.world_home.add_to_scene(object);
        this.world_settings.add_to_scene(object);

        // TODO : Make sure dynamic worlds are dealt with.
    },

    add_world_to_teleport_menu: function(world) {
        this.world_home.player_menu.add_personal_teleport_button(world);
        this.world_settings.player_menu.add_personal_teleport_button(world);
    },

    create_world: function(world) {
        world.light_delta = 0;
        world.light_delta_cap = 10;
        world.light_radius = 1000;

        world.player_menu.create();
        world.player_menu.set_to_invisible();

        world.floating_cursor.create();

        var skybox_geometry = new THREE.BoxGeometry(22500, 22500, 22500);
        var skybox_cube = new THREE.Mesh(skybox_geometry, MANAGER_LOADING.sky_box_material);
        skybox_cube.position.set(0, 0, 0);
        world.add_to_scene(skybox_cube);

        // Default hex grid ground.
        var grid = new vg.HexGrid({cellSize: 100});
        grid.generate({size: 10});
        var board = new vg.Board(grid);
        board.generateTilemap({cellSize: 100, tileScale: 0.99});
        world.add_to_scene(board.group);

        // Default lights.
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
        /////////////////

        world.light = new THREE.AmbientLight(0xffffff, .25); // soft white light
        world.add_to_scene(world.light);


        // Now finally create the actual world.
        world.create();
    },

    prepare_for_save: function() {
        this.world_home.prepare_for_save();
        // TODO : this.world_settings.prepare_for_save();

        for (var cw = 0; cw < this.created_worlds.length; cw++) {
            this.created_worlds[cw].prepare_for_save();
        }

        MANAGER_ENTITY.update_server_and_database();
    }

};

