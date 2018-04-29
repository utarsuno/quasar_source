'use strict';

ManagerManager.prototype.set_texture_loader = function(loading_manager) {
    function TextureLoader(loading_manager) {
        this.__init__(loading_manager);
    }

    TextureLoader.prototype = {

        __init__: function(loading_manager) {
            // Inherit.
            //AssetLoaderGroup.call(this, ASSET_GROUP_TEXTURE + this._texture_group, loading_manager, fully_loaded_callback);
            ManagerManager.prototype.AssetLoaderGroup.call(this, ASSET_GROUP_TEXTURE, loading_manager);

            this.loader_class  = THREE.TextureLoader;
            this.send_asset_to = MANAGER_TEXTURE.set_texture;
        },

        /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
         | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
         | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
        _add_required_initial_assets: function(callback) {
            this._add_required_initial_asset(SKYBOX_FRONT);
            this._add_required_initial_asset(SKYBOX_BACK);
            this._add_required_initial_asset(SKYBOX_TOP);
            this._add_required_initial_asset(SKYBOX_BOTTOM);
            this._add_required_initial_asset(SKYBOX_RIGHT);
            this._add_required_initial_asset(SKYBOX_LEFT);
            this._add_required_initial_asset(TRANSITION_GRID);
            this._add_required_initial_asset(SPRITESHEET_ICONS);
            callback();
        }
    };

    this.texture_loader = new TextureGroup(loading_manager);
};