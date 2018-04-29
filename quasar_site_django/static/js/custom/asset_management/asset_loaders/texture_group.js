'use strict';

function TextureGroup(texture_group, loading_manager, fully_loaded_callback) {
    this.__init__(texture_group, loading_manager, fully_loaded_callback);
}

TextureGroup.prototype = {

    __init__: function(texture_group, loading_manager, fully_loaded_callback) {
        this._texture_group = texture_group;

        // Inherit.
        //AssetLoaderGroup.call(this, ASSET_GROUP_TEXTURE + this._texture_group, loading_manager, fully_loaded_callback);
        ManagerManager.prototype.AssetLoaderGroup.call(this, ASSET_GROUP_TEXTURE + this._texture_group, loading_manager, fully_loaded_callback);

        this.loader_class  = THREE.TextureLoader;
        this.send_asset_to = MANAGER_TEXTURE.set_texture;
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
    _add_required_initial_assets: function(callback) {
        switch (this._texture_group) {
        case TEXTURE_GROUP_SKYBOX:
            this._add_required_initial_asset(SKYBOX_FRONT);
            this._add_required_initial_asset(SKYBOX_BACK);
            this._add_required_initial_asset(SKYBOX_TOP);
            this._add_required_initial_asset(SKYBOX_BOTTOM);
            this._add_required_initial_asset(SKYBOX_RIGHT);
            this._add_required_initial_asset(SKYBOX_LEFT);
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