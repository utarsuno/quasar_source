'use strict';

const TEXTURE_URL_BASE = '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/';

// TODO : Eventually make this into a configurable setting.
const CURSOR_DEFAULT_OPACITY = 0.90;

// TODO : Eventually make this into a configurable setting.
const SKYBOX_DEFAULT_OPACITY = 0.50;

function TextureGroup(texture_group, loaded_callback, loading_manager) {
    this.__init__(texture_group, loaded_callback, loading_manager);
}

// Utility variables.
const INDEX_FULL_URL     = 0;
const INDEX_TEXTURE_NAME = 1;
const INDEX_TEXTURE      = 2;

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

        this._loading_manager._number_of_textures_to_load += this._number_of_textures_to_load;
    },

    get_texture: function(texture_name) {
        for (var t = 0; t < this._number_of_textures_to_load; t++) {
            if (this._textures[t][INDEX_TEXTURE_NAME] === texture_name) {
                return this._textures[t][INDEX_TEXTURE];
            }
        }
    },

    _texture_loaded: function(texture, texture_full_url) {
        var texture_name = 'missing';
        for (var t = 0; t < this._number_of_textures_to_load; t++) {
            if (this._textures[t][INDEX_TEXTURE_NAME] === texture_full_url) {
                this._textures[t][INDEX_TEXTURE] = texture;
                this._number_of_loaded_textures += 1;

                texture_name = this._textures[t][INDEX_TEXTURE_NAME];
                this._loading_manager.update_text('Loaded ' + texture_name);

                break;
            }
        }

        if (this._number_of_loaded_textures === this._number_of_textures_to_load) {
            this._loaded_callback();
        }

        /*
        switch (this._texture_group) {
        case TEXTURE_GROUP_ICONS:
            if (this._number_of_loaded_textures === this._number_of_textures_to_load) {
                // The parameters passed in are the icons not to load from the set of standard player menu icons.
                MANAGER_WORLD.world_login.player_menu.load_icon_textures([ICON_ENTITY_GROUP, ICON_SAVE, ICON_SETTINGS, ICON_HOME, ICON_MULTIPLAYER]);
                MANAGER_WORLD.world_home.player_menu.load_icon_textures([ICON_HOME]);
                MANAGER_WORLD.world_settings.player_menu.load_icon_textures([ICON_SETTINGS, ICON_ENTITY_GROUP]);
            }
            break;
        }
        */

        /*
        if (texture_name.includes('skybox')) {
            // Skybox.
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
            if (this.number_of_sky_box_textures_loaded === NUMBER_OF_SKYBOX_TEXTURES) {
                this.create_sky_boxes();
            }

        } else if (texture_name.includes('icons')) {
            // Icons.
            this.icon_textures.push([texture, texture_name]);
            this.number_of_icons_loaded += 1;
            if (this.number_of_icons_loaded === NUMBER_OF_ICON_TEXTURES) {
                // The parameters passed in are the icons not to load.
                this.world_login.player_menu.load_icon_textures([ICON_ENTITY_GROUP, ICON_SAVE, ICON_SETTINGS, ICON_HOME, ICON_MULTIPLAYER]);
                this.world_home.player_menu.load_icon_textures([ICON_HOME]);
                this.world_settings.player_menu.load_icon_textures([ICON_SETTINGS, ICON_ENTITY_GROUP]);
            }
        }*/
    },

    load_textures: function() {
        for (var t = 0; t < this._textures.length; t++) {

            new THREE.TextureLoader().load(this._textures[t][INDEX_FULL_URL],
                //function when resource is loaded
                function(texture) {
                    this._texture_loaded(arguments[1], arguments[0]);
                }.bind(this, this._textures[t][INDEX_TEXTURE_NAME]),
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
            this._add_texture_needed(ICON_EXIT);
            this._add_texture_needed(ICON_SETTINGS);
            this._add_texture_needed(ICON_ENTITY_GROUP);
            this._add_texture_needed(ICON_HOME);
            this._add_texture_needed(ICON_MULTIPLAYER);
            this._add_texture_needed(ICON_SAVE);
            this._add_texture_needed(ICON_FULLSCREEN);
            this._add_texture_needed(ICON_LEFT);
            this._add_texture_needed(ICON_RIGHT);
            this._add_texture_needed(ICON_CROSS);
            this._add_texture_needed(ICON_LOCKED);
            this._add_texture_needed(ICON_UNLOCKED);
            this._add_texture_needed(ICON_WORLDS);
            this._add_texture_needed(ICON_WARNING);
            break;
        }
    }
};

function LoadingManager() {
    this.__init__();
}

LoadingManager.prototype = {

    _cursors_loaded: function() {
        MANAGER_WORLD.world_login.player_menu.load_icon_textures([ICON_ENTITY_GROUP, ICON_SAVE, ICON_SETTINGS, ICON_HOME, ICON_MULTIPLAYER]);
        MANAGER_WORLD.world_home.player_menu.load_icon_textures([ICON_HOME]);
        MANAGER_WORLD.world_settings.player_menu.load_icon_textures([ICON_SETTINGS, ICON_ENTITY_GROUP]);

        l('The cursors loaded!');
    },

    _skyboxs_loaded: function() {
        l('The skyboxs loaded!');
    },

    _icons_loaded: function() {
        l('The icons loaded!');
    },

    __init__: function() {
        this._number_of_textures_to_load = 0;
        this._number_of_textures_loaded  = 0;

        this.textures_cursor = new TextureGroup(TEXTURE_GROUP_CURSOR, this._cursors_loaded.bind(this), this);
        this.textures_skybox = new TextureGroup(TEXTURE_GROUP_SKYBOX, this._skyboxs_loaded.bind(this), this);
        this.textures_icon   = new TextureGroup(TEXTURE_GROUP_ICONS,  this._icons_loaded.bind(this)  , this);


    },

    update_text: function(text) {
        this._number_of_textures_loaded += 1;
        GUI_PAUSED_MENU.set_text(int((this._number_of_textures_loaded / this._number_of_textures_to_load) * 100.0) + '% loaded');
        GUI_PAUSED_MENU.set_sub_text(text);
        if (this._number_of_textures_loaded === this._number_of_textures_to_load) {
            GUI_PAUSED_MENU.make_visible();
        }
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

    // Occurs only once on website start up.
    perform_initial_load: function() {
        l('Performing the initial load!!');

        this.textures_cursor.load_textures();
        this.textures_skybox.load_textures();
        this.textures_icon.load_textures();


        //GUI_PAUSED_MENU.make_visible();
        //this.currently_loading = false;
    },

    currently_loading: function() {
        return this._number_of_textures_loaded !== this._number_of_textures_to_load;
    }

};