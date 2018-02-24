'use strict';

function TextureGroup(texture_group, loading_manager, fully_loaded_callback) {
    this.__init__(texture_group, loading_manager, fully_loaded_callback);
}

TextureGroup.prototype = {

    __init__: function(texture_group, loading_manager, fully_loaded_callback) {
        this._texture_group = texture_group;

        // Inherit.
        AssetGroup.call(this, ASSET_GROUP_TEXTURE + '/' + this._texture_group, loading_manager, fully_loaded_callback);
    },

    _texture_loaded: function(texture, asset_name) {
        MANAGER_TEXTURE.set_texture(this._texture_group, asset_name, texture);
        this._asset_loaded(asset_name);
    },

    load_textures: function() {
        for (var asset in this._assets) {
            if (this._assets.hasOwnProperty(asset)) {

                var loader = new THREE.TextureLoader();
                loader.load(this._asset_base_url + asset,

                    function(texture) {
                        this._texture_loaded(arguments[1], arguments[0]);
                    }.bind(this, asset),

                    function(xhr) {
                        // On success load.
                    },

                    function(xhr) {
                        l('Error loading asset : ' + arguments[0]);
                    }.bind(this, asset)

                );

            }
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
    _add_required_initial_assets: function(callback) {
        switch (this._texture_group) {
        case TEXTURE_GROUP_CURSOR:
            this._add_required_initial_asset(CURSOR_TYPE_HORIZONTAL);
            this._add_required_initial_asset(CURSOR_TYPE_VERTICAL);
            this._add_required_initial_asset(CURSOR_TYPE_HAND);
            this._add_required_initial_asset(CURSOR_TYPE_POINTER);
            this._add_required_initial_asset(CURSOR_TYPE_LARGER);
            this._add_required_initial_asset(CURSOR_TYPE_MOUSE);
            break;
        case TEXTURE_GROUP_SKYBOX:
            this._add_required_initial_asset(SKYBOX_FRONT);
            this._add_required_initial_asset(SKYBOX_BACK);
            this._add_required_initial_asset(SKYBOX_TOP);
            this._add_required_initial_asset(SKYBOX_BOTTOM);
            this._add_required_initial_asset(SKYBOX_RIGHT);
            this._add_required_initial_asset(SKYBOX_LEFT);
            break;
        case TEXTURE_GROUP_ICONS:
            this._add_required_initial_asset(ICON_STAR);
            this._add_required_initial_asset(ICON_EXIT);
            this._add_required_initial_asset(ICON_SETTINGS);
            this._add_required_initial_asset(ICON_ENTITY_GROUP);
            this._add_required_initial_asset(ICON_HOME);
            this._add_required_initial_asset(ICON_MULTI_PLAYER);
            this._add_required_initial_asset(ICON_SAVE);
            this._add_required_initial_asset(ICON_FULLSCREEN);
            this._add_required_initial_asset(ICON_LEFT);
            this._add_required_initial_asset(ICON_RIGHT);
            this._add_required_initial_asset(ICON_CROSS);
            this._add_required_initial_asset(ICON_LOCKED);
            this._add_required_initial_asset(ICON_UNLOCKED);
            this._add_required_initial_asset(ICON_WORLDS);
            this._add_required_initial_asset(ICON_WARNING);
            this._add_required_initial_asset(ICON_TELEPORT);
            this._add_required_initial_asset(ICON_CHECKMARK);
            this._add_required_initial_asset(ICON_SINGLE_PLAYER);
            this._add_required_initial_asset(ICON_WRENCH);
            this._add_required_initial_asset(ICON_IMPORT);
            this._add_required_initial_asset(ICON_INFORMATION);
            this._add_required_initial_asset(ICON_MOVIE);
            this._add_required_initial_asset(ICON_MENU_LIST);
            break;
        }
        callback();
    }
};