'use strict'

function WorldManager() {
    this.__init__()
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
    SKY_BOX_TEXTURE_FRONT  : null,
    SKY_BOX_TEXTURE_BACK   : null,
    SKY_BOX_TEXTURE_LEFT   : null,
    SKY_BOX_TEXTURE_RIGHT  : null,
    SKY_BOX_TEXTURE_BOTTOM : null,
    SKY_BOX_TEXTURE_TOP    : null,
    number_of_sky_box_textures_loaded: null,

    __init__: function() {
        this.world_login = new LoginWorld()
        this.world_home = new HomeWorld()

        this.number_of_sky_box_textures_loaded = 0
        this.load_sky_box()
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
        var skybox_materials = [this.SKY_BOX_TEXTURE_FRONT, this.SKY_BOX_TEXTURE_BACK, this.SKY_BOX_TEXTURE_TOP, this.SKY_BOX_TEXTURE_BOTTOM, this.SKY_BOX_TEXTURE_RIGHT, this.SKY_BOX_TEXTURE_LEFT]
        this.world_login.add_sky_box(skybox_materials)
    },

    load_sky_box: function() {
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_front.jp2', this.SKY_BOX_TEXTURE_FRONT).bind(this)
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_back.jp2', this.SKY_BOX_TEXTURE_BACK).bind(this)
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_top.jp2', this.SKY_BOX_TEXTURE_TOP).bind(this)
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_bottom.jp2', this.SKY_BOX_TEXTURE_BOTTOM).bind(this)
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_right.jp2', this.SKY_BOX_TEXTURE_RIGHT).bind(this)
        this.load_specific_texture('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_left.jp2', this.SKY_BOX_TEXTURE_LEFT).bind(this)
    },

    // TODO : Add error checking.
    load_specific_texture: function(texture_url, variable_to_map_to) {
        var ta = new THREE.TextureLoader().load(texture_url,
        //function when resource is loaded
            function(texture) {
                variable_to_map_to = new THREE.MeshBasicMaterial({map: texture})
                this.number_of_sky_box_textures_loaded += 1
                if (this.number_of_sky_box_textures_loaded == 6) {
                    this.create_sky_boxes()
                }
            }
        )
    },


// TODO : Add error checking.
//var SKY_BOX_MATERIALS = []

function texture_loaded(data) {

}

function load_specific_texture(texture_url, texture_to_map_to) {

}

function load_sky_box() {

    var ta = new THREE.TextureLoader().load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_front.jp2',
    //function when resource is loaded
        function(texture) {
            var material = new THREE.MeshBasicMaterial({map: texture})
        }
    )

    var a = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(''), side: THREE.DoubleSide})
    var b = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_back.jp2'), side: THREE.DoubleSide})
    var c = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_top.jp2'), side: THREE.DoubleSide})
    var d = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_bottom.jp2'), side: THREE.DoubleSide})
    var e = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_right.jp2'), side: THREE.DoubleSide})
    var f = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/skybox/skybox_texture_left.jp2'), side: THREE.DoubleSide})
    return [a, b, c, d, e, f]
}

/*
        this.loader = new THREE.AudioLoader()
        this.loader.load(

            // resource URL
            '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/audio/typing_sound.wav',
            // Function when resource is loaded
            function (audio_buffer) {
                this.typing_sound.setBuffer(audio_buffer)
                this.typing_sound.setVolume(0.33)
                this.typing_sound_loaded = true
                this.notify_player()
            }.bind(this),

            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded for audio file.')
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened trying to load the audio file.')
            }

        )

 */


}