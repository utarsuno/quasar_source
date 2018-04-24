'use strict';

function TextureGroup(texture_group, loading_manager, fully_loaded_callback) {
    this.__init__(texture_group, loading_manager, fully_loaded_callback);
}

TextureGroup.prototype = {

    __init__: function(texture_group, loading_manager, fully_loaded_callback) {
        this._texture_group = texture_group;

        // Inherit.
        AssetLoaderGroup.call(this, ASSET_GROUP_TEXTURE + this._texture_group, loading_manager, fully_loaded_callback);

        this.loader_class = THREE.TextureLoader;
        this.send_asset_to = MANAGER_TEXTURE.set_texture;
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
        case TEXTURE_GROUP_TRANSITION:
            this._add_required_initial_asset(TRANSITION_GRID);
            break;
        case TEXTURE_GROUP_SPRITESHEET:
            this._add_required_initial_asset(SPRITESHEET_ICONS);
            break;
        }
        callback();
    }
};