'use strict';

// TODO : Eventually make this into a configurable setting.
const CURSOR_DEFAULT_OPACITY = 0.90;

// TODO : Eventually make this into a configurable setting.
const SKYBOX_DEFAULT_OPACITY = 0.50;

// Utility variables.
const INDEX_FULL_URL        = 0;
const INDEX_RESOURCE_NAME   = 1;
const INDEX_RESOURCE        = 2;

/*          __     __
  /\  |  | |  \ | /  \
 /~~\ \__/ |__/ | \__/ */
const AUDIO_URL_BASE   = '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/audio/';

function AudioGroup(loaded_callback, loading_manager) {
    this.__init__(loaded_callback, loading_manager);
}

AudioGroup.prototype = {
    __init__: function(loaded_callback, loading_manager) {
        this._loading_manager = loading_manager;
        this._loaded_callback = loaded_callback;
        this._audio_buffers   = [];
        this._add_audio_buffers_needed();
        this._number_of_audio_buffers_to_load = this._audio_buffers.length;
        this._number_of_audio_buffers_loaded = 0;

        this._loading_manager._number_of_resources_to_load += this._number_of_audio_buffers_to_load;

        this.finished_loading = false;
    },

    _audio_buffer_loaded: function(audio_buffer, audio_name) {
        MANAGER_AUDIO.set_audio(audio_name, audio_buffer);

        for (var a = 0; a < this._number_of_audio_buffers_to_load; a++) {
            if (this._audio_buffers[a][INDEX_RESOURCE_NAME] === audio_name) {
                this._audio_buffers[a][INDEX_RESOURCE] = audio_buffer;
                this._number_of_audio_buffers_loaded += 1;
                this._loading_manager.update_text('Loaded ' + audio_name);
                break;
            }
        }
        if (this._number_of_audio_buffers_loaded === this._number_of_audio_buffers_to_load) {
            this.finished_loading = true;
            this._loaded_callback();
        }
    },

    load_audio_buffers: function() {
        for (var a = 0; a < this._number_of_audio_buffers_to_load; a++) {

            var loader = new THREE.AudioLoader();
            loader.load(this._audio_buffers[a][INDEX_FULL_URL],

                // Function when resource is loaded
                function (audio_buffer) {
                    this._audio_buffer_loaded(arguments[1], arguments[0]);
                }.bind(this, this._audio_buffers[a][INDEX_RESOURCE_NAME]),

                // Function called when download progresses
                function (xhr) {
                // FOR_DEV_START
                //l((xhr.loaded / xhr.total * 100) + '% loaded for audio file.');
                // FOR_DEV_END
                },
                // Function called when download errors
                function (xhr) {
                // FOR_DEV_START
                //l('An error happened trying to load the audio file.');
                // FOR_DEV_END
                }
            );
        }
    },

    _add_audio_buffers_needed: function() {
        // For now there are no audio types.
        this._audio_buffers.push([AUDIO_URL_BASE + AUDIO_TYPING_SOUND, AUDIO_TYPING_SOUND, null]);
    }
};

/*___  ___     ___       __   ___  __
   |  |__  \_/  |  |  | |__) |__  /__`
   |  |___ / \  |  \__/ |  \ |___ .__/ */
const TEXTURE_URL_BASE = '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/';

function TextureGroup(texture_group, loaded_callback, loading_manager) {
    this.__init__(texture_group, loaded_callback, loading_manager);
}

