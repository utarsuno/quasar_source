'use strict';

ManagerManager.prototype.set_texture_loader = function(loading_manager) {
    function TextureLoader(loading_manager) {
        this.__init__(loading_manager);
    }

    TextureLoader.prototype = {

        __init__: function(loading_manager) {
            this.loader_class  = THREE.TextureLoader;
            this.send_asset_to = MANAGER_TEXTURE.set_texture;
            this._number_of_assets_to_load = 8;
            MANAGER_TEXTURE.set_number_of_total_assets(this._number_of_assets_to_load);

            // Inherit.
            ManagerManager.prototype.AssetLoaderGroup.call(this, ASSET_GROUP_TEXTURE, loading_manager);
        },

        /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
         | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
         | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
        get_asset_path_name: function(asset) {
            l(asset);
            switch(asset) {
            case SPRITESHEET_ICONS:
                return 'spritesheet/i.png';
            case TRANSITION_GRID:
                return 'third_party/t.png';
            case SKYBOX_FRONT:
                return 'skybox/f.jpg';
            case SKYBOX_BACK:
                return 'skybox/ba.jpg';
            case SKYBOX_LEFT:
                return 'skybox/l.jpg';
            case SKYBOX_RIGHT:
                return 'skybox/r.jpg';
            case SKYBOX_TOP:
                return 'skybox/t.jpg';
            case SKYBOX_BOTTOM:
                return 'skybox/bo.jpg';
            }
        }
    };

    this.texture_loader = new TextureLoader(loading_manager);
};