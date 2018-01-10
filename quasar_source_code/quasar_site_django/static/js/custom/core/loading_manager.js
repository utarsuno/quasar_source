'use strict';

const TEXTURE_URL_BASE = '/home/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/assets/';

// TODO : Eventually make this into a configurable setting.
const CURSOR_DEFAULT_OPACITY = 0.90;

// TODO : Eventually make this into a configurable setting.
const SKYBOX_DEFAULT_OPACITY = 0.50;

// TODO : make this dynamic.
const NUMBER_OF_SKYBOX_TEXTURES = 6;
const NUMBER_OF_ICON_TEXTURES = 10;

function TextureGroup() {
    this.__init__();
}

// Utility variables.
const INDEX_FULL_URL     = 0;
const INDEX_TEXTURE_NAME = 1;
const INDEX_TEXTURE      = 2;

TextureGroup.prototype = {
    __init__: function(texture_group) {
        this._texture_group    = texture_group;
        this._texture_base_url = TEXTURE_URL_BASE + this._texture_group;
        this._textures = [];
        this._add_textures_needed();
    },

    get_texture: function(texture_name) {
        for (var t = 0; t < this._textures.length; t++) {
            if (this._textures[t][INDEX_TEXTURE_NAME] === texture_name) {
                return this._textures[t][INDEX_TEXTURE];
            }
        }
    },

    texture_loaded: function(texture, texture_name) {
        switch (this._texture_group) {
        case TEXTURE_GROUP_CURSOR:
            var cursor_material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true, opacity: CURSOR_DEFAULT_OPACITY});
            this.world_login.provide_cursor_material(cursor_material, texture_name);
            this.world_home.provide_cursor_material(cursor_material, texture_name);
            this.world_settings.provide_cursor_material(cursor_material, texture_name);
            break;
            case TEXTURE_GROUP_ICONS:
            // TODO : CHANGE THIS
            this.number_of_icons_loaded = 50505050;
            if (this.number_of_icons_loaded === NUMBER_OF_ICON_TEXTURES) {
                // The parameters passed in are the icons not to load.
                this.world_login.player_menu.load_icon_textures([ICON_ENTITY_GROUP, ICON_SAVE, ICON_SETTINGS, ICON_HOME, ICON_MULTIPLAYER]);
                this.world_home.player_menu.load_icon_textures([ICON_HOME]);
                this.world_settings.player_menu.load_icon_textures([ICON_SETTINGS, ICON_ENTITY_GROUP]);
            }
            break;
        }

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
                    l('QUICK TODO : ');
                    l(texture);
                    l('ARG 0');
                    l(arguments[0]);
                    l('ARG 1');
                    l(arguments[1]);
                    this.texture_loaded(arguments[1], arguments[0]);
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

    currently_loading: null,

    __init__: function() {
        this.currently_loading = false;

        this.textures_cursor = new TextureGroup(TEXTURE_GROUP_CURSOR);

        this.textures_skybox = new TextureGroup(TEXTURE_GROUP_SKYBOX);

        this.textures_icon   = new TextureGroup(TEXTURE_GROUP_ICONS);
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
        this.currently_loading = true;


        // TODO : Perform the needed initial loads here!!!


        GUI_PAUSED_MENU.make_visible();
        this.currently_loading = false;
    }

};