TextureGroup.prototype = {
    __init__: function(texture_group, loaded_callback, loading_manager) {
        this._loading_manager  = loading_manager;
        this._loaded_callback  = loaded_callback;
        this._texture_group    = texture_group;
        this._texture_base_url = TEXTURE_URL_BASE + this._texture_group;
        this._textures = [];
        this._add_textures_needed();
        this._number_of_textures_to_load = this._textures.length;
        this._number_of_loaded_textures = 0;

        this._loading_manager._number_of_resources_to_load += this._number_of_textures_to_load;

        this.finished_loading = false;
    },

    get_texture: function(texture_name) {
        for (var t = 0; t < this._number_of_textures_to_load; t++) {
            if (this._textures[t][INDEX_RESOURCE_NAME] === texture_name) {
                return this._textures[t][INDEX_RESOURCE];
            }
        }
    },

    load_textures: function() {
        for (var t = 0; t < this._textures.length; t++) {

            new THREE.TextureLoader().load(this._textures[t][INDEX_FULL_URL],
                //function when resource is loaded
                function(texture) {
                    this._texture_loaded(arguments[1], arguments[0]);
                }.bind(this, this._textures[t][INDEX_RESOURCE_NAME]),
                // FOR_DEV_START
                function(xhr) {
                    l((xhr.loaded / xhr.total * 100) + '% loaded for texture file.');
                },
                function(xhr) {
                    l(xhr);
                });
            // FOR_DEV_END
        }

    },

    _texture_loaded: function(texture, texture_name) {
        for (var t = 0; t < this._number_of_textures_to_load; t++) {
            if (this._textures[t][INDEX_RESOURCE_NAME] === texture_name) {
                this._textures[t][INDEX_RESOURCE] = texture;
                this._number_of_loaded_textures += 1;
                this._loading_manager.update_text('loaded ' + texture_name);
                break;
            }
        }
        if (this._number_of_loaded_textures === this._number_of_textures_to_load) {
            this.finished_loading = true;
            this._loaded_callback();
        }
    },

    _add_texture_needed: function(texture_name) {
        this._textures.push([this._texture_base_url + texture_name, texture_name, null]);
    },

    _add_textures_needed: function() {
        switch (this._texture_group) {
        case TEXTURE_GROUP_CURSOR:
            this._add_texture_needed(CURSOR_TYPE_HORIZONTAL);
            this._add_texture_needed(CURSOR_TYPE_VERTICAL);
            this._add_texture_needed(CURSOR_TYPE_HAND);
            this._add_texture_needed(CURSOR_TYPE_POINTER);
            this._add_texture_needed(CURSOR_TYPE_LARGER);
            this._add_texture_needed(CURSOR_TYPE_MOUSE);
            break;
        case TEXTURE_GROUP_SKYBOX:
            this._add_texture_needed(SKYBOX_FRONT);
            this._add_texture_needed(SKYBOX_BACK);
            this._add_texture_needed(SKYBOX_TOP);
            this._add_texture_needed(SKYBOX_BOTTOM);
            this._add_texture_needed(SKYBOX_RIGHT);
            this._add_texture_needed(SKYBOX_LEFT);
            break;
        case TEXTURE_GROUP_ICONS:
            this._add_texture_needed(ICON_STAR);
            this._add_texture_needed(ICON_EXIT);
            this._add_texture_needed(ICON_SETTINGS);
            this._add_texture_needed(ICON_ENTITY_GROUP);
            this._add_texture_needed(ICON_HOME);
            this._add_texture_needed(ICON_MULTI_PLAYER);
            this._add_texture_needed(ICON_SAVE);
            this._add_texture_needed(ICON_FULLSCREEN);
            this._add_texture_needed(ICON_LEFT);
            this._add_texture_needed(ICON_RIGHT);
            this._add_texture_needed(ICON_CROSS);
            this._add_texture_needed(ICON_LOCKED);
            this._add_texture_needed(ICON_UNLOCKED);
            this._add_texture_needed(ICON_WORLDS);
            this._add_texture_needed(ICON_WARNING);
            this._add_texture_needed(ICON_TELEPORT);
            this._add_texture_needed(ICON_CHECKMARK);
            this._add_texture_needed(ICON_SINGLE_PLAYER);
            this._add_texture_needed(ICON_WRENCH);
            this._add_texture_needed(ICON_IMPORT);
            this._add_texture_needed(ICON_INFORMATION);
            this._add_texture_needed(ICON_MOVIE);
            this._add_texture_needed(ICON_MENU_LIST);

            break;
        }
    }
};

/*     __        __          __                           __   ___  __
 |    /  \  /\  |  \ | |\ | / _`     |\/|  /\  |\ |  /\  / _` |__  |__)
 |___ \__/ /~~\ |__/ | | \| \__>     |  | /~~\ | \| /~~\ \__> |___ |  \ */
function LoadingManager() {
    this.__init__();
}

