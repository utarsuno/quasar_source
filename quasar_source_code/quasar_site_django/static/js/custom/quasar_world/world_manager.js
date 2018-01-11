'use strict';

function WorldManager() {
    this.__init__();
}

function Planet(world, x, y, z) {
    this.__init__(world, x, y, z);
}

Planet.prototype = {
    geometry: null,
    material: null,
    mesh    : null,
    object3D: null,

    __init__: function(world, x, y, z) {
        this.world = world;

        this.planet_title = new Floating3DText(world.planet_name, TYPE_SUPER_TITLE);
        this.planet_title.update_position_and_look_at_origin(new THREE.Vector3(x, y - 500, z), new THREE.Vector3(0, 0, 0));

        this.geometry = new THREE.DodecahedronGeometry(200, 2);

        this.material = new THREE.MeshBasicMaterial({
            color: COLOR_PLANET[COLOR_HEX_INDEX],
            // TODO : Figure out if I should use front side or back side.
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);

        this.mesh.material.color.setHex(COLOR_PLANET[COLOR_HEX_INDEX]);
        this.planet_title.update_color(COLOR_PLANET);

        this.object3D = new THREE.Object3D();
        this.object3D.add(this.mesh);

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.uses_cursor = false;
    },

    add_this_planet_to_world: function(world) {
        world.add_to_scene(this.object3D);
        world.add_interactive_object(this);
        world.add_to_scene(this.planet_title.object3D);
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            this.mesh.material.color.setHex(COLOR_HIGHLIGHT[COLOR_HEX_INDEX]);
            this.mesh.material.needsUpdate = true;
            this.planet_title.update_color(COLOR_HIGHLIGHT);
        } else {
            this.mesh.material.color.setHex(COLOR_PLANET[COLOR_HEX_INDEX]);
            this.mesh.material.needsUpdate = true;
            this.planet_title.update_color(COLOR_PLANET);
        }
    },

    state_change_engage: function(being_engaged_with) {
        if (being_engaged_with) {
            MANAGER_WORLD.set_current_world(this.world);
            this.being_engaged_with = false;
        } else {
            CURRENT_PLAYER.disengage();
        }
    }
};

WorldManager.prototype = {
    previous_world : null,
    current_world  : null,
    current_scene  : null,

    current_player_menu: null,

    // Pre-defined worlds.
    world_login    : null,
    world_home     : null,
    world_settings : null,

    // Skybox
    number_of_sky_box_textures_loaded: null,
    sky_box_textures: null,

    __init__: function() {
        this.world_login = new LoginWorld();
        this.world_home = new HomeWorld();
        this.world_settings = new SettingsWorld();
    },

    set_player_and_current_world: function(current_world) {
        this.world_login.set_player();
        this.world_home.set_player();
        this.world_settings.set_player();

        this.planet_settings = new Planet(this.world_settings, 4000, 4000, 4000);
        this.planet_home = new Planet(this.world_home, 4000, 4000, -4000);
        this.planet_login = new Planet(this.world_login, -4000, 4000, 4000);

        this.planet_settings.add_this_planet_to_world(this.world_home);
        this.planet_home.add_this_planet_to_world(this.world_settings);

        this.set_current_world(current_world);
    },

    update_current_scene: function() {
        this.current_world.update();
        this.current_world.floating_cursor.update();
    },

    set_current_world: function(world) {
        if (this.current_world !== null) {
            // Before exiting the world make sure to remove the camera reference.
            this.current_world.remove_from_scene(CURRENT_PLAYER.fps_controls.yaw);

            this.current_world.exit_world();
            this.current_world.current_world = false;
            this.previous_world = this.current_world;
        }
        this.current_world = world;
        this.current_floating_cursor = this.current_world.floating_cursor;
        this.current_player_menu = this.current_world.player_menu;
        this.current_world.current_world = true;
        this.current_scene = this.current_world.scene;

        // Before adding the world make sure to add the camera reference.
        this.current_world.add_to_scene(CURRENT_PLAYER.fps_controls.yaw);
        this.current_world.enter_world();
    },

    key_down_event: function(event) {
        this.current_world.key_down_event(event);
    },

    add_to_current_scene: function(object) {
        this.current_world.add(object);
    },

    add_to_all_scenes: function(object) {
        this.world_login.add_to_scene(object);
        this.world_home.add_to_scene(object);
    }

};
