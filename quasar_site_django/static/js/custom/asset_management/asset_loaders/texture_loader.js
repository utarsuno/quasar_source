'use strict';

ManagerManager.prototype.set_texture_loader = function(loading_manager) {
    function TextureLoader(loading_manager) {
        this.__init__(loading_manager);
    }

    TextureLoader.prototype = {

        __init__: function(loading_manager) {
            // Inherit.
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
            MANAGER_TEXTURE.set_number_of_total_assets(this._number_of_assets_to_load);
            callback();
        },

        get_asset_path_name: function(asset) {
            l(asset);
            switch(asset) {
            case SPRITESHEET_ICONS:
                return 'spritesheet/i.png';
            case TRANSITION_GRID:
                return 'third_party/t.png';
            case SKYBOX_FRONT:
                return 'skybox/fo.png';
            case SKYBOX_BACK:
                return 'skybox/b.png';
            case SKYBOX_LEFT:
                return 'skybox/l.png';
            case SKYBOX_RIGHT:
                return 'skybox/r.png';
            case SKYBOX_TOP:
                return 'skybox/t.png';
            case SKYBOX_BOTTOM:
                return 'skybox/bo.png';
            }
        }
    };

    this.texture_loader = new TextureLoader(loading_manager);
};