LoadingManager.prototype = {

    __init__: function() {
        this._currently_creating_world = false;

        this._number_of_resources_to_load = 0;
        this._number_of_resources_loaded  = 0;

        this.textures_cursor = new TextureGroup(TEXTURE_GROUP_CURSOR, this.check_if_initial_resources_loaded.bind(this), this);
        this.textures_skybox = new TextureGroup(TEXTURE_GROUP_SKYBOX, this._skyboxs_loaded.bind(this), this);
        this.textures_icon   = new TextureGroup(TEXTURE_GROUP_ICONS,  this.check_if_initial_resources_loaded.bind(this), this);

        this.all_audio       = new AudioGroup(this.check_if_initial_resources_loaded.bind(this), this);
    },

    update_text: function(text) {
        this._number_of_resources_loaded += 1;
        GUI_PAUSED_MENU.set_text(int((this._number_of_resources_loaded / this._number_of_resources_to_load) * 100.0) + '%');
        GUI_PAUSED_MENU.set_sub_text(text);
        if (this._number_of_resources_loaded === this._number_of_resources_to_load) {
            GUI_PAUSED_MENU.make_visible();
        }
    },

    get_texture_dynamically: function(texture_url, callback) {
        var texture_loader = new THREE.TextureLoader();
        texture_loader.crossOrigin = 'Anonymous';

        l('Get texture dynamically called!');
        l(texture_url);


        texture_loader.load(texture_url,
            function(texture) {
                l('Loaded the texture!');
                l(texture);
                callback(texture);
            },
            function (xhr) {
                // FOR_DEV_START
                l((xhr.loaded / xhr.total * 100) + '% loaded for dynamic texture file.');
                // FOR_DEV_END
            },
            // Function called when download errors
            function (xhr) {
                // FOR_DEV_START
                l('An error happened trying to load the texture file.');
                l(xhr);
                // FOR_DEV_END
            }
        );


        //THREE.ImageUtils.crossOrigin = '';
        //var texture_load_test = THREE.ImageUtils.loadTexture(texture_url);
        //l(texture_load_test);
    },

    get_texture: function(texture_group, texture_name) {
        switch (texture_group) {
        case TEXTURE_GROUP_CURSOR:
            return this.textures_cursor.get_texture(texture_name);
        case TEXTURE_GROUP_ICONS:
            return this.textures_icon.get_texture(texture_name);
        case TEXTURE_GROUP_SKYBOX:
            return this.textures_skybox.get_texture(texture_name);
        }
    },

    /*     __   __                  __        __          __
     |    /  \ / _` | |\ |    |    /  \  /\  |  \ | |\ | / _`
     |___ \__/ \__> | | \|    |___ \__/ /~~\ |__/ | | \| \__> */
    all_entities_loaded: function() {
        MANAGER_CREATED_WORLDS.load();

        MANAGER_WORLD.create_world(MANAGER_WORLD.world_home);

        //if (ENTITY_OWNER.get_account_type() === ACCOUNT_TYPE_SUDO) {
        GUI_PAUSED_MENU.set_sub_text('Creating admin world...');
        MANAGER_WORLD.create_world(MANAGER_WORLD.world_admin);
        //}

        GUI_PAUSED_MENU.set_sub_text('Creating settings world...');
        MANAGER_WORLD.create_world(MANAGER_WORLD.world_settings);

        GUI_PAUSED_MENU.make_invisible();

        MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_home);

        this._currently_creating_world = false;
    },

    perform_login_load: function(username, password) {
        this._currently_creating_world = true;

        GUI_PAUSED_MENU.set_text('Loading!');
        GUI_PAUSED_MENU.set_sub_text('Creating home world...');
        GUI_PAUSED_MENU.make_visible();

        ENTITY_OWNER = new EntityOwner(username, password);
        MANAGER_ENTITY.load_data();
    },

    /*__             __        __              ___                      __        __          __
     /  \ |  |  /\  /__`  /\  |__)    | |\ | |  |  |  /\  |       |    /  \  /\  |  \ | |\ | / _`
     \__X \__/ /~~\ .__/ /~~\ |  \    | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ | | \| \__> */
    perform_initial_load: function(quasar_main_loop) {
        this.quasar_main_loop = quasar_main_loop;

        this.textures_cursor.load_textures();
        this.textures_skybox.load_textures();
        this.textures_icon.load_textures();
        this.all_audio.load_audio_buffers();
    },

    check_if_initial_resources_loaded: function() {
        if (this.textures_cursor.finished_loading && this.textures_skybox.finished_loading && this.textures_icon.finished_loading && this.all_audio.finished_loading) {

            MANAGER_WORLD.create_world(MANAGER_WORLD.world_login);
            MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);

            this.quasar_main_loop.run();
        }
    },

    currently_loading: function() {
        return this._number_of_resources_loaded !== this._number_of_resources_to_load;
    },

    /*__            __   __
     /__` |__/ \ / |__) /  \ \_/
     .__/ |  \  |  |__) \__/ / \ */
    // Gets called once when all the skybox textures get loaded.
    _skyboxs_loaded: function() {
        this.sky_box_material = [];
        // The order of these gets matter.
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_FRONT));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_BACK));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_TOP));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_BOTTOM));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_RIGHT));
        this.sky_box_material.push(this.get_texture(TEXTURE_GROUP_SKYBOX, SKYBOX_LEFT));

        for (var t = 0; t < this.sky_box_material.length; t++) {
            // depthWrite: false, depthTest: false
            this.sky_box_material[t] = new THREE.MeshBasicMaterial({map: this.sky_box_material[t], side: THREE.DoubleSide, transparent: true, opacity: SKYBOX_DEFAULT_OPACITY});
        }
    }

};