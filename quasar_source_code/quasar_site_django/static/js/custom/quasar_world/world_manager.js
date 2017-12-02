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
        this.planet_title.update_position_and_look_at(new THREE.Vector3(x, y - 500, z), new THREE.Vector3(0, 0, 0));

        this.geometry = new THREE.DodecahedronGeometry(200, 2);

        this.material = new THREE.MeshBasicMaterial({
            color: 0x8effcb, // '0x8effcb'
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
        this.load_sky_box();

        this.load_cursors();
    },

    scale_command: function() {
        this.current_world.scale_command();
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

    // Skybox
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

    load_sky_box: function() {
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_front.jpg');
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_back.jpg');
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_top.jpg');
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_bottom.jpg');
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_right.jpg');
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_left.jpg');
    },

    load_cursors: function() {
        this.cursor_texture_down       = null;
        this.cursor_texture_left       = null;
        this.cursor_texture_right      = null;
        this.cursor_texture_up         = null;
        this.cursor_texture_down_left  = null;
        this.cursor_texture_down_right = null;
        this.cursor_texture_up_left    = null;
        this.cursor_texture_up_right   = null;
        this.cursor_texture_hand       = null;
        this.cursor_texture_default    = null;
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/arrowDown.png', 'cursor_texture_down');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/arrowLeft.png', 'cursor_texture_left');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/arrowRight.png', 'cursor_texture_right');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/arrowUp.png', 'cursor_texture_up');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/cursor_hand.png', 'cursor_texture_hand');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/cursor_pointer3D_shadow.png', 'cursor_texture_default');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/downLeft.png', 'cursor_texture_down_left');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/downRight.png', 'cursor_texture_down_right');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/upLeft.png', 'cursor_texture_up_left');
        this.load_cursor_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/cursors/upRight.png', 'cursor_texture_up_right');
    },

    // TODO : Cleanup all the loading logic!

    load_cursor_texture: function(texture_url, variable_to_save_into) {
        new THREE.TextureLoader().load(texture_url,
            //function when resource is loaded
            function(texture) {
                this[variable_to_save_into] = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.45});
                // FOR_DEV_START
                //l('loaded texture!');
                //l(texture_url);
                //l(this[variable_to_save_into]);
                //l('-----\n');
                // FOR_DEV_END
            }.bind(this),
            function(xhr) {
                // FOR_DEV_START
                l((xhr.loaded / xhr.total * 100) + '% loaded for texture file.');
                // FOR_DEV_END
            },
            function(xhr) {
                // FOR_DEV_START
                l(xhr);
                // FOR_DEV_END
            }
        );
    },

    texture_was_loaded: function() {
        this.number_of_sky_box_textures_loaded += 1;
        if (this.number_of_sky_box_textures_loaded == 6) {
            this.create_sky_boxes();
        }
    },

    // TODO : Add error checking.
    load_specific_texture: function(texture_url) {
        var position = -1;
        if (texture_url.includes('front')) {
            position = 0;
        } else if (texture_url.includes('back')) {
            position = 1;
        } else if (texture_url.includes('top')) {
            position = 2;
        } else if (texture_url.includes('bottom')) {
            position = 3;
        } else if (texture_url.includes('right')) {
            position = 4;
        } else if (texture_url.includes('left')) {
            position = 5;
        }

        new THREE.TextureLoader().load(texture_url,
            //function when resource is loaded
            function(texture) {
                this.sky_box_textures.push([new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.45}), position]);
                // FOR_DEV_START
                l('loaded texture!');
                // FOR_DEV_END
                this.texture_was_loaded();
            }.bind(this),
            function(xhr) {
                // FOR_DEV_START
                l((xhr.loaded / xhr.total * 100) + '% loaded for texture file.');
                // FOR_DEV_END
            },
            function(xhr) {
                // FOR_DEV_START
                l(xhr);
                // FOR_DEV_END
            }
        );
    }
};
