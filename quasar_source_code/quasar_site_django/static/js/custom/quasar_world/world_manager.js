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

        this.planet_title = new Floating3DText(600, world.planet_name, TYPE_SUPER_TITLE);
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

const TEXTURE_URL_BASE = '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/';
const TEXTURE_URL_SKYBOX = TEXTURE_URL_BASE + 'skybox/skybox_texture_';
const TEXTURE_URL_CURSOR = TEXTURE_URL_BASE + 'cursors/';

// TODO : Eventually make this into a configurable setting.
const CURSOR_DEFAULT_OPACITY = 0.90;

// TODO : Eventually make this into a configurable setting.
const SKYBOX_DEFAULT_OPACITY = 0.50;

WorldManager.prototype = {
    previous_world : null,
    current_world  : null,
    current_scene  : null,

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

        this.sky_box_textures = [];
        this.final_textures = [];
        this.number_of_sky_box_textures_loaded = 0;

        // The textures to load.
        this.textures_to_load = [];
        // First load the cursors.
        this.textures_to_load.push(TEXTURE_URL_CURSOR + CURSOR_TYPE_HORIZONTAL);
        this.textures_to_load.push(TEXTURE_URL_CURSOR + CURSOR_TYPE_VERTICAL);
        this.textures_to_load.push(TEXTURE_URL_CURSOR + CURSOR_TYPE_HAND);
        this.textures_to_load.push(TEXTURE_URL_CURSOR + CURSOR_TYPE_POINTER);
        this.textures_to_load.push(TEXTURE_URL_CURSOR + CURSOR_TYPE_LARGER);
        this.textures_to_load.push(TEXTURE_URL_CURSOR + CURSOR_TYPE_MOUSE);
        // Next load the skybox textures.
        this.textures_to_load.push(TEXTURE_URL_SKYBOX + SKYBOX_FRONT);
        this.textures_to_load.push(TEXTURE_URL_SKYBOX + SKYBOX_BACK);
        this.textures_to_load.push(TEXTURE_URL_SKYBOX + SKYBOX_TOP);
        this.textures_to_load.push(TEXTURE_URL_SKYBOX + SKYBOX_BOTTOM);
        this.textures_to_load.push(TEXTURE_URL_SKYBOX + SKYBOX_RIGHT);
        this.textures_to_load.push(TEXTURE_URL_SKYBOX + SKYBOX_LEFT);

        // TODO : Eventually give this to some sort of loading/ajax manager.
        this.load_textures();
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
    },

    create_sky_boxes: function() {
        for (var i = 0; i < 6; i++) {
            this.final_textures.push(null);
            for (var j = 0; j < 6; j++) {
                if (this.sky_box_textures[j][1] === i) {
                    this.final_textures[i] = this.sky_box_textures[j][0];
                }
            }
        }
        this.world_login.add_sky_box(this.final_textures);
        this.world_home.add_sky_box(this.final_textures);
        this.world_settings.add_sky_box(this.final_textures);
    },

    texture_loaded: function(texture, texture_name) {
        if (texture.includes('skybox')) {
            var position = -1;
            if (texture_name.includes(SKYBOX_FRONT)) {
                position = 0;
            } else if (texture_name.includes(SKYBOX_BACK)) {
                position = 1;
            } else if (texture_name.includes(SKYBOX_TOP)) {
                position = 2;
            } else if (texture_name.includes(SKYBOX_BOTTOM)) {
                position = 3;
            } else if (texture_name.includes(SKYBOX_RIGHT)) {
                position = 4;
            } else if (texture_name.includes(SKYBOX_LEFT)) {
                position = 5;
            }
            this.sky_box_textures.push([new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: SKYBOX_DEFAULT_OPACITY}), position]);

            this.number_of_sky_box_textures_loaded += 1;
            if (this.number_of_sky_box_textures_loaded === 6) {
                this.create_sky_boxes();
            }

        } else if (texture.includes('cursors')) {
            var cursor_material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: CURSOR_DEFAULT_OPACITY});
            this.world_login.provide_cursor_material(cursor_material, texture_name);
            this.world_home.provide_cursor_material(cursor_material, texture_name);
            this.world_settings.provide_cursor_material(cursor_material, texture_name);
        }
    },

    load_textures: function() {
        for (var t = 0; t < this.textures_to_load.length; t++) {

            this.current_texture_name = this.textures_to_load[t];

            new THREE.TextureLoader().load(this.current_texture_name,
                //function when resource is loaded
                function(texture) {
                    this.texture_loaded(texture, this.current_texture_name);
                }.bind(this),
                // FOR_DEV_START
                function(xhr) {
                    l((xhr.loaded / xhr.total * 100) + '% loaded for texture file.');
                },
                function(xhr) {
                    l(xhr);
                });
            // FOR_DEV_END
        }
    }
};
