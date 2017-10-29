'use strict'

function WorldManager() {
    this.__init__()
}

function Planet(x, y, z) {
    this.__init__(x, y, z)
}

Planet.prototype = {
    geometry: null,
    material: null,
    mesh    : null,

    __init__: function(planet_position) {
        this.geometry = new THREE.DodecahedronGeometry(200, 2)
        this.material = new THREE.MeshBasicMaterial({
            color: 0x8effcb, // '0x8effcb'
            side: THREE.DoubleSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(x, y, z)
    }
}

WorldManager.prototype = {

    player         : null,

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
        this.world_login = new LoginWorld()
        this.world_home = new HomeWorld()
        this.world_settings = new SettingsWorld()

        this.sky_box_textures = []
        this.final_textures = []
        this.number_of_sky_box_textures_loaded = 0
        this.load_sky_box()


        this.planet_settings = new Planet(1000, 1000, 1000)
        this.planet_home = new Planet(1000, 1000, -1000)
        this.planet_login = new Planet(-1000, 1000, 1000)

        this.world_home.add_to_scene(this.planet_settings.mesh)
        this.world_home.add_to_scene(this.planet_login.mesh)
        this.world_home.add_to_scene(this.planet_home.mesh)

        this.world_settings.add_to_scene(this.planet_home.mesh)
    },

    set_player: function(player) {
        this.player = player
        this.world_login.set_player(player)
        this.world_home.set_player(player)
    },

    update_current_scene: function() {
        this.current_world.update()
    },

    set_current_world: function(world) {
        if (this.current_world !== null) {

            // Before exiting the world make sure to remove the camera reference.
            this.current_world.remove_from_scene(this.player.fps_controls.yaw)

            this.current_world.exit_world()
            this.current_world.current_world = false
            this.previous_world = this.current_world
        }
        this.current_world = world
        this.current_world.current_world = true
        this.current_scene = this.current_world.scene

        // Before adding the world make sure to add the camera reference.
        this.current_world.add_to_scene(this.player.fps_controls.yaw)
        this.current_world.enter_world()
    },

    key_down_event: function(event) {
        this.current_world.key_down_event(event)
    },

    add_to_current_scene: function(object) {
        this.current_world.add(object)
    },

    add_to_all_scenes: function(object) {
        this.world_login.add_to_scene(object)
        this.world_home.add_to_scene(object)
    },

    // Skybox
    create_sky_boxes: function() {
        for (var i = 0; i < 6; i++) {
            this.final_textures.push(null)
            for (var j = 0; j < 6; j++) {
                if (this.sky_box_textures[j][1] === i) {
                    this.final_textures[i] = this.sky_box_textures[j][0]
                }
            }
        }

        this.world_login.add_sky_box(this.final_textures)
        this.world_home.add_sky_box(this.final_textures)
        //this.world_settings.add_sky_box(skybox_materials)
    },

    load_sky_box: function() {
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_front.jpg')
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_back.jpg')
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_top.jpg')
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_bottom.jpg')
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_right.jpg')
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_left.jpg')
    },

    texture_was_loaded: function() {
        this.number_of_sky_box_textures_loaded += 1
        if (this.number_of_sky_box_textures_loaded == 6) {
            this.create_sky_boxes()
        }
    },

    // TODO : Add error checking.
    load_specific_texture: function(texture_url) {
        var position = -1
        if (texture_url.includes('front')) {
            position = 0
        } else if (texture_url.includes('back')) {
            position = 1
        } else if (texture_url.includes('top')) {
            position = 2
        } else if (texture_url.includes('bottom')) {
            position = 3
        } else if (texture_url.includes('right')) {
            position = 4
        } else if (texture_url.includes('left')) {
            position = 5
        }

        new THREE.TextureLoader().load(texture_url,
            //function when resource is loaded
            function(texture) {
                this.sky_box_textures.push([new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.45}), position])
                l('loaded texture!')
                //console.log(variable_to_map_to)
                this.texture_was_loaded()
            }.bind(this),
            function(xhr) {
                l((xhr.loaded / xhr.total * 100) + '% loaded for texture file.')
            },
            function(xhr) {
                l(xhr)
            }
        )
    }

}
