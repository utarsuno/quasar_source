'use strict';

function ShaderGroup(loading_manager, fully_loaded_callback) {
    this.__init__(loading_manager, fully_loaded_callback);
}

ShaderGroup.prototype = {

    __init__: function(loading_manager, fully_loaded_callback) {
        // Inherit.
        AssetLoaderGroup.call(this, ASSET_GROUP_SHADER, loading_manager, fully_loaded_callback);

        this.loader_class = THREE.FileLoader;
        this.send_asset_to = MANAGER_SHADER.set_shader;
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __      __   ___  __          __   ___  __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`    |__) |__  /  \ |  | | |__) |__  |  \
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/    |  \ |___ \__X \__/ | |  \ |___ |__/ */
    _add_required_initial_assets: function(callback) {
        this._add_required_initial_asset(SHADER_TRANSITION_FRAGMENT);
        this._add_required_initial_asset(SHADER_TRANSITION_VERTEX);
        this._add_required_initial_asset(SHADER_NOISE_FRAGMENT);
        this._add_required_initial_asset(SHADER_NOISE_VERTEX);
        callback();
    }